<template>
  <div :id="id" class="upload-field">
    <div
      id="upload_content"
      :class="['upload-field__content', { 'upload-field--error': !valid, 'upload-field--disabled': disabled }, { 'upload-field-drop': isDragging }]"
      @drop="handelOnDrop"
      @dragover="handleDragOver"
      @dragenter="handelOnDragEnter"
      @dragleave="handleOnDragLeave"
    >
      <input ref="picture_upload" type="file" alt="" title="" :accept="accept" :multiple="multiple" @input="handelOnChangeFile" />
      <div v-if="!multiple && localVal.length === 1" class="upload-field__image">
        <div class="upload-field__image--remove">
          <v-icon color="white" @click="handelOnRemove">mdi-delete</v-icon>
        </div>
        <v-img v-if="!multiple && localVal.length === 1" :src="localVal[0]" class="grey lighten-4" width="100%" height="100%" contain />
      </div>
      <div v-else-if="isDragging" class="upload-field__drop-zone">
        <v-avatar color="#1967d2">
          <v-icon dark>mdi-tray-arrow-up</v-icon>
        </v-avatar>
        <div class="mt-4 text-subtitle-1 font-weight-light">Drop your image to here</div>
      </div>
      <div v-else class="upload-field__normal">
        <v-icon size="32">mdi-image</v-icon>
        <div class="text-subtitle-1 font-weight-light">Drag and drop or <div @click="$refs.picture_upload.click()">browse</div></div>
      </div>
    </div>
    <div :class="['upload-field__details', { 'upload-field__details--hide': hideDetails }]">
      <VMessages v-if="errorBucket.length < 1 && !!hint && (persistentHint || isFocused)" :value="[hint]" />
      <VMessages :value="errorBucket" color="error"/>
    </div>
  </div>
</template>

<script>
import Compressor from 'compressorjs'
import VInput from 'vuetify/lib/components/VInput/VInput.js'
export default {
  name: 'UploadImageField',
  extends: VInput,
  inject: {
    form: { default: null }
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      },
    },
    accept: {
      type: String,
      default: 'image/png,image/jpg'
    },
    imageMaxDimension: {
      type: Array,
      default() {
        return [640, 640]
      }
    },
    multiple: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      localVal: [],
      raws: [],
      fileCompressor: null,
      isDragging: false,
      processing: false
    }
  },
  watch: {
    value(val) {
      this.localVal = val || []
    },
  },
  mounted() {
    this.valid = true
    this.localVal = this.value
  },
  methods: {
    validate(force, value) {
      if (!force) return
      const errorBucket = []
      value = value || this.localVal
      if (force) this.hasInput = this.hasFocused = true

      for (const rule of this.rules) {
        const valid = typeof rule === 'function' ? rule(value) : rule
        if (typeof valid === 'string') {
          errorBucket.push(valid)
        } else if (typeof valid !== 'boolean') {
          console.error(`Rules should return a string or boolean, received '${typeof valid}' instead`, this)
        }
      }
      this.errorBucket = errorBucket
      this.valid = errorBucket.length === 0

      return this.valid
    },
    reset() {
      this.valid = true
      this.localVal = []
      this.raws = []
      this.errorBucket = []
      this.$emit('input', this.localVal)
    },
    resetValidation() {
      this.valid = true
      this.errorBucket = []
    },
    getRaws() {
      return this.raws
    },
    handelOnChangeFile() {
      this.onConvertImage()
    },
    handelOnDrop(e) {
      e.preventDefault()
      if (this.disabled || this.localVal.length > 0) return
      this.isDragging = false
      const files = e.dataTransfer.files
      this.$refs.picture_upload.files = files
      this.onConvertImage()
    },
    handelOnDragEnter(e) {
      e.preventDefault()
      if (this.disabled || this.localVal.length > 0) return
      this.isDragging = true
    },
    handleOnDragLeave(e) {
      if (this.disabled || this.localVal.length > 0) return
      this.isDragging = false
    },
    handleDragOver(e) {
      if (this.disabled || this.localVal.length > 0) return
      e.preventDefault()
    },
    parseImage(file) {
      return new Promise((resolve, reject) => {
        let raw
        const onImageLoaded = (e) => {
          resolve([e.target.result, raw])
        }
        const onCompressed = (result) => {
          const reader = new FileReader()
          reader.onload = onImageLoaded
          raw = result
          reader.readAsDataURL(raw)
        }

        this.fileCompressor = new Compressor(file, {
          convertSize: 5000000,
          maxWidth: this.imageMaxDimension[0],
          maxHeight: this.imageMaxDimension[1],
          success: onCompressed,
          error: reject
        })
      })
    },
    async onConvertImage() {
      try {
        let files = this.$refs.picture_upload.files
        if (!this.multiple) files = [files[0]]
        const accept = this.accept.split(',').map((x) => x.trim()).filter((x) => !!x)
        const raws = []
        const imgs = []
        this.processing = true
        for (const file of files) {
          if (!accept.includes(file.type)) throw new Error('Some file not support')
          const [img, raw] = await this.parseImage(file)
          imgs.push(img)
          raws.push(raw)
        }
        this.localVal = imgs
        this.raws = raws
        this.$refs.picture_upload.value = null
        this.$refs.picture_upload.type = 'text'
        this.$refs.picture_upload.type = 'file'
        this.$emit('input', this.localVal)
        this.$emit('change', this.localVal, this.raws)
        this.validate(true, this.localVal)
      } catch (error) {
        console.error(error)
        this.errorBucket[0] = error.message
        this.valid = false
      } finally {
        this.processing = false
      }
    },
    handelOnRemove() {
      this.localVal = []
      this.raws = []
      this.$emit('input', this.localVal)
      this.$emit('change', this.localVal, this.raws)
      this.validate(true, this.localVal)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-field {
  position: relative;

  &__content {
    border: thin dashed #1967d2 !important;
    border-radius: 4px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 4px;
    width: 100%;
    height: 240px;
    background-color: #E8F0FE;
    overflow: hidden;
    z-index: 1;
    color: #1967d2 !important;

    & * {
      pointer-events: none;
    }

    & > input {
      display: none;
    }
  }
  &__drop-zone {
    text-align: center;
  }

  &--error {
    border: 2px solid rgb(255, 82, 82) !important;
  }

  &__disabled {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  &__details {
    margin-bottom: 8px;
    padding: 0 12px;
    display: flex;
    flex: 1 0 auto;
    max-width: 100%;
    min-height: 14px;
    overflow: hidden;

    &--hide {
      display: none !important;
    }
  }

  &--readonly {
    cursor: auto;
  }

  &:hover &__image--remove  {
    display: flex;
    & > * {
      pointer-events: auto;
    }
  }

  &__image {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    &--remove {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.25);
      align-items: center;
      justify-content: center;
    }
  }

  &__normal {
    text-align: center;
    & > i {
      color: #1967d2;
    }
    & > div > div {
      display: inline-block;
      text-decoration: underline;
      cursor: pointer;
      pointer-events: auto;
    }
  }
}
</style>
