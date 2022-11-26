<template>
  <div class="upload-field">
    <div :class="['upload-field__wrap', { 'upload-field--error': !valid, 'upload-field--disabled': disabled }, { 'upload-field-drop': isDragging }]" @drop="onDropFile" @dragleave="onDragLeave" @dragenter="onDragOver">
      <input
        v-show="false"
        ref="picture_upload"
        type="file"
        class="upload-field__input"
        alt=""
        title=""
        :accept="accept"
        @input="onChangeImage"
      />
      <div v-if="localValue" class="upload-field__img">
        <v-img :src="localValue" class="grey lighten-4" width="100%" height="100%" contain></v-img>
      </div>
      <div v-else-if="src">
        <v-img :src="url" class="grey lighten-4" width="100%" height="100%" contain></v-img>
      </div>
      <div v-else :class="['upload-field__text']" @click="onToggleAction" >
        <!-- <v-icon color="#1967d2" size="48">mdi-image-plus</v-icon> -->
        <div v-if="!localValue && isDragging" class="upload-field-drop__text text-center">
          <div><v-icon>mdi-download</v-icon></div>
          Drop image to upload them here
        </div>
        <div v-else class="mx-auto mt-4">
          <v-icon color="#1967d2" size="18" left>mdi-tray-arrow-up</v-icon>
          <span class="text-body-2" style="color: #1967d2">{{ addText }}</span>
        </div>
      </div>
      <div v-if="!readOnly && !disabled && localValue" class="upload-field__remove-btn">
        <v-icon color="white" @click="onRemove">mdi-delete</v-icon>
      </div>
      <!-- <div v-if="!readOnly && !disabled && !localValue && isDragging" class="upload-field__drop">
        Drop image to upload them here
      </div> -->
      <!-- <div class="upload-field__img">
        <v-img v-if="localValue" :src="localValue" class="grey lighten-4" max-height="80" contain></v-img>
        <v-img v-else-if="src" :src="url" class="grey lighten-4" max-height="80" contain></v-img>
        <v-icon v-else>mdi-image-plus</v-icon>
      </div>
      <div :class="['upload-field__text']">
        <div v-if="readonly"></div>
        <div v-else-if="localValue || url" class="upload-field__remove">
          <v-icon size="18" left>mdi-delete-outline</v-icon>
          <span>{{ removeText }}</span>
        </div>
        <div v-else>
          <v-icon size="18" left>mdi-tray-arrow-up</v-icon>
          <span>{{ addText }}</span>
        </div>
      </div> -->
    </div>
    <div :class="['upload-field__details', { 'upload-field__details--hide': hideDetails }]">
      <VMessages v-if="errorBucket.length < 1 && !!hint && (persistentHint || isFocused)" :value="[hint]" />
      <VMessages :value="errorBucket" color="error"/>
    </div>
    <!-- <div v-if="disabled" class="upload-field__disabled"></div> -->
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
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    addText: {
      type: String,
      default: 'เพิ่มภาพ'
    },
    removeText: {
      type: String,
      default: 'นำออก'
    },
    accept: {
      type: String,
      default: 'image/png,image/jpg'
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      url: '',
      localValue: '',
      originalFile: null,
      isDragging: false,
    }
  },
  watch: {
    value(val) {
      this.localValue = val
    },
    src(val) {
      this.url = val
    }
  },
  mounted() {
    this.valid = true
    this.url = this.src
    this.localValue = this.value
  },
  created () {
    this.form && this.form.register(this)
  },
  beforeDestroy () {
    this.form && this.form.unregister(this)
  },
  methods: {
    validate(force, value) {
      if (!force) return
      const errorBucket = []
      value = value || this.localValue
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
      this.url = ''
      this.localValue = ''
      this.originalFile = null
      this.errorBucket = []
      this.$emit('input', this.localValue)
    },
    resetValidation() {
      this.valid = true
      this.errorBucket = []
    },
    getOriginalFile() {
      return this.originalFile
    },
    onRemove() {
      if (this.disabled) return
      this.url = ''
      this.localValue = ''
      this.originalFile = null
      this.$emit('input', this.localValue)
      this.validate(true, this.localValue)
    },
    onSelectImage() {
      if (this.disabled) return
      this.$refs.picture_upload.click()
    },
    onChangeImage() {
      const input = this.$refs.picture_upload.files
      if (input && input[0]) {
        if (input[0].type !== 'image/jpeg') return
        // eslint-disable-next-line no-unused-vars
        const file = new Compressor(input[0], { convertSize: 5000000, maxWidth: 1040, success: (result) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.localValue = e.target.result
            this.$emit('input', this.localValue)
            this.$emit('change', this.localValue, result)
            this.$refs.picture_upload.value = null
            this.$refs.picture_upload.type = 'text'
            this.$refs.picture_upload.type = 'file'
            this.validate(true, this.localValue)
          }
          reader.readAsDataURL(result)
          this.originalFile = result
        }})
      }
    },
    onToggleAction() {
      if (this.readOnly || this.disabled || this.localValue) return
      // if (this.localValue || this.url) {
      //   this.onRemove()
      // } else {
      this.onSelectImage()
      // }
    },
    onDragOver(e) {
      e.preventDefault()
      this.isDragging = true
      console.log('over')
    },
    onDragLeave(e) {
      console.log('leave')
      this.isDragging = false
    },
    onDropFile(e) {
      e.preventDefault()
      this.$refs.picture_upload.files = e.dataTransfer.files
      this.onChangeImage()
      this.isDragging = false
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-field {
  position: relative;
  &__wrap {
    border: thin dashed #1967d2 !important;
    border-radius: 4px;
    padding: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    margin-bottom: 4px;
    width: 100%;
    height: 240px;
    background-color: #E8F0FE;
    overflow: hidden;
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

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    width: 100%;
    opacity: 0;
  }

  &__img {
    // width: 80px;
    // height: 80px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  &__text {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__wrap:hover > &__remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__remove-btn {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &-drop {
    background-color: #f0f0f0;
    border: thin dashed #dddddd !important;
    &__text {}
  }

  // &__text > * {
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   position: absolute;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  // }

  &--error > &__text > * > * {
    color: #dd2c00;
  }

  &__wrap:not(&--disabled) &__remove > * {
    color: #dd2c00 !important;
  }

  &__wrap:not(&--error):not(&--disabled):hover > &__text > * > * {
    color: rgba(26, 162, 78);
  }
}
</style>
