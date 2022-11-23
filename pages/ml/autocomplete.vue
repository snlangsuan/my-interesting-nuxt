<template>
  <div class="autocomplete-page fill-height">
    <svg
      id="lineCanvas"
      :style="{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
      }"
    >
      <!-- <circle id="pointA" :cx="pA.x" :cy="pA.y" :r="pA.r" />
      <circle id="pointB" :cx="pB.x" :cy="pB.y" :r="pB.r" /> -->
      <path id="lineAB" :d="'M ' + pA.x + ' ' + pA.y + ' L ' + pB.x + ' ' + pB.y" stroke="#cccccc" stroke-width="3" fill="none" />
      <path id="lineAB" :d="'M ' + pC.x + ' ' + pC.y + ' L ' + pD.x + ' ' + pD.y" stroke="#cccccc" stroke-width="3" fill="none" />
    </svg>
    <v-app-bar class="custom-app-bar custom-app-bar--white" app>
      <v-toolbar-title>Auto-Complete</v-toolbar-title>
    </v-app-bar>
    <v-container class="px-8" style="position: relative" fluid fill-height>
      <v-row class="fill-height align-center justify-center">
        <v-col cols="12" md="3" class="px-8">
          <div id="datasetCard" ref="datasetCard" class="autocomplete-page-card">
            <div class="autocomplete-page-card__title">Dataset</div>
            <v-divider />
            <div class="autocomplete-page-card__text pt-4">
              <div v-if="!datasetList" class="autocomplete-page__upload">
                <input
                  v-show="false"
                  ref="file_upload"
                  type="file"
                  alt=""
                  title=""
                  accept="text/csv,text/plain,text/tsv"
                  @input="onFileChange"
                />
                <v-icon class="autocomplete-page__upload-icon" size="18">mdi-tray-arrow-up</v-icon>
                <div class="autocomplete-page__upload-text">Upload</div>
              </div>
              <div
                v-else
                :class="[
                  'autocomplete-page__upload',
                  'autocomplete-page__upload--active',
                  { 'autocomplete-page__upload--disabled': state === 'training'}
                ]"
              >
                <v-icon class="autocomplete-page__upload-icon" size="18">mdi-file-outline</v-icon>
                <div class="autocomplete-page__upload-text pl-2">{{ datasetFile.name }}</div>
                <v-spacer />
                <v-icon :disabled="state === 'training'" color="error" style="cursor: pointer" @click="onRemoveDataset">mdi-close</v-icon>
              </div>
            </div>
            <div class="autocomplete-page-card__text pt-4">
              <div class="text-caption">An example can be viewed from <a href="https://gist.github.com/snlangsuan/a48a23e74afb06095cec6cc282f8f30f" target="_blank">link</a></div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="4" class="px-8">
          <div id="trainCard" ref="trainCard" class="autocomplete-page-card">
            <div class="autocomplete-page-card__title">Training</div>
            <div class="autocomplete-page-card__text">
              <!-- <v-btn v-if="state === 'training'" color="error" block @click="onStopTrain">Stop Training Model</v-btn> -->
              <div v-if="state === 'training'">
                <v-progress-linear
                  v-model="trainProgress"
                  color="blue lighten-4"
                  height="36"
                >
                  <div class="blue--text text--darken-2">Training...</div>
                </v-progress-linear>
                <div class="pt-3 blue--text text-darken-2">
                  {{ epochTime | epochTime }} - {{ epochCurrent }} / {{ params.epochs }} epochs
                </div>
              </div>
              <div v-else-if="state === 'preparing'">
                <v-progress-linear
                  :value="0"
                  color="blue lighten-4"
                  height="36"
                >
                  <div class="blue--text text--darken-2">Preparing...</div>
                </v-progress-linear>
                <div class="pt-3 blue--text text-darken-2">
                  &nbsp;
                </div>
              </div>
              <!-- <v-btn v-else-if="state === 'trained'" disabled block>Model Trained</v-btn> -->
              <div v-else-if="state === 'trained'">
                <div class="autocomplete-page-panel__btn autocomplete-page-panel__btn--disabled justify-center grey lighten-3" style="height: 36px; border-radius: 4px">
                  <div class="autocomplete-page-panel__btn-text">Model Trained</div>
                </div>
              </div>
              <v-btn v-else color="primary" :disabled="state === 'importing'" block @click="onStartTrain">Train Model</v-btn>
            </div>
            <v-divider />
            <div :class="['autocomplete-page-panel', { 'autocomplete-page-panel--active': expenseAdvanced }]">
              <div class="autocomplete-page-panel__title" @click="onExpanseAdvanced">
                <div class="autocomplete-page-panel__title-text">Advanced</div>
                <v-spacer />
                <div class="autocomplete-page-panel__title-icon">
                  <v-icon>mdi-chevron-down</v-icon>
                </div>
              </div>
              <v-expand-transition>
                <div v-show="expenseAdvanced">
                  <div class="autocomplete-page-panel__content">
                    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="">
                      <v-row>
                        <v-col md="5" :class="['text-body-2', { 'pb-1': $vuetify.breakpoint.smAndDown }]">
                          Max Word Length
                        </v-col>
                        <v-col cols="12" md="7" :class="[{ 'pt-0': $vuetify.breakpoint.smAndDown }]">
                          <v-text-field
                            v-model="params.maxLen"
                            type="number"
                            :rules="[(v) => !!v || 'Please enter max word length', (v) => !!v && Number(v) >= 10 || 'Max word length must more than 10']"
                            :disabled="['training', 'preparing'].includes(state)"
                            dense
                            single-line
                            outlined
                            hide-details
                          ></v-text-field>
                        </v-col>
                        <v-col md="5" :class="['text-body-2', { 'pb-1': $vuetify.breakpoint.smAndDown }]">
                          Epochs
                        </v-col>
                        <v-col cols="12" md="7" :class="[{ 'pt-0': $vuetify.breakpoint.smAndDown }]">
                          <v-text-field
                            v-model="params.epochs"
                            :disabled="['training', 'preparing'].includes(state)"
                            type="number"
                            :rules="[(v) => !!v || 'Please enter epochs', (v) => !!v && Number(v) > 0 || 'Epochs must greater than 0']"
                            dense
                            single-line
                            outlined
                            hide-details
                          ></v-text-field>
                        </v-col>
                        <v-col md="5" :class="['text-body-2', { 'pt-0 pb-1': $vuetify.breakpoint.smAndDown }]">
                          Batch Size
                        </v-col>
                        <v-col cols="12" md="7" :class="[{ 'pt-0': $vuetify.breakpoint.smAndDown }]">
                          <v-text-field
                            v-model="params.batchSize"
                            :disabled="['training', 'preparing'].includes(state)"
                            type="number"
                            :rules="[(v) => !!v || 'Please enter batch size', (v) => !!v && Number(v) > 0 || 'Batch size must greater than 0']"
                            dense
                            single-line
                            outlined
                            hide-details
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </div>
                  <v-divider />
                  <div :class="['autocomplete-page-panel__btn', { 'autocomplete-page-panel__btn--disabled': ['training', 'preparing'].includes(state) }]" @click="onResetParams">
                    <div class="autocomplete-page-panel__btn-text">Reset Defaults</div>
                    <v-spacer />
                    <div class="autocomplete-page-panel__btn-icon">
                      <v-icon>mdi-history</v-icon>
                    </div>
                  </div>
                  <v-divider />
                  <!-- <div class="autocomplete-page-panel__btn" @click="drawer = true">
                    <div class="autocomplete-page-panel__btn-text">Under the hood</div>
                    <v-spacer />
                    <div class="autocomplete-page-panel__btn-icon">
                      <v-icon>mdi-chart-box-outline</v-icon>
                    </div>
                  </div> -->
                </div>
              </v-expand-transition>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="5" class="px-8">
          <div id="previewCard" ref="previewCard" class="autocomplete-page-card">
            <div class="autocomplete-page-card__title">
              Preview
              <!-- <v-spacer />
              <v-menu bottom left>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item :disabled="!canPreview" @click="onExportModel">
                    <v-list-item-icon>
                      <v-icon :disabled="!canPreview">mdi-tray-arrow-down</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Export Model</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu> -->
            </div>
            <v-divider />
            <div class="autocomplete-page-card__text pt-4">
              <div v-if="!canPreview" class="text-body-2 grey--text">
                You must train a model on the left before you can preview it here.
              </div>
              <v-expand-transition>
                <div v-show="canPreview">
                <!-- <div> -->
                  <div class="pb-1">Input Text</div>
                  <!-- <v-text-field v-model="search" dense single-line outlined hide-details /> -->
                  <text-predict-field v-model="search" :predicted="predicted" @change="onInputChange"></text-predict-field>
                  <div class="pb-1 pt-6">Predicted Text</div>
                  <v-text-field v-model="predicted" disabled dense single-line outlined hide-details />
                </div>
              </v-expand-transition>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import * as tf from '@tensorflow/tfjs'
