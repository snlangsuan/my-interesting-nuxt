<template>
  <div class="page__container">
    <div class="page-database">
      <div class="page-database__container">
        <v-card>
          <v-card-title class="py-2">
            <v-btn
              icon
              small
              :class="['mr-2', hideDatabase ? 'page-btn--up' : 'page-btn--down']"
              @click="hideDatabase = !hideDatabase"
            >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
            <div>References</div>
            <v-spacer />
            <v-menu v-if="databases.length > 0 && samples.length < 1" bottom left>
              <template #activator="{ on, attrs }">
                <v-btn small icon v-bind="attrs" v-on="on"
                  ><v-icon>mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <v-list>
                <v-list-item
                  @click="handleOnResetReferences"
                >
                  <v-list-item-title>
                    Reset References
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text class="pa-0">
            <div
              :class="[
                'page-database--expand',
                { 'page-database--collapse': hideDatabase },
              ]"
            >
              <!-- <button
                :disabled="samples.length > 0"
                class="page-database-upload-btn page-database-upload-btn--block"
                style="margin-bottom: 8px"
                @click="handleOnUploadDatabase"
              >
                <v-icon size="18">mdi-tray-arrow-up</v-icon>
                <div class="page-database-upload-btn__text">Upload</div>
              </button> -->
              <div v-if="databases.length > 0">
                {{ databases.length }} References <span v-if="samples.length > 0">(Disabled add/remove)</span>
              </div>
              <div v-else>Add Reference:</div>
              <div class="page-database__content">
                <button
                  v-if="samples.length < 1"
                  class="page-database-upload-btn"
                  @click="handleOnUploadDatabase"
                >
                  <v-icon size="18">mdi-tray-arrow-up</v-icon>
                  <div class="page-database-upload-btn__text">Upload</div>
                </button>
                <div class="page-database-list">
                  <template v-for="item in databases">
                    <div :key="item.id" class="page-database-item">
                      <v-tooltip top>
                        <template #activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on">
                            <v-img :src="item.img" width="100%" contain />
                            <div v-if="samples.length < 1" class="page-database-item__remove">
                              <v-btn icon small @click="handleOnRemoveReference(item.id)">
                                <v-icon color="white">
                                  mdi-close-circle
                                </v-icon>
                              </v-btn>
                            </div>
                          </div>
                        </template>
                        <span>{{ item.label }}</span>
                      </v-tooltip>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div v-if="sampleUploaded" class="page-filter pt-2">
      <div class="page-filter__container">
        <v-card color="transparent" flat>
          <v-card-title class="py-2">
            <div class="text-body-2">{{ samples.length }} Images uploaded</div>
            <v-spacer />
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  icon
                  class="mr-3"
                  v-bind="attrs"
                  v-on="on"
                  @click="handleOnExport"
                >
                  mdi-printer-outline
                </v-icon>
              </template>
              <span>Export</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="handleOnResetSample"
                >
                  mdi-refresh
                </v-icon>
              </template>
              <span>Reset</span>
            </v-tooltip>
            <v-btn
              icon
              small
              :class="['ml-2', hideOptions ? 'page-btn--up' : 'page-btn--down']"
              @click="hideOptions = !hideOptions"
            >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <div
              :class="[
                'page-filter--expand',
                { 'page-filter--collapse': hideOptions },
              ]"
            >
              <v-row dense>
                <v-col cols="6">
                  <div class="mb-1">Localization threshold ({{ minimumLocalizationThreshold | decimal }})</div>
                  <v-slider v-model="minimumLocalizationThreshold" min="0" max="1" step="0.1" dense hide-details />
                </v-col>
                <v-col cols="6">
                  <div class="mb-1">Similarity threshold ({{ minimumSimilarityThreshold | decimal }})</div>
                  <v-slider v-model="minimumSimilarityThreshold" min="0" max="1" step="0.1" dense hide-details />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <div class="mb-1">Labels</div>
                  <v-chip-group
                    v-model="viewLabels"
                    column
                    multiple
                  >
                    <template v-for="item in databases">
                      <v-chip
                        :key="'lb-' + item.id"
                        :value="item.id"
                        :color="item.color"
                        filter
                        outlined
                        small
                      >
                        {{ item.label }}
                      </v-chip>
                    </template>
                  </v-chip-group>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div class="page-workspace pt-0">
      <div
        v-if="sampleUploaded"
        class="page-workspace-list"
        :style="{ maxHeight: contentHeight + 'px' }"
      >
        <template v-for="item in samples">
          <div :key="'sample-' + item.id" class="page-workspace-item">
            <v-card class="page-workspace-card">
              <v-card-text>
                <div
                  class="page-workspace-card__content"
                  :style="{ display: screenWidth > 560 ? 'flex' : 'block' }"
                >
                  <div class="page-workspace-card__canvas">
                    <bounding-box-canvas
                      :ref="'image_canvas_' + item.id"
                      :src="item.image"
                      :bboxes="filterBoxes(item.boxes)"
                      :width="canvasWidth"
                      :height="canvasHeight"
                    />
                  </div>
                  <div class="page-workspace-card__output">
                    <!-- <template v-for="item in filterBoxes(item.boxes)">
                      <div :key="'output-' + item.id">{{ item }}</div>
                    </template> -->
                    <div :class="['page-workspace-boxes-results', screenWidth > 560 ? 'pl-4' : 'pt-4']" :style="{ maxHeight: canvasHeight + 'px' }">
                      <div class="page-workspace-boxes__title">Predictions</div>
                      <div class="page-workspace-boxes__subtitle" style="margin-bottom: 8px">{{ filterBoxes(item.boxes).length }} objects</div>
                      <template v-for="(box, i) in filterBoxes(item.boxes)">
                        <div :key="'output-' + item.id + '-' + i" class="page-workspace-boxes__item">
                          <div class="page-workspace-boxes__color-box" :style="{ backgroundColor: box.color }">
                            {{ 'P' + (box.$index + 1) }}
                          </div>
                          <div class="page-workspace-boxes__label">
                            {{ box.object }}
                          </div>
                          <div class="page-workspace-boxes__percent">
                            <v-progress-linear :value="box.score * 100" height="10" />
                          </div>
                          <div class="page-workspace-boxes__score">
                            {{ Math.ceil(box.score * 100) }}%
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </template>
      </div>
      <div v-else class="page-workspace-item">
        <v-card class="mt-4">
          <v-card-title class="py-2">Preview</v-card-title>
          <v-divider />
          <v-card-text v-if="databases.length < 1">
            You must add artwork on top panel before you can preview it here
          </v-card-text>
          <v-card-text v-else>
            <upload-image-field
              ref="sample_upload"
              v-model="uploads"
              accept="image/jpeg"
              style="width: 100%"
              multiple
              @change="handleOnSampleUpload"
            />
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div class="page-footer">
      <div class="page-footer__text">version: {{ modelVersion }}</div>
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
          <v-btn color="primary" text @click="handleOnAddDatabase">add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay v-model="loading.show">
      <div class="page__overlay-box">{{ loading.message }}</div>
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
    <div class="page-temp-upload">
      <bounding-box-canvas ref="temp_canvas" :src="tempImage" :bboxes="[]" :width="canvasWidth" :height="canvasHeight" />
    </div>

    <client-only>
      <vue-html2pdf
        ref="export_pdf"
        :show-layout="false"
        :float-layout="true"
        :enable-download="false"
        :preview-modal="false"
        :pdf-quality="4"
        :manual-pagination="true"
        :paginate-elements-by-height="1100"
        pdf-content-width="800px"
        pdf-format="a4"
        pdf-orientation="portrait"
        :html-to-pdf-options="htmlToPdfOptions"
        @beforeDownload="handleOnPdfGenerate"
      >
        <offline-ads-pdf-content
          slot="pdf-content"
          :title="title"
          :min-localization="minimumLocalizationThreshold"
          :min-similarity="minimumSimilarityThreshold"
          :items="reportItems"
        />
      </vue-html2pdf>
    </client-only>
  </div>
