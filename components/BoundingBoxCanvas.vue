<template>
  <div class="bbox__container" :style="{ width: width + 'px', height: height + 'px' }">
    <v-stage
      ref="stage"
      :config="stageConfig"
      class="bbox__stage"
    >
      <v-layer ref="layer">
        <v-image ref="background" :config="imageConfig" />
        <template v-for="shp in shapes">
          <v-rect
            :key="'shape-' + shp.$id"
            :config="shp"
          />
          <v-text :key="'text-' + shp.$id" :config="{ text: 'P' + (shp.$index + 1), x: shp.x + 4, y: shp.y + 4, fontSize: 14, fill: '#ffffff' }" />
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
    },
    width(val) {
      this.updateStageSize()
      // this.loadBox(this.bboxes)
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
        // console.log('image size:', image.width, image.height)
        this.imageConfig.image = image
        this.imageConfig.width = image.width
        this.imageConfig.height = image.height
        this.updateStageSize()
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
        $index: x.$index,
        $id: x.id,
      }))
      // console.log(items)
      this.shapes = items
    },
    updateStageSize() {
      // const image = this.imageConfig.image
      const factor  = Math.min(this.width / this.imageConfig.width, this.height / this.imageConfig.height)
      this.imageFactor = factor
      const size = this.calculateAspectRatioFit(this.imageConfig.width, this.imageConfig.height, this.width, this.height)
      this.stageConfig.width = size.width
      this.stageConfig.height = size.height
      this.stageConfig.scaleX = 1 * factor
      this.stageConfig.scaleY = 1 * factor
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
      return {
        width: srcWidth * ratio,
        height: srcHeight * ratio
      }
    },
    async getImageDataBoxes(positions) {
      const imgNode = this.$refs.background.getNode()
      const xScale = imgNode.width() / this.stageConfig.width
      const yScale = imgNode.height() / this.stageConfig.height

      const items = []
      for (const item of positions) {
        const _x = parseInt(Math.round(item.rectangle.x / xScale))
        const _y = parseInt(Math.round(item.rectangle.y / yScale))
        const _width = parseInt(Math.round(item.rectangle.width / xScale))
        const _height = parseInt(Math.round(item.rectangle.height / yScale))
        const img = await imgNode.toImage({ x: _x, y: _y, width: _width, height: _height, mimeType: 'image/jpeg' })
        items.push(img)
      }
      return items
    },
    async getDataURL() {
      const stageNode = this.$refs.stage.getNode()
      const img = await stageNode.toDataURL({ x: 0, y: 0, width: this.stageConfig.width, height: this.stageConfig.height, mimeType: 'image/jpeg' })
      return img
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