export default {
  name: 'AutoCompletePage',
  layout: 'ml',
  data() {
    return {
      drawer: false,
      search: '',
      predicted: '',
      valid: true,
      defaultParams: {
        maxLen: 10,
        epochs: 250,
        batchSize: 32,
      },
      params: {
        maxLen: 10,
        epochs: 250,
        batchSize: 32,
      },
      datasetFile: null,
      datasetList: null,
      state: 'importing',
      model: null,
      canPreview: false,
      expenseAdvanced: false,
      trainProgress: 0,
      epochTime: 0,
      epochCurrent: 0,
      trainElementResize: null,
      datasetElementResize: null,
      previewElementResize: null,
      pA: { x: 0, y: 0 },
      pB: { x: 0, y: 0 },
      pC: { x: 0, y: 0 },
      pD: { x: 0, y: 0 },
      predictModel: null,
      predictMaxLen: 10,
      ALPHA_LEN: 25,
      int2char: {},
      char2int: {},
      epochLogs: [],
      batchLogs: [],
      batchLossLogs: [],
      batchMseLogs: [],
      batchOptions: {
        responsive: true,
      }
    }
  },
  head() {
    return {
      title: 'Auto-Complete'
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log(this.$refs.trainCard)
    // })
    // tfVis.visor().surface({name: 'My First Surface', tab: 'Input Data'})
    this.onResetParams()
    this.trainElementResize = new ResizeObserver(this.onCardResize)
    this.trainElementResize.observe(this.$refs.trainCard)
    this.datasetElementResize = new ResizeObserver(this.onCardResize)
    this.datasetElementResize.observe(this.$refs.datasetCard)
    this.previewElementResize = new ResizeObserver(this.onCardResize)
    this.previewElementResize.observe(this.$refs.previewCard)
    this.onLoadLocalModel()
  },
  beforeDestroy() {
    this.trainElementResize && this.trainElementResize.unobserve(this.$refs.trainCard)
    this.datasetElementResize && this.datasetElementResize.unobserve(this.$refs.datasetCard)
    this.previewElementResize && this.previewElementResize.unobserve(this.$refs.previewCard)
    // document.querySelector('#trainCard').removeEventListener('resize', this.onCardResize)
  },
  methods: {
    onTrainModel() {
      if (this.$refs.form.validate()) return
      console.log('training')
    },
    onExpanseAdvanced() {
      this.expenseAdvanced = !this.expenseAdvanced
    },
    onCardResize() {
      const datasetElem = this.$refs.datasetCard
      const datasetRect = datasetElem.getBoundingClientRect()
      this.pA.x = datasetRect.x + datasetRect.width
      this.pA.y = datasetRect.y + (datasetRect.height * 0.5)

      const trainElem = this.$refs.trainCard
      const trainRect = trainElem.getBoundingClientRect()
      this.pB.x = trainRect.x
      this.pB.y = trainRect.y + (trainRect.height * 0.5)
      this.pC.x = trainRect.x + trainRect.width
      this.pC.y = this.pB.y

      const previewElem = this.$refs.previewCard
      const previewRect = previewElem.getBoundingClientRect()
      this.pD.x = previewRect.x
      this.pD.y = previewRect.y + (previewRect.height * 0.5)
    },
    onFileChange(e) {
      const input = this.$refs.file_upload.files
      if (!input || !input[0]) return
      this.datasetFile = input[0]
      const file = new FileReader()
      file.onload = () => {
        this.datasetList = file.result.split(/\r?\n/).filter((x) => !!x).map((x) => x.trim())
        const textProcessed = this.datasetList.map((x) => this.processText(x)).filter((x) => !!x)
        this.params.maxLen = this.getTextLength(textProcessed)
        this.$refs.file_upload.value = null
        this.$refs.file_upload.type = 'text'
        this.$refs.file_upload.type = 'file'
        this.state = 'imported'
      }
      file.readAsText(input[0])
    },
    onRemoveDataset() {
      this.datasetFile = null
      this.datasetList = null
      this.state = 'importing'
    },
    onResetParams() {
      // this.params.epochs = this.defaultParams.epochs
      // this.params.batchSize = this.defaultParams.batchSize
      this.params = { ...this.defaultParams }
    },
    getTextLength(texts) {
      const len = texts.map((x) => x.length)
      return Math.max(...len)
    },
    processText(text) {
      // remove punctuations
      const rpRegex = /[^\u0E00-\u0E7F\w\s]/
      text = text.replaceAll(new RegExp(rpRegex, 'g'), '')

      // remove multiple white spaces
      const rmsRegex = /\s+/
      text = text.replace(new RegExp(rmsRegex, 'g'), ' ')

      // remove tabs and newline characters
      const rtn = /[\t\n]/
      text = text.replace(new RegExp(rtn, 'g'), '')

      text = text.toLowerCase().trim()
      return text
    },
    generateCharacterMap(texts) {
      // eslint-disable-next-line no-useless-escape
      const pattern = /[\[\]]/ig
      const chars = ['[', ']'].concat(Array.from(new Set(texts.join('').replace(pattern, '').split(''))).sort())
      const int2char = chars.reduce((list, x, i) => {
        list[i+1] = x
        return list
      }, {})
      const char2int = Object.keys(int2char).reduce((list, x) => {
        list[int2char[x]] = x
        return list
      }, {})
      return [int2char, char2int]
    },
    textToNumber(text, maxLen, char2int) {
      const encode = []
      for (let i = 0; i < maxLen; i++) {
        const letter = text.slice(i, i+1)
        // const num = i < text.length ? letter.charCodeAt(0) - 96 : 0
        const num = i < text.length ? char2int[letter] : 0
        encode.push(num)
      }
      return encode
    },
    numberToText(nums, maxLen, int2char) {
      const decode = []
      for (let i = 0; i < maxLen; i++) {
        // const char = nums[i] === 0 ? '' : String.fromCharCode(nums[i] + 96)
        const char = nums[i] === 0 ? '' : int2char[nums[i]]
        decode.push(char)
      }
      return decode
    },
    createFeatureSet(texts, maxLen, sampleLen = 1) {
      const inputs = []
      for (const x of texts) {
        for (let y = sampleLen + 1; y < maxLen + 1; y++) {
          inputs.push(x.slice(0, y).concat(Array(maxLen-y).fill(0)))
        }
      }
      return inputs
    },
    createLabelSet(texts, maxLen, sampleLen = 1) {
      const labels = []
      for (const x of texts) {
        for (let y = sampleLen + 1; y < maxLen + 1; y++) {
          labels.push(x)
        }
      }
      return labels
    },
    parseOneHotEncoding(texts, maxLen, alphaLen) {
      const tensor2d = tf.tensor2d(texts,[texts.length, maxLen], 'int32')
      return tf.oneHot(tensor2d, alphaLen)
    },
    fromOneHotEncoding(texts, maxLen, int2char) {
      const results = texts.map((x) => this.numberToText(x, maxLen, int2char))
      return results
    },
    async createModel(maxLen, alphaLen) {
      const model = tf.sequential()
      const layer1 = tf.layers.lstm({
        units: alphaLen * 2,
        inputShape: [maxLen, alphaLen],
        dropout: 0.2,
        recurrentDropout: 0.2,
        useBias: true,
        returnSequences: true,
        activation: 'relu',
      })
      const layer2 = tf.layers.timeDistributed({
        layer: tf.layers.dense({
          units: alphaLen,
          dropout: 0.2,
          activation: 'softmax'
        })
      })
      await model.add(layer1)
      await model.add(layer2)
      return model
    },
    async trainModel(model, features, labels) {
      model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['mse']
      })
      let tms = 0
      const onEpochBegin = (epoch) => {
        tms = dayjs()
      }
      const onEpochEnd = (epoch, logs) => {
        console.log(epoch + 1, logs)
        this.epochTime = dayjs().diff(tms)
        this.epochCurrent = epoch + 1
        this.trainProgress = this.epochCurrent / this.params.epochs * 100
        this.epochLogs.push({ epoch, ...logs })
      }
      const onBatchEnd = (batch, logs) => {
        this.batchLogs.push({batch, ...logs })
        this.batchLossLogs = this.batchLogs.map((x) => ({ text: x.batch, value: x.loss }))
        this.batchMseLogs = this.batchLogs.map((x) => ({ text: x.batch, value: x.mse }))
      }
      const customCallback = new tf.CustomCallback({
        onEpochBegin,
        onEpochEnd,
        onBatchEnd,
        onTrainBegin: () => { this.state = 'training' },
        onTrainEnd: () => {
          this.state = 'trained'
          this.canPreview = true
          // this.epochCurrent = this.params.epochs
          // this.trainProgress = this.epochCurrent / this.params.epochs * 100
        }
      })
      await model.fit(features, labels, {
        epochs: this.params.epochs,
        batchSize: this.params.batchSize,
        shuffle: true,
        callbacks: customCallback
      })
    },
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    async onStartTrain() {
      try {
        this.state = 'preparing'
        this.epochTime = 0
        this.epochCurrent = 0
        this.canPreview = false
        this.predictModel && this.predictModel.dispose()
        await this.timeout(100)
        const textProcessed = this.datasetList.map((x) => ['[', ...this.processText(x), ']']).filter((x) => !!x)
        // console.log('input', textProcessed)
        const maxLen = Number(this.params.maxLen)
        this.predictMaxLen = maxLen
        const [int2char, char2int] = this.generateCharacterMap(textProcessed)
        console.log(int2char)
        console.log(char2int)
        this.int2char = { ...int2char }
        this.char2int = { ...char2int }
        window.localStorage.setItem('autocorrect:char2int', JSON.stringify(this.char2int))
        // console.log(int2char, char2int)
        const intWords = textProcessed.map((x) => this.textToNumber(x, maxLen, char2int))
        // console.log(intWords)
        let trainFeatures = this.createFeatureSet(intWords, maxLen)
        let trainLabels = this.createLabelSet(intWords, maxLen)
        trainFeatures = this.parseOneHotEncoding(trainFeatures, maxLen, this.ALPHA_LEN)
        trainLabels = this.parseOneHotEncoding(trainLabels, maxLen, this.ALPHA_LEN)
        const model = await this.createModel(maxLen, this.ALPHA_LEN)
        // // console.log('shape', trainFeatures.shape, this.model.inputLayers)
        await this.trainModel(model, trainFeatures, trainLabels)
        await model.save('localstorage://autocorrect_model')
        this.predictModel = await tf.loadLayersModel('localstorage://autocorrect_model')
        trainFeatures.dispose()
        trainLabels.dispose()
        model.dispose()
      } catch (error) {
        console.error(error)
      }
    },
    async onLoadLocalModel() {
      try {
        this.predictModel = await tf.loadLayersModel('localstorage://autocorrect_model')
        let char2int = window.localStorage.getItem('autocorrect:char2int')
        char2int = JSON.parse(char2int)
        this.int2char = Object.keys(char2int).reduce((list, x) => {
          list[char2int[x]] = x
          return list
        }, {})
        this.char2int = char2int
        // console.log(this.predictModel.summary())
        // console.log('shape', this.predictModel.layers[0].batchInputShape)
        this.canPreview = true
        this.predictMaxLen = this.predictModel.layers[0].batchInputShape[1]
      } catch (error) {
        console.error('model does not exists.')
      }
    },
    async onExportModel() {
      await this.model.save('downloads://autocorrect_model')
    },
    async onImportModel() {
      this.model = await tf.loadLayersModel()
    },
    onInputChange(val) {
      try {
        if (!val) {
          this.predicted = ''
          return
        }
        let features = [val].map((x) => this.processText(x)).filter((x) => !!x && x.length > 3)
        // console.log(features)
        if (features.length < 1) return
        features = features.map((x) => this.textToNumber(x, this.predictMaxLen, this.char2int))
        features = this.parseOneHotEncoding(features, this.predictMaxLen, this.ALPHA_LEN)
        let pred = this.predictModel.predict(features)
        // console.log(pred)
        pred = pred.argMax(-1).arraySync()
        // console.log(pred)
        pred = this.fromOneHotEncoding(pred, this.predictMaxLen, this.int2char)
        this.predicted = pred[0].join('')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.autocomplete-page {
  &__upload {
    position: relative;
    // display: inline-block;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 4px;
    background-color: rgba(25, 118, 210, 0.1);
    text-align: center;

    &-icon,
    &-text {
      color: rgba(25, 118, 210, 1) !important;
    }

    &-text {
      font-size: 12px;
    }

    $upload: &;
    &:hover {
      background-color: rgba(25, 118, 210, 0.2);
    }
    &--active {
      cursor: default;
      display: flex;
      align-items: center;
      text-align: left;

      #{$upload}-text {
        max-width: 70%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    &--disabled {
      cursor: default;
      background-color: rgba(0, 0, 0, 0.1) !important;

      #{$upload}-icon,
      #{$upload}-text {
        color: rgba(0, 0, 0, 0.5) !important;
      }
    }
    & > input {
      display: block !important;
      opacity: 0;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      cursor: pointer;
      // z-index: 9;
    }
  }
  &-card {
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0px 2px 2px rgb(0 0 0 / 20%);
    background-color: #fff;

    // &__wrap {
    //   padding: 18px;
    //   border-bottom: 1px solid #dadce0;
    //   position: relative;
    // }
    &__title {
      font-size: 18px;
      padding: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      color: rgba(66, 66, 66, 1);
    }
    &__text {
      padding: 0 16px 16px 16px;
    }
  }
  &-panel {
    position: relative;

    $panel: &;

    &--active {
      #{$panel}__title {
        &-icon > .v-icon,
        &-text {
          color: rgba(25, 118, 210, 1) !important;
        }
        &-icon {
          transform: rotate(180deg);
        }
      }
    }

    &__btn {
      padding: 16px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &-icon > .v-icon,
      &-text {
        color: rgba(0, 0, 0, 0.5) !important;
      }

      $btn: &;

      &:hover {

        &:not(#{$btn}--disabled) {
          background-color: rgba(25, 118, 210, 0.1);
        }

        &:not(#{$btn}--disabled) #{$btn}-icon > .v-icon,
        &:not(#{$btn}--disabled) #{$btn}-text {
          color: rgba(25, 118, 210, 1) !important;
        }
      }

      &--disabled {
        cursor: default;
        #{$btn}-icon > .v-icon,
        #{$btn}-text {
          color: rgba(0, 0, 0, 0.3) !important;
        }
        // &:hover {
        //   background-color: transparent !important;
        // }

        // & > #{$btn}-icon > .v-icon,
        // & >#{$btn}-text {
        //   color: rgba(0, 0, 0, 0.5) !important;
        // }
      }
    }

    &__title {
      padding: 16px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &-icon > .v-icon,
      &-text {
        color: rgba(0, 0, 0, 0.5) !important;
      }

      &-icon {
        transition: transform .3s ease-in-out !important;
      }

      $title: &;

      &:hover {
        background-color: rgba(25, 118, 210, 0.1);

        #{$title}-icon > .v-icon,
        #{$title}-text {
          color: rgba(25, 118, 210, 1) !important;
        }
      }
    }

    &__content {
      padding: 16px;
    }
  }
}
</style>
