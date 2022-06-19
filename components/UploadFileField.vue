<template>
  <div class="upload-field">
    <div :class="['upload-field__wrap', { 'upload-field--error': !valid, 'upload-field--disabled': disabled }]" @click="onToggleAction">
      <input
        v-show="false"
        ref="file_upload"
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
      <div v-else :class="['upload-field__text']">
        <v-icon color="blue-grey" size="48">mdi-cloud-upload-outline</v-icon>
        <div class="mx-auto mt-4">
          <!-- <v-icon color="blue" size="18" left>mdi-tray-arrow-up</v-icon> -->
          <span class="text-body-2 blue-grey--text">{{ addText }}</span>
        </div>
      </div>
    </div>
    <div :class="['upload-field__details', { 'upload-field__details--hide': hideDetails }]">
      <VMessages v-if="errorBucket.length < 1 && !!hint && (persistentHint || isFocused)" :value="[hint]" />
      <VMessages :value="errorBucket" color="error"/>
    </div>
  </div>
</template>

<script>
import VInput from 'vuetify/lib/components/VInput/VInput.js'
export default {
  name: 'UploadFileField',
  extends: VInput,
  inject: {
    form: { default: null }
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    accept: {
      type: String,
      default: '*.*',
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
      this.$refs.file_upload.click()
    },
    onChangeImage() {
      const input = this.$refs.file_upload.files
      if (!input || !input[0]) return
      this.localValue = input[0]
      this.$emit('input', this.localValue)
      this.$refs.file_upload.value = null
      this.$refs.file_upload.type = 'text'
      this.$refs.file_upload.type = 'file'
      this.validate(true, this.localValue)
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
    border: thin dashed rgba(96, 125, 139, 0.5) !important;
    border-radius: 4px;
    padding: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    margin-bottom: 4px;
    width: 100%;
    height: 140px;
    background-color: rgba(96, 125, 139, 0.01);
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
