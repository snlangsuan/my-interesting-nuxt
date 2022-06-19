<template>
  <div class="text-predict-field">
    <div class="text-predict-field__predicted">{{ predicted }}</div>
    <v-text-field :value="localText" tabindex="1" dense single-line outlined hide-details @keydown.enter.tab="onFullText" @keyup="onChange"></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'TextPredictFieldComponent',
  props: {
    value: {
      type: String,
      default: '',
    },
    predicted: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      localText: '',
      localPredicted: '',
    }
  },
  watch: {
    value(val) {
      this.localText = val
    },
    predicted(val) {
      this.localPredicted = val
    }
  },
  mounted() {
    this.localText = this.value
    this.localPredicted = this.predicted
  },
  methods: {
    onFullText(e) {
      this.$emit('input', this.localPredicted)
    },
    onChange(e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-predict-field {
  position: relative;
  & > &__predicted {
    position: absolute;
    top: 8px;
    bottom: 0;
    left: 12px;
    right: 0;
    color: rgba(0, 0, 0, 0.3);
  }
}
</style>
