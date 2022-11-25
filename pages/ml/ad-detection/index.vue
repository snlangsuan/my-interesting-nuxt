<template>
  <div v-resize="onResize" class="ad-detection-page fill-height">
    <div class="ad-detection__container">
      <v-card>
        <v-card-title class="py-2">
          <div>Artwork</div>
          <v-spacer />
          <v-menu bottom left>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
            </template>
            <v-list>
              <v-list-item :disabled="databases.length < 1" @click="handleOnDeleteDatabase">
                <v-list-item-title>Delete Database</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div v-if="databases.length > 0">{{ databases.length }} Image samples</div>
          <div v-else>Add Image samples:</div>
          <div class="ad-detection-database">
            <div class="ad-detection-upload-btn" @click="handleOnUploadDatabase">
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
      <v-card id="workspace" class="mt-4">
        <v-card-title>
          <div>Preview</div>
          <v-spacer />
          <v-menu v-if="databases.length > 0" bottom left>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
            </template>
            <v-list>
              <v-list-item :disabled="!testImg" @click="handleOnDeletePreview">
                <v-list-item-title>Delete Preview</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="databases.length > 0 && !isPreviewUploaded">
          <upload-image-field ref="upload_test" v-model="testImg" add-text="Click to upload" accept="image/jpeg" style="width: 100%" hide-details @change="handleOnUploadTest" />
        </v-card-text>
        <v-card-text v-else-if="isPreviewUploaded">
          <div class="ad-detection-workspace">
            <div class="ad-detection-workspace__canvas">
              <!-- <canvas id="workspace_canvas"></canvas> -->
              <bounding-box-canvas ref="image_canvas" :src="testImg" :bboxes="bboxes" :width="canvasWidth" :height="canvasHeight" />
            </div>
            <div class="ad-detection-workspace__output">
              <div class="ad-detection-results" :style="{ maxHeight: canvasHeight + 'px' }">
                <div class="ad-detection-results__title">Predictions</div>
                <div class="ad-detection-results__subtitle" style="margin-bottom: 8px">{{ bboxes.length }} objects</div>
                <template v-for="(item, i) in bboxes">
                  <div :key="'res-' + i" class="ad-detection-results__item">
                    <div class="ad-detection-results__label">{{ item.object }}</div>
                    <div class="ad-detection-results__percent">
                      <v-progress-linear :value="item.score * 100" height="18">
                        <div style="width: 100%">
                          <div class="white--text text-right" :style="{ width: Math.ceil(item.score * 100) + '%', paddingRight: '8px' }">{{ Math.ceil(item.score * 100) }}%</div>
                        </div>
                      </v-progress-linear>
                    </div>
                  </div>
                </template>
              </div>
            </div>
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
            <v-text-field v-model="createDatabase.label" label="Label" :rules="[(x) => !!x || 'Enter label name', chkLabelDuplicate]" dense outlined />
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
    <v-overlay v-model="initializing">
      <div class="ad-detection__overlay-box">Loading model...</div>
    </v-overlay>
    <v-overlay v-model="databaseUploading">
      <div class="ad-detection__overlay-box">Uploading database...</div>
    </v-overlay>
    <v-overlay v-model="testUploading">
      <div class="ad-detection__overlay-box">Finding offline advertise...</div>
    </v-overlay>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
