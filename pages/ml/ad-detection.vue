<template>
  <div v-resize="onResize" class="ad-detection-page fill-height">
    <div class="ad-detection__container">
      <v-card>
        <v-card-title class="py-2">
          <div>Artwork</div>
          <v-spacer />
          <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div v-if="databases.length > 0">{{ databases.length }} Image samples</div>
          <div v-else>Add Image samples:</div>
          <div class="ad-detection-database">
            <div class="ad-detection-upload-btn" @click="uploadDatabaseDialog = true">
              <v-icon size="18">mdi-tray-arrow-up</v-icon>
              <div class="ad-detection-upload-btn__text">Upload</div>
            </div>
            <div class="ad-detection-database-list">
              <template v-for="item in databases">
                <div :key="item.id" class="ad-detection-database-item">
                  <v-img :src="item.img" width="100%" contain />
                </div>
              </template>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card id="workspace" class="mt-8">
        <v-card-title>Preview</v-card-title>
        <v-divider />
        <v-card-text v-if="databases.length > 0 && !isPreviewUploaded">
          <upload-image-field ref="upload_test" v-model="testImg" add-text="Click to upload" accept="image/jpeg" style="width: 100%" hide-details @change="handleOnUploadTest" />
        </v-card-text>
        <v-card-text v-else-if="isPreviewUploaded">
          <div class="ad-detection-workspace">
            <div class="ad-detection-workspace__canvas">
              <!-- <canvas id="workspace_canvas"></canvas> -->
              <bounding-box-canvas :src="testImg" :width="canvasWidth" :height="canvasHeight" />
            </div>
            <div class="ad-detection-workspace__output"></div>
          </div>
        </v-card-text>
        <v-card-text v-else>
          You must add artwork on top panel before you can preview it here
        </v-card-text>
      </v-card>
    </div>
    <v-dialog v-model="uploadDatabaseDialog" max-width="480" persistent>
      <v-card>
        <v-card-title>Add new artwork</v-card-title>
        <v-card-text>
          <v-form ref="database_form" v-model="createDatabaseValid" @submit.prevent>
            <v-text-field v-model="createDatabase.label" label="Label" :rules="[(x) => !!x || 'Enter label name']" dense outlined />
            <upload-image-field ref="upload_database" v-model="createDatabase.img" :rules="[(x) => !!x || 'Enter image']" add-text="Click to upload" accept="image/jpeg" style="width: 100%" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="uploadDatabaseDialog = false">cancel</v-btn>
          <v-btn color="primary" text @click="handleAddDatabase">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'

class L2 {
  static className = 'L2'
  constructor(config) {
    return tf.regularizers.l1l2(config)
  }
}
tf.serialization.registerClass(L2)

class Lambda extends tf.layers.Layer {
  constructor() {
    super({})
  }

  static get className() {
    return 'Lambda';
  }
}

tf.serialization.registerClass(Lambda)
export default {
  name: 'AdDetectionPage',
  layout: 'ml',
  data() {
    return {
      title: 'Ad Detection',
      databases: [],
      uploadDatabaseDialog: false,
      createDatabaseValid: true,
      createDatabase: {
        label: '',
        img: ''
      },
      initializing: false,
      databaseUpdating: false,
      isPreviewUploaded: false,
      embeddingModel: null,
      canvasWidth: 100,
      canvasHeight: 100,
      testImg: null,
      testOriginalSize: {
        w: 0,
        h: 0,
      },
      testResize: {
        w: 0,
        h: 0
      }
    }
  },
  head() {
      return {
        title: this.title,
      }
  },
  watch: {
    uploadDatabaseDialog(val) {
      this.$nextTick(() => {
        this.$refs.database_form.reset()
      })
    },
  },
  mounted() {
    this.initialize()
  },
  methods: {
    async initialize() {
      try {
        this.initializing = true
        const model = await tf.loadLayersModel('/models/detection-offline-ad/model.json')
        console.log(model)
        this.embeddingModel = model
      } catch (error) {
        console.error(error)
      } finally {
        this.initializing = false
      }
    },
    onResize() {
      const workspaceElem = document.querySelector('#workspace')
      if (workspaceElem) {
        const workspaceWidth = workspaceElem.offsetWidth - 32
        this.canvasWidth = Math.round(workspaceWidth * 0.6)
        this.canvasHeight = this.canvasWidth
        console.log(workspaceWidth)
      }
      // const bodyWidth = window.innerWidth
      // const contentWidth = bodyWidth >= 800 ? 800 - 32 :
    },
    resizeCanvas() {
      const workspaceElem = document.querySelector('#workspace')
      if (workspaceElem) {
        console.log(workspaceElem.offsetWidth)
      }
    },
    handleAddDatabase() {
      if (!this.$refs.database_form.validate()) return
      try {
        this.databaseUpdating = true
        console.log('upload', this.createDatabase)
        const image = new Image()
        image.onload = () => {
          const tensor = tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().div(tf.scalar(255)).expandDims()
          // console.log(tensor.arraySync())
          const result = this.embeddingModel.predict(tensor)
          this.databases.push({
            id: Date.now(),
            img: this.createDatabase.img,
            label: this.createDatabase.label,
            embedded: result.arraySync(),
          })
          this.uploadDatabaseDialog = false
        }
        image.src = this.createDatabase.img
      } catch (error) {

      } finally {
        this.databaseUpdating = false
      }
    },

    handleOnUploadTest(base64, file) {
      this.isPreviewUploaded = true
      this.testImg = base64
      this.findAd(base64.split(',')[1])
    },
    findAd(image) {
      console.log(image)
    }
  },
}
</script>

<style lang="scss" scoped>
.ad-detection {
  &-page {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-database {
    padding-top: 8px;
    display: flex;

    &-list {
      overflow: hidden;
      overflow-x: auto;
      margin-left: 8px;
      display: flex;
    }

    &-item {
      width: 58px;
      height: 58px;
    }

    &-list > &-item + &-item {
      margin-left: 4px;
    }
  }

  &-workspace {
    display: flex;

    &__canvas {

    }
  }
  &__container {
    max-width: 800px;
    width: 100%;
    margin: auto;
  }
  &-upload-btn {
    width: 72px;
    height: 58px;
    padding: 4px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #E8F0FE;
    border-radius: 4px;
    cursor: pointer;
    position: relative;

    & > input {
      display: none;
    }

    & > i,
    & > &__text {
      color: #1967d2;
    }

    & > &__text {
      font-size: 0.8rem;
    }

    &:hover {
      background-color: #D2E3FC;
    }
  }
}
</style>
