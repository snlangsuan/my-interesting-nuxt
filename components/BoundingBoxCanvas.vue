<template>
  <div class="bbox__container" :style="{ width: width + 'px', height: height + 'px' }">
    <v-stage
      ref="stage"
      :config="stageConfig"
      class="bbox__stage"
    >
      <v-layer ref="layer">
        <v-image :config="imageConfig" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
export default {
  name: 'BoundingBoxCanvas',
  props: {
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    src: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      stageConfig: {
        width: 100,
        height: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      },
      imageConfig: {
        image: null,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      }
    }
  },
  watch: {
    src(val) {
      this.loadImage(val)
    }
  },
  mounted() {
    this.loadImage(this.src)
  },
  methods: {
    loadImage(base64) {
      if (!base64) return
      const image = new Image()
      image.onload = () => {
        const factor  = Math.min(this.width / image.width, this.height / image.height)
        const size = this.calculateAspectRatioFit(image.width, image.height, this.width, this.height)
        this.stageConfig.width = size.width
        this.stageConfig.height = size.height
        this.stageConfig.scaleX = 1 * factor
        this.stageConfig.scaleY = 1 * factor
        this.imageConfig.image = image
        this.imageConfig.width = image.width
        this.imageConfig.height = image.height
      }
      image.src = base64
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
      return {
        width: srcWidth * ratio,
        height: srcHeight * ratio
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bbox {
  &__container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.04);
  }
}
</style>