import * as randomColor from 'randomcolor'
import { cosineSimilarity } from '@/pages/ml/ad-detection/function/util'

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
      initializing: true,
      databaseUploading: false,
      testUploading: false,
      isPreviewUploaded: false,
      embeddingModel: null,
      canvasWidth: 100,
      canvasHeight: 100,
      testImg: null,
      bboxes: [],
      knn: null,
    }
  },
  head() {
      return {
        title: this.title,
      }
  },
  // watch: {
  //   uploadDatabaseDialog(val) {
  //     this.$nextTick(() => {
  //       this.$refs.database_form.resetValidation()
  //     })
  //   },
  // },
  mounted() {
    this.initialize()
  },
  methods: {
    async initialize() {
      try {
        this.initializing = true
        const loadedModel = localStorage.getItem('detection-offline-ad')
        if (loadedModel) {
          const model = await tf.loadLayersModel('indexeddb://detection-offline-ad')
          this.embeddingModel = model
        } else {
          const model = await tf.loadLayersModel('/models/detection-offline-ad/model.json')
          this.embeddingModel = model
          await model.save('indexeddb://detection-offline-ad')
          localStorage.setItem('detection-offline-ad', true)
        }
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
        const create = JSON.parse(JSON.stringify(this.createDatabase))
        this.uploadDatabaseDialog = false
        this.databaseUploading = true
        const image = new Image()
        image.onload = () => {
          const result = this.getEmbedded(image)
          this.databases.push({
            id: Date.now(),
            img: create.img,
            label: create.label,
            embedded: result,
          })
          this.trainingModel(this.databases)
        }
        image.src = this.createDatabase.img
      } catch (error) {

      } finally {
        this.databaseUploading = false
        this.createDatabase.img = null
        this.createDatabase.label = ''
      }
    },

    async handleOnUploadTest(base64, file) {
      try {
        this.testUploading = true
        this.isPreviewUploaded = true
        this.testImg = base64
        await this.findAd(base64.split(',')[1])
      } catch (error) {
        console.error(error)
      } finally {
        this.testUploading = false
      }
    },
    async findAd(image) {
      // console.log(image)
      const body = { image }
      const response = await this.$axios.$post('https://ad-detection-service-bxltsvmqda-as.a.run.app/ads/detection', body)
      console.log(response)
      const items = await this.$refs.image_canvas.getImageData(response.objects)
      console.log('count detected', items.length)
      const boxes = []
      const colors = randomColor({ count: items.length, luminosity: 'dark' })
      for (const i in items) {
        const item = items[i]
        const embedded = this.getEmbedded(item)
        // embedded.push(result)
        const result = this.querySimilarity(embedded)
        if (result) {
          boxes.push({ ...response.objects[i], object: result.label, score: result.score, color: colors[i] })
        }
      }
      // if (this.knn) {
      //   console.log(this.knn.predict(embedded))
      // }
      console.log('boxes', boxes)
      this.bboxes = boxes
    },
    trainingModel(train) {
      const embedded = train.map((x) => x.embedded)
      const labels = train.map((x) => x.id)
      this.knn = { embedded, labels }
      // new KNN(embedded, labels, { k: 2, distance:  })
    },
    getEmbedded(img) {
      const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().div(tf.scalar(255)).expandDims()
      const result = this.embeddingModel.predict(tensor)
      return result.arraySync()[0]
    },
    querySimilarity(sample) {
      const embedded = this.knn.embedded
      const labels = this.knn.labels
      let maxIdx = -1
      let maxVal = 0
      for (const i in  embedded) {
        const item = embedded[i]
        // const idx = labels[i]
        const cosim = cosineSimilarity(item, sample)
        if (cosim > maxVal) {
          maxIdx = labels[i]
          maxVal = cosim
        }
      }
      if (maxIdx === -1 || maxVal < 0.6) return null
      const item = this.queryDatabase(maxIdx)
      return {
        id: maxIdx,
        label: item?.label,
        score: maxVal
      }
    },
    queryDatabase(id) {
      return this.databases.find((x) => x.id === id)
    },
    handleOnDeletePreview() {
      this.testImg = null
      this.bboxes = []
      this.isPreviewUploaded = false
    },
    handleOnDeleteDatabase() {
      this.databases = []
    },
    handleOnUploadDatabase() {
      this.uploadDatabaseDialog = true
      this.$nextTick(() => {
        this.$refs.database_form.reset()
        this.$refs.database_form.resetValidation()
      })
    },
    chkLabelDuplicate(label) {
      const item = this.databases.find((x) => x.label === label)
      console.log(label, '=>', item, this.databases)
      return !item || 'Label already exists.'
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
      flex: 0;
    }

    &__output {
      flex: 1;
    }
  }
  &__overlay-box {
    min-width: 320px;
    text-align: center;
    background-color: #fff;
    padding: 32px 16px;
    color: #212121;
    border-radius: 4px;
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
  &-results {
    overflow: hidden;
    overflow-y: auto;
    margin-left: 16px;

    &__title {
      font-size: 1.1rem;
      font-weight: 600;
    }

    &__item {
      display: flex;
      align-items: center;
      padding: 16px 0;
    }
    &__color-box {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    &__label {
      margin-right: 8px;
      max-width: 30%;
      width: 30%;
    }

    &__percent {
      flex: 1;
    }
  }
}
</style>
