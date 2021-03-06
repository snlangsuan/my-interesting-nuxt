<template>
  <div class="upload-field">
    <div :class="['upload-field__wrap', { 'upload-field--error': !valid, 'upload-field--disabled': disabled }]" @click="onToggleAction">
      <input
        v-show="false"
        ref="picture_upload"
        type="file"
        class="upload-field__input"
        alt=""
        title=""
        accept="image/png,image/jpg"
        @input="onChangeImage"
      />
      <div v-if="localValue" class="upload-field__img">
        <v-img :src="localValue" class="grey lighten-4" width="100%" height="100%" contain></v-img>
      </div>
      <div v-else-if="src">
        <v-img :src="url" class="grey lighten-4" width="100%" height="100%" contain></v-img>
      </div>
      <div v-else :class="['upload-field__text']">
        <v-icon color="#1aa24e" size="48">mdi-image-plus</v-icon>
        <div class="mx-auto mt-4">
          <v-icon color="#1aa24e" size="18" left>mdi-tray-arrow-up</v-icon>
          <span class="text-body-2" style="color: #1aa24e">{{ addText }}</span>
        </div>
      </div>
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
    }
  },
  data() {
    return {
      url: '',
      localValue: '',
      originalFile: null,
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
      this.$emit('input', this.localValue)
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
      if (this.readOnly || this.disabled) return
      // if (this.localValue || this.url) {
      //   this.onRemove()
      // } else {
      this.onSelectImage()
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-field {
  position: relative;
  &__wrap {
    border: thin dashed rgba(26, 162, 78) !important;
    border-radius: 4px;
    padding: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    margin-bottom: 4px;
    width: 240px;
    height: 240px;
    background-color: #f2faf5;
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
    flex: 100%;
    position: relative;
    text-align: center;
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