</template>

<script>
import seedColor from 'seed-color'
import { cosineSimilarity } from '@/pages/ml/ad-detection/function/util'
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
      initializing: true,
      hideDatabase: false,
      hasChangVersion: false,
      hasProblem: false,
      hideOptions: false,
      sampleUploaded: false,

      uploadDatabaseDialog: false,
      createDatabaseValid: true,
      createDatabase: {
        label: '',
        img: [],
      },

      screenWidth: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      contentHeight: 0,

      modelVersion: '0.0',
      embeddingModel: null,

      minimumSimilarityThreshold: 0.4,
      minimumLocalizationThreshold: 0.7,
      viewLabels: [],
      databases: [],
      samples: [],
      uploads: [],

      tempImage: null,
      resizeObserver: null,

      reportItems: [],

      htmlToPdfOptions: {
        margin: 0,

        image: {
          type: 'jpeg',
          quality: 1
        },

        enableLinks: false,

        html2canvas: {
          dpi: 192,
          scale:4,
          letterRendering: true,
          useCORS: true
        },

        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait'
        }
      }
    }
  },
  mounted() {
    this.initialize()
    if (!this.resizeObserver) this.resizeObserver = new ResizeObserver(this.onResize)
    const databaseElem = document.querySelector('.page-database')
    if (databaseElem) this.resizeObserver.observe(databaseElem)
    const filterElem = document.querySelector('.page-filter')
    if (filterElem) this.resizeObserver.observe(filterElem)
  },
  beforeDestroy() {
    const databaseElem = document.querySelector('.page-database')
    if (databaseElem && this.resizeObserver) this.resizeObserver.unobserve(databaseElem)
    const filterElem = document.querySelector('.page-filter')
    if (filterElem && this.resizeObserver) this.resizeObserver.unobserve(filterElem)
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
          const model = await this.$tfjs.loadLayersModel(
            'indexeddb://detection-offline-ad'
          )
          this.embeddingModel = model
        } else {
          const model = await this.$tfjs.loadLayersModel(
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
        // const clsThreshold = localStorage.getItem(
        //   'offline-ad-similarity-threshold'
        // )
        // if (clsThreshold !== null)
        //   this.minimumSimilarityThreshold = Number(clsThreshold)
        // const llsThreshold = localStorage.getItem(
        //   'offline-ad-localization-threshold'
        // )
        // if (llsThreshold !== null)
        //   this.minimumLocalizationThreshold = Number(llsThreshold)

      } catch (error) {
        console.error(error)
      } finally {
        this.initializing = false
        this.loading.show = false
      }
    },
    setResizeObserver() {
      setTimeout(() => {
        if (!this.resizeObserver) this.resizeObserver = new ResizeObserver(this.onResize)
        const databaseElem = document.querySelector('.page-database')
        if (databaseElem) this.resizeObserver.observe(databaseElem)
        const filterElem = document.querySelector('.page-filter')
        // console.log(filterElem)
        if (filterElem) this.resizeObserver.observe(filterElem)
      }, 200)
    },
    onResize() {
      console.log('change size')
      const databaseElem = document.querySelector('.page-database__container')
      const workspaceElem = document.querySelector('.page-workspace')
      this.screenWidth = window.innerWidth

      if (databaseElem && workspaceElem) {
        const contentWidth = databaseElem.offsetWidth - 32
        const percent = this.screenWidth > 560 ? 0.6 : 1
        this.canvasWidth = Math.round(contentWidth * percent) - 32
        this.canvasHeight = this.canvasWidth

        const screenHeight = window.innerHeight
        const topHeight = workspaceElem.offsetTop
        this.contentHeight = screenHeight - topHeight
        console.log('height', screenHeight, this.contentHeight, topHeight, 'width', this.canvasWidth)
      }
    },
    async handleOnAddDatabase() {
      if (!this.$refs.database_form.validate()) return
      try {
        const create = JSON.parse(JSON.stringify(this.createDatabase))
        this.uploadDatabaseDialog = false
        this.loading.message = 'Adding Image to database...'
        this.loading.show = true
        const image = await this.base64ToImage(this.createDatabase.img[0])
        // console.log('img', image.src)
        const result = this.getEmbedded(image)
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
        this.viewLabels = this.databases.map((x) => x.id)
      } catch (error) {
        console.error('add database error', error)
      } finally {
        this.loading.show = false
      }
    },
    handleOnUploadDatabase() {
      this.createDatabase = {
        label: '',
        img: [],
      }
      this.uploadDatabaseDialog = true
      this.$nextTick(() => {
        this.$refs.database_form.reset()
        this.$refs.database_form.resetValidation()
      })
    },
    handleOnResetReferences() {
      try {
        this.databases = []
        localStorage.removeItem('offline-ad-databases')
      } catch (error) {
        console.error('remove database', error)
      }
    },
    handleOnRemoveReference(id) {
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
    handleOnReloadPage() {
      window.location.reload()
    },
    handleOnResetSample() {
      this.uploads = []
      this.samples = []
      this.sampleUploaded = false
    },
    async handleOnExport() {
      this.loading.message = 'Preparing data...'
      this.loading.show = true
      const reportItems = []
      for (const i in this.samples) {
        const item = this.samples[i]
        const img = await this.$refs['image_canvas_' + item.id][0].getDataURL()
        reportItems.push({
          no: Number(i) + 1,
          id: item.id,
          img,
          boxes: this.filterBoxes(item.boxes)
        })
      }
      this.reportItems = reportItems
      setTimeout(() => {
        this.$refs.export_pdf.generatePdf()
      }, 300)
      // this.$refs.export_pdf.generatePdf()
    },

    async handleOnPdfGenerate({ html2pdf, options, pdfContent }) {
      const blob = await html2pdf().set(options).from(pdfContent).outputPdf('blob', 'my-invoice.pdf')
      const fileURL = URL.createObjectURL(blob)
      window.open(fileURL);
      // console.log(blob)
      this.loading.show = false
    },

    filterBoxes(boxes) {
      return boxes.filter((x) => {
        return x.score >= this.minimumSimilarityThreshold && x.detection_confidence >= this.minimumLocalizationThreshold && this.viewLabels.includes(x.object_id)
      })
    },

    async handleOnSampleUpload() {
      try {
        this.loading.message = 'Finding Offline advertise...'
        this.loading.show = true

        const raws = this.$refs.sample_upload.getRaws()
        const uploads = []
        for (const i in this.uploads) {
          this.loading.message = `${(Number(i) + 1)}/${this.uploads.length}\nFinding Offline advertise...`
          const item = this.uploads[i]
          const result = await this.getOfflineAdsApi(item)
          uploads.push({ id: Date.now() + i, name: raws[i].name, image: item , boxes: result })
        }
        this.uploads = []
        this.samples = uploads
        this.sampleUploaded = true
        this.setResizeObserver()
        this.onResize()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading.show = false
      }
    },

    async getOfflineAdsApi(image) {
      const body = { image: image.split(',')[1], threshold: 0 }
      const response = await this.$axios.$post(
        'https://ad-detection-service-bxltsvmqda-as.a.run.app/ads/detection',
        body
      )

      const objects = response.objects
      this.tempImage = image
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const items = await this.$refs.temp_canvas.getImageDataBoxes(objects)
      // console.log(items.map((x) => x.src))
      const boxes = []
      for (const i in items) {
        const item = items[i]
        const obj = objects[i]
        const embedded = this.getEmbedded(item)
        // embedded.push(result)
        const result = this.querySimilarity(embedded)
        if (result) {
          boxes.push({
            ...response.objects[i],
            object: result.label,
            object_id: result.id,
            score: result.score,
            color: result.color,
            detection_confidence: obj.confidence,
            id: Date.now() + i,
            $index: Number(i),
          })
        }
      }
      return boxes
    },

    loadDatabaseLocalStorage() {
      try {
        const db = localStorage.getItem('offline-ad-databases')
        if (db) {
          this.databases = JSON.parse(db)
          this.viewLabels = this.databases.map((x) => x.id)
          this.trainingModel(this.databases)
        }
      } catch (error) {
        console.error('load database error', error)
      }
    },
    async reversionDatabase() {
      for (const item of this.databases) {
        const image = await this.base64ToImage(item.img)
        item.embedded = this.getEmbedded(image)
      }
      this.trainingModel(this.databases)
      this.updateDatabaseLocalStorage(this.databases)
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
      const tensor = this.$tfjs.browser
        .fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(this.$tfjs.scalar(255))
        .expandDims()
      const result = this.embeddingModel.predict(tensor)
      return result.arraySync()[0]
    },
    trainingModel(train) {
      const embedded = train.map((x) => x.embedded)
      const labels = train.map((x) => x.id)
      this.knn = { embedded, labels }
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
    chkLabelDuplicate(label) {
      const item = this.databases.find((x) => x.label === label)
      return !item || 'Label already exists.'
    },
    queryDatabase(id) {
      return this.databases.find((x) => x.id === id)
    },
    updateDatabaseLocalStorage(databases) {
      try {
        localStorage.setItem('offline-ad-databases', JSON.stringify(databases))
      } catch (error) {
        console.error('update database error', error)
      }
    },
    querySimilarity(sample) {
      const embedded = this.knn.embedded
      const labels = this.knn.labels
      let maxIdx = -1
      let maxVal = 0
      for (const i in embedded) {
        const item = embedded[i]
        const cosim = cosineSimilarity(item, sample)
        if (cosim > maxVal) {
          maxIdx = labels[i]
          maxVal = cosim
        }
      }
      if (maxIdx === -1 || maxVal < 0)
        return null
      const item = this.queryDatabase(maxIdx)
      return {
        id: maxIdx,
        label: item?.label,
        score: maxVal,
        color: item?.color,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  &-btn {
    &--up {
      transform: rotate(-180deg);
    }
    &--down {
      transform: rotate(0deg);
    }
  }
  &__container {
    height: 100%;
    // max-width: 800px;
    width: 100%;
    margin: auto;
  }
  &-database,
  &-filter,
  &-workspace {
    padding-top: 24px;
    // padding-left: 16px;
    // padding-right: 16px;
  }

  &-database__container,
  &-filter__container,
  &-workspace-item {
    width: 100%;
    max-width: 800px;
    margin: auto;
    padding-left: 16px;
    padding-right: 16px;
  }
  &-database {

    &--collapse {
      height: 0 !important;
      opacity: 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    &--expand {
      border-top: thin solid rgba(0, 0, 0, 0.12);
      overflow: hidden;
      height: 120px;
      padding: 16px;
      transition: height 0.5s, padding 0.5s;
    }

    &__content {
      padding-top: 8px;
      display: flex;
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

      &--block {
        width: 100%;
        height: 32px;
        flex-direction: row;

        & > .v-icon {
          margin-right: 4px;
        }
      }

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

      $btn-upload: &;
      &:disabled {
        background-color: #eeeeee;
        cursor: not-allowed;

        & > i,
        & > #{$btn-upload}__text {
          color: #888888 !important;
        }
      }
    }

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

  &-filter {
    &--collapse {
      height: 0 !important;
      opacity: 0 !important;
      padding: 0 !important;
    }

    &--expand {
      overflow: hidden;
      height: 164px;
      padding: 16px;
      transition: height 0.5s, padding 0.5s;
    }
  }

  &-workspace {

    &-list {
      overflow: hidden;
      overflow-y: auto;
      padding-bottom: 16px;
      padding-top: 16px;
    }

    &-card {
      &__content {
        display: flex;
      }

      &__canvas {
        flex: 0;
      }

      &__output {
        flex: 1;
      }
    }

    &-list > &-item + &-item {
      margin-top: 16px;
    }

    &-boxes {
      &-results {
        overflow: hidden;
        overflow-y: auto;
      }

      &__title {
        font-size: 1.1rem;
        font-weight: 600;
      }

      &__item {
        display: flex;
        align-items: center;
        padding: 8px 0;
      }
      &__color-box {
        width: 22px;
        height: 22px;
        min-height: 100%;
        margin-right: 8px;
        // align-self: stretch;
        font-size: 0.65rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }

      &__label {
        margin-right: 8px;
        max-width: 30%;
        width: 30%;
        font-size: 0.8rem;
      }

      &__percent {
        flex: 1;
      }

      &__score {
        padding-left: 8px;
        font-size: 0.8rem;
      }
    }
  }

  &-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 8px;

    &__text {
      font-size: 0.9rem;
      font-weight: 400;
      color: #aaa;
    }
  }

  &-temp-upload {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  &__overlay-box {
    min-width: 320px;
    text-align: center;
    background-color: #fff;
    padding: 32px 16px;
    color: #212121;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

@media screen and (max-width: 320px) {
  .page {
    &-database {
      &--expand {
        height: 161px;
      }
    }
  }
}
</style>
