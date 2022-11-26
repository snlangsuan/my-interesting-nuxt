<template>
  <div class="bbox__container" :style="{ width: width + 'px', height: height + 'px' }">
    <v-stage
      ref="stage"
      :config="stageConfig"
      class="bbox__stage"
    >
      <v-layer ref="layer">
        <v-image ref="background" :config="imageConfig" />
        <template v-for="(shp, i) in shapes">
          <v-rect
            :key="'shape-' + i"
            :config="shp"
          />
        </template>
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
    },
    bboxes: {
      type: Array,
      default() {
        return []
      },
    },
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
      },
      shapes: [],
      imageFactor: 1,
    }
  },
  watch: {
    src(val) {
      this.loadImage(val)
    },
    bboxes(val) {
      this.loadBox(val)
    }
  },
  mounted() {
    this.loadImage(this.src)
    this.loadBox(this.bboxes)
  },
  methods: {
    loadImage(base64) {
      if (!base64) return
      const image = new Image()
      image.onload = () => {
        console.log('image size:', image.width, image.height)
        const factor  = Math.min(this.width / image.width, this.height / image.height)
        this.imageFactor = factor
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
    loadBox(bboxes) {
      if (!Array.isArray(bboxes)) return
      const items = bboxes.map((x, i) => ({
        rotation: 0,
        x: x.rectangle.x,
        y: x.rectangle.y,
        width: x.rectangle.width,
        height: x.rectangle.height,
        stroke: x.color,
        fill: x.color,
        strokeWidth: 5,
        opacity: 0.6,
      }))
      console.log(items)
      this.shapes = items
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
      return {
        width: srcWidth * ratio,
        height: srcHeight * ratio
      }
    },
    async getImageData(position) {
      const imgNode = this.$refs.background.getNode()
      const xScale = imgNode.width() / this.stageConfig.width
      const yScale = imgNode.height() / this.stageConfig.height

      const items = []
      for (const item of position) {
        const _x = parseInt(Math.round(item.rectangle.x / xScale))
        const _y = parseInt(Math.round(item.rectangle.y / yScale))
        const _width = parseInt(Math.round(item.rectangle.width / xScale))
        const _height = parseInt(Math.round(item.rectangle.height / yScale))
        const img = await imgNode.toImage({ x: _x, y: _y, width: _width, height: _height })
        items.push(img)
      }
      return items
    },
    reset() {
      this.imageConfig.image = null
      this.shapes = []
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
