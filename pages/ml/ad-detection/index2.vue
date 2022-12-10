<template>
  <div v-resize="onResize" class="ad-detection-page fill-height">
    <div class="ad-detection__container">
      <v-fade-transition>
        <v-card>
          <v-card-title class="py-2">
            <v-btn icon :class="['mr-2', hideArtWork ? 'ad-detection-btn--up' : 'ad-detection-btn--down']" @click="hideArtWork = !hideArtWork">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
            <div>Artwork</div>
            <v-spacer />
            <v-menu bottom left>
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on"
                  ><v-icon>mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <v-list>
                <v-list-item @click="handleOnLocalizationThreshold">
                  <v-list-item-title>Localization threshold</v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleOnClassificationThreshold">
                  <v-list-item-title>Similarity threshold</v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="databases.length < 1"
                  @click="handleOnDeleteDatabase"
                >
                  <v-list-item-title class="error--text"
                    >Delete Database</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-divider v-show="!hideArtWork" />
          <v-card-text v-show="!hideArtWork">
            <div v-if="databases.length > 0">
              {{ databases.length }} Annotation
            </div>
            <div v-else>Add Annotation:</div>
            <div class="ad-detection-database">
              <div
                class="ad-detection-upload-btn"
                @click="handleOnUploadDatabase"
              >
                <v-icon size="18">mdi-tray-arrow-up</v-icon>
                <div class="ad-detection-upload-btn__text">Upload</div>
              </div>
              <div class="ad-detection-database-list">
                <template v-for="item in databases">
                  <div :key="item.id" class="ad-detection-database-item">
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on">
                          <v-img :src="item.img" width="100%" contain />
                          <div class="ad-detection-database-item__remove">
                            <v-icon
                              color="white"
                              @click="handleOnRemoveDatabase(item.id)"
                              >mdi-close-circle</v-icon
                            >
                          </div>
                        </div>
                      </template>
                      <span>{{ item.label }}</span>
                    </v-tooltip>
                  </div>
                </template>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-fade-transition>

      <v-card id="workspace" class="mt-4">
      </v-card>
      <v-card id="workspace" class="mt-4">
        <v-card-title class="py-2">
          <div>Preview</div>
          <v-spacer />
          <v-menu v-if="sampleImgs" bottom left>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"
                ><v-icon>mdi-dots-vertical</v-icon></v-btn
              >
            </template>
            <v-list>
              <v-list-item v-if="sampleImgs.length === 1" :disabled="!sampleImgs" @click="handleOnDetectAgain">
                <v-list-item-title>Detect Again</v-list-item-title>
              </v-list-item>
              <v-list-item
                :disabled="!sampleImgs"
                @click="handleOnDeletePreview"
              >
                <v-list-item-title class="error--text"
                  >Delete Preview</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="databases.length > 0 && !isPreviewUploaded">
          <upload-image-field
            ref="upload_test"
            v-model="sampleImgs"
            add-text="Click to upload"
            accept="image/jpeg"
            style="width: 100%"
            multiple
            @change="handleOnUploadPreview"
          />
        </v-card-text>
        <!-- <v-card-text v-else-if="isPreviewUploaded">
          <div class="ad-detection-workspace" :style="{ display: screenWidth > 560 ? 'flex' : 'block' }">
            <div class="ad-detection-workspace__canvas">
              <bounding-box-canvas ref="image_canvas" :src="sampleImgs" :bboxes="bboxes" :width="canvasWidth" :height="canvasHeight" />
            </div>
            <div class="ad-detection-workspace__output">
              <div v-if="!testUploading" :class="['ad-detection-results', screenWidth > 560 ? 'pl-4' : 'pt-4']" :style="{ maxHeight: canvasHeight + 'px' }">
                <div class="ad-detection-results__title">Predictions</div>
                <div class="ad-detection-results__subtitle" style="margin-bottom: 8px">{{ bboxes.length }} objects</div>
                <template v-for="(item, i) in bboxes">
                  <div :key="'res-' + i" class="ad-detection-results__item">
                    <div class="ad-detection-results__color-box" :style="{ backgroundColor: item.color }" />
                    <div class="ad-detection-results__label">
                      {{ item.object }}
                    </div>
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
        </v-card-text> -->
        <v-card-text v-else>
          You must add artwork on top panel before you can preview it here
        </v-card-text>
      </v-card>
    </div>
    <div class="ad-detection__footer">
      <div class="ad-detection__footer--text">version: {{ modelVersion }}</div>
    </div>
    <v-dialog v-model="uploadDatabaseDialog" max-width="480" persistent>
      <v-card>
        <v-card-title>Add new artwork</v-card-title>
        <v-card-text class="pb-0">
          <v-form
            ref="database_form"
            v-model="createDatabaseValid"
            @submit.prevent
          >
            <v-text-field
              v-model="createDatabase.label"
              label="Label"
              :rules="[(x) => !!x || 'Enter label name', chkLabelDuplicate]"
              dense
              outlined
            />
            <upload-image-field
              ref="upload_database"
              v-model="createDatabase.img"
              :rules="[(x) => !!x || 'Enter image']"
              add-text="Click to upload"
              accept="image/jpeg"
              style="width: 100%"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="uploadDatabaseDialog = false">cancel</v-btn>
          <v-btn color="primary" text @click="handleAddDatabase">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay v-model="loading.show">
      <div class="ad-detection__overlay-box">{{ loading.message }}</div>
    </v-overlay>
    <v-dialog v-model="hasProblem" max-width="640" persistent>
      <v-card>
        <v-card-text class="py-4 text-center">
          <div class="py-3">
            <v-icon color="primary" size="48">mdi-connection</v-icon>
          </div>
          <div class="text-h6">Something went wrong...</div>
          <div class="text-body-2 pb-6">
            We are working on fixing the problem Please try again.
          </div>
          <v-btn color="primary" plain @click="handleOnReloadPage">
            <v-icon left>mdi-refresh</v-icon>
            Refresh Page
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="classificationThresholdDialog"
      max-width="320"
      persistent
    >
      <v-card>
        <v-card-title>Similarity Threshold</v-card-title>
        <v-card-text class="pb-0">
          <div class="text-h4 font-weight-light">
            {{ tempClassificationThreshold }}
          </div>
          <v-slider
            v-model="tempClassificationThreshold"
            max="1"
            min="0"
            step="0.1"
            color="primary"
            track-color="grey"
            always-dirty
            hide-details
          >
            <template #prepend>
              <v-icon color="primary" @click="handleOnClassificationDecrement">
                mdi-minus
              </v-icon>
            </template>

            <template #append>
              <v-icon color="primary" @click="handleOnClassificationIncrement">
                mdi-plus
              </v-icon>
            </template>
          </v-slider>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="classificationThresholdDialog = false"
            >cancel</v-btn
          >
          <v-btn
            color="primary"
            text
            @click="handelOnSaveClassificationThreshold"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="localizationThresholdDialog" max-width="320" persistent>
      <v-card>
        <v-card-title>Localization Threshold</v-card-title>
        <v-card-text class="pb-0">
          <div class="text-h4 font-weight-light">
            {{ tempLocalizationThreshold }}
          </div>
          <v-slider
            v-model="tempLocalizationThreshold"
            max="1"
            min="0"
            step="0.1"
            color="primary"
            track-color="grey"
            always-dirty
            hide-details
          >
            <template #prepend>
              <v-icon color="primary" @click="handleOnLocalizationDecrement">
                mdi-minus
              </v-icon>
            </template>

            <template #append>
              <v-icon color="primary" @click="handleOnLocalizationIncrement">
                mdi-plus
              </v-icon>
            </template>
          </v-slider>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="localizationThresholdDialog = false"
            >cancel</v-btn
          >
          <v-btn color="primary" text @click="handelOnSaveLocalizationThreshold"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
