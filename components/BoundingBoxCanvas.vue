<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <v-stage
      ref="stage"
      :config="stageConfig"
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
      },
      imageConfig: {
        image: null,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      }
    }
  },
  watch: {
    src(val) {
      this.imageConfig.image = val
    }
  },
  mounted() {
  },
  methods: {
    loadImage(base64) {
      if (!base64) return
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
          resolve(image)
        }
        image.src = base64
      })
    }
  }
}
</script>