import seedColor from 'seed-color'
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
    return 'Lambda'
  }
}

tf.serialization.registerClass(Lambda)
export default {
  name: 'AdDetectionPage',
  layout: 'ml',
  data() {
    return {
      title: 'Offline-advertising Detection',
      loading: {
        show: true,
        message: 'Getting model version...',
      },
      databases: [],
      uploadDatabaseDialog: false,
      createDatabaseValid: true,
      createDatabase: {
        label: '',
        img: [],
      },
      initializing: true,
      databaseUploading: false,
      testUploading: false,
      isPreviewUploaded: false,
      embeddingModel: null,
      screenWidth: 100,
      canvasWidth: 100,
      canvasHeight: 100,
      sampleImgs: [],
      bboxes: [],
      knn: null,
      hasProblem: false,
      classificationThresholdDialog: false,
      tempClassificationThreshold: 0.7,
      minimumClassificationThreshold: 0.7,
      localizationThresholdDialog: false,
      tempLocalizationThreshold: 0.6,
      minimumLocalizationThreshold: 0.6,
      confidenceValid: true,
      hasChangVersion: false,
      modelVersion: 0,
      hideArtWork: false,
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
        this.loading.message = 'Getting model version...'
        this.loading.show = true
        await this.getModelVersion()
        this.loading.message = 'Loading model...'
        const loadedModel = localStorage.getItem('detection-offline-ad')
        if (loadedModel) {
          const model = await tf.loadLayersModel(
            'indexeddb://detection-offline-ad'
          )
          this.embeddingModel = model
        } else {
          const model = await tf.loadLayersModel(
            'https://storage.googleapis.com/demo-ml-model/detection-offline-ad/model.json'
          )
          this.embeddingModel = model
          await model.save('indexeddb://detection-offline-ad')
          localStorage.setItem('detection-offline-ad', true)
        }
        this.loading.message = 'Loading database...'
        this.loadDatabaseLocalStorage()

        if (this.hasChangVersion) {
          this.loading.message = 'Re-generate database...'
          this.reversionDatabase()
        }
        const clsThreshold = localStorage.getItem(
          'offline-ad-classification-threshold'
        )
        if (clsThreshold !== null)
          this.minimumClassificationThreshold = Number(clsThreshold)
        const llsThreshold = localStorage.getItem(
          'offline-ad-localization-threshold'
        )
        if (llsThreshold !== null)
          this.minimumLocalizationThreshold = Number(llsThreshold)
      } catch (error) {
        console.error(error)
      } finally {
        this.initializing = false
        this.loading.show = false
      }
    },
    onResize() {
      const workspaceElem = document.querySelector('#workspace')
      this.screenWidth = window.innerWidth
      if (workspaceElem) {
        const workspaceWidth = workspaceElem.offsetWidth - 32
        const percent = this.screenWidth > 560 ? 0.6 : 1
        this.canvasWidth = Math.round(workspaceWidth * percent)
        this.canvasHeight = this.canvasWidth
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
    async handleAddDatabase() {
      if (!this.$refs.database_form.validate()) return
      try {
        const create = JSON.parse(JSON.stringify(this.createDatabase))
        this.uploadDatabaseDialog = false
        this.databaseUploading = true
        this.loading.message = 'Adding Image to database...'
        this.loading.show = true
        const image = await this.base64ToImage(this.createDatabase.img[0])
        const result = this.getEmbedded(image)
        console.log('vector', result)
        const id = Date.now()
        const color = seedColor(id).toHex()
        this.databases.push({
          id,
          img: create.img[0],
          label: create.label,
          embedded: result,
          color,
        })
        this.trainingModel(this.databases)
        this.updateDatabaseLocalStorage(this.databases)
        // const image = new Image()
        // image.onload = () => {
        //   const result = this.getEmbedded(image)
        //   const id = Date.now()
        //   const color = seedColor(id).toHex()
        //   this.databases.push({
        //     id: Date.now(),
        //     img: create.img,
        //     label: create.label,
        //     embedded: result,
        //     color,
        //   })
        //   this.trainingModel(this.databases)
        //   this.updateDatabaseLocalStorage(this.databases)
        // }
        // image.src = this.createDatabase.img
      } catch (error) {
      } finally {
        this.databaseUploading = false
        this.createDatabase.img = null
        this.createDatabase.label = ''
        this.loading.show = false
      }
    },
    handleOnRemoveDatabase(id) {
      if (!id) return
      try {
        const idx = this.databases.findIndex((x) => x.id === id)
        if (idx > -1) {
          this.databases.splice(idx, 1)
          this.trainingModel(this.databases)
          this.updateDatabaseLocalStorage(this.databases)
        }
      } catch (error) {
        console.error('remove database error', error)
      }
    },
    handleOnUploadPreview(images) {
      console.log('select file', images)
      // try {
      //   this.testUploading = true
      //   this.loading.message = 'Finding Offline advertise...'
      //   this.loading.show = true
      //   this.isPreviewUploaded = true
      //   this.sampleImgs = base64
      //   await this.getOfflineAd(base64.split(',')[1])
      // } catch (error) {
      //   console.error(error)
      // } finally {
      //   this.testUploading = false
      //   this.loading.show = false
      // }
    },
    async getOfflineAd(image) {
      // console.log(image)
      const body = { image, threshold: this.minimumLocalizationThreshold }
      const response = await this.$axios.$post(
        'https://ad-detection-service-bxltsvmqda-as.a.run.app/ads/detection',
        body
      )
      // console.log(response)
      const items = await this.$refs.image_canvas.getImageData(response.objects)
      // console.log('count detected', items.length)
      const boxes = []
      // const colors = randomColor({ count: items.length, luminosity: 'dark' })
      for (const i in items) {
        const item = items[i]
        const embedded = this.getEmbedded(item)
        // embedded.push(result)
        const result = this.querySimilarity(embedded)
        if (result) {
          boxes.push({
            ...response.objects[i],
            object: result.label,
            score: result.score,
            color: result.color,
          })
        }
      }
      // if (this.knn) {
      //   console.log(this.knn.predict(embedded))
      // }
      // console.log('boxes', boxes)
      this.bboxes = boxes
    },
    trainingModel(train) {
      const embedded = train.map((x) => x.embedded)
      const labels = train.map((x) => x.id)
      this.knn = { embedded, labels }
      // new KNN(embedded, labels, { k: 2, distance:  })
    },
    base64ToImage(base64) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
          resolve(image)
        }
        image.src = base64
      })
    },
    getEmbedded(img) {
      const tensor = tf.browser
        .fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims()
      const result = this.embeddingModel.predict(tensor)
      return result.arraySync()[0]
    },
    querySimilarity(sample) {
      const embedded = this.knn.embedded
      const labels = this.knn.labels
      let maxIdx = -1
      let maxVal = 0
      for (const i in embedded) {
        const item = embedded[i]
        // const idx = labels[i]
        const cosim = cosineSimilarity(item, sample)
        console.log(cosim, this.queryDatabase(labels[i]))
        if (cosim > maxVal) {
          maxIdx = labels[i]
          maxVal = cosim
        }
      }
      if (maxIdx === -1 || maxVal < this.minimumClassificationThreshold)
        return null
      const item = this.queryDatabase(maxIdx)
      return {
        id: maxIdx,
        label: item?.label,
        score: maxVal,
        color: item?.color,
      }
    },
    queryDatabase(id) {
      return this.databases.find((x) => x.id === id)
    },
    handleOnDeletePreview() {
      this.sampleImgs = null
      this.bboxes = []
      this.isPreviewUploaded = false
    },
    handleOnDeleteDatabase() {
      try {
        this.databases = []
        localStorage.removeItem('offline-ad-databases')
      } catch (error) {
        console.error('remove database', error)
      }
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
      return !item || 'Label already exists.'
    },
    handleOnReloadPage() {
      window.location.reload()
    },
    async getModelVersion() {
      try {
        const result = await this.$axios.$get(
          'https://storage.googleapis.com/demo-ml-model/detection-offline-ad/version.json'
        )
        const current = localStorage.getItem('detection-offline-ad-version')
        this.hasChangVersion = false

        if (current !== result.version) {
          localStorage.removeItem('detection-offline-ad')
          window.indexedDB.deleteDatabase('detection-offline-ad')
          localStorage.setItem('detection-offline-ad-version', result.version)
          this.hasChangVersion = true
        }
        this.modelVersion = result.version
      } catch (error) {
        this.hasProblem = true
      }
    },
    loadDatabaseLocalStorage() {
      try {
        const db = localStorage.getItem('offline-ad-databases')
        if (db) {
          this.databases = JSON.parse(db)
          this.trainingModel(this.databases)
        }
      } catch (error) {
        console.error('load database error', error)
      }
    },
    updateDatabaseLocalStorage(databases) {
      try {
        localStorage.setItem('offline-ad-databases', JSON.stringify(databases))
      } catch (error) {
        console.error('update database error', error)
      }
    },
    handleOnLocalizationThreshold() {
      this.tempLocalizationThreshold = this.minimumLocalizationThreshold
      this.localizationThresholdDialog = true
    },
    handleOnClassificationThreshold() {
      this.tempClassificationThreshold = this.minimumClassificationThreshold
      this.classificationThresholdDialog = true
    },
    handelOnSaveClassificationThreshold() {
      try {
        this.minimumClassificationThreshold = this.tempClassificationThreshold
        this.classificationThresholdDialog = false
        localStorage.setItem(
          'offline-ad-classification-threshold',
          this.minimumClassificationThreshold
        )
      } catch (error) {
        console.error('update minimum confidence error', error)
      }
    },
    handleOnClassificationDecrement() {
      this.tempClassificationThreshold -= 0.1
    },
    handleOnClassificationIncrement() {
      this.tempClassificationThreshold += 0.1
    },
    handelOnSaveLocalizationThreshold() {
      try {
        this.minimumLocalizationThreshold = this.tempLocalizationThreshold
        this.localizationThresholdDialog = false
        console.log(this.minimumLocalizationThreshold)
        localStorage.setItem(
          'offline-ad-localization-threshold',
          this.minimumLocalizationThreshold
        )
      } catch (error) {
        console.error('update minimum confidence error', error)
      }
    },
    handleOnLocalizationDecrement() {
      this.tempLocalizationThreshold -= 0.1
    },
    handleOnLocalizationIncrement() {
      this.tempLocalizationThreshold += 0.1
    },
    async reversionDatabase() {
      // const db = localStorage.getItem('offline-ad-databases')
      // if (!db) return
      // const databases = JSON.parse(db)
      for (const item of this.databases) {
        const image = await this.base64ToImage(item.img)
        item.embedded = this.getEmbedded(image)
      }
      // this.databases = databases
      console.log('update reversion', this.databases)
      this.trainingModel(this.databases)
      this.updateDatabaseLocalStorage(this.databases)
    },
    handleOnDetectAgain() {
      this.handleOnUploadPreview(this.sampleImgs)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/utils.scss';

.ad-detection {
  &-btn {
    &--up {
      transform: rotate(180deg);
    }
    &--down {
      transform: rotate(0deg);
    }
  }
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
      position: relative;

      &:hover &__remove {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      &__remove {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.2);
      }
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
  &__footer {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    max-height: 24px;
    overflow: hidden;

    &--text {
      color: #aaa;
      font-size: 0.7rem;
    }
  }
  &-upload-btn {
    width: 72px;
    height: 58px;
    padding: 4px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #e8f0fe;
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
      background-color: #d2e3fc;
    }
  }
  &-results {
    overflow: hidden;
    overflow-y: auto;
    // margin-left: 16px;

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
      width: 5px;
      min-height: 100%;
      margin-right: 8px;
      align-self: stretch;
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
