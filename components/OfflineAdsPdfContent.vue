<template>
  <div class="report">
    <template v-for="(page, n) in pages">
      <section :key="'page-' + n" class="report-item">
        <div class="report-header">
          <div class="report-header__title">{{ title }}</div>
          <v-spacer />
          <div class="report-header__key">minimum localization: <span class="report-header__value">{{ minLocalization }}</span></div>
          <div class="report-header__key" style="padding-left: 8px">minimum similarity: <span class="report-header__value">{{ minSimilarity }}</span></div>
        </div>
        <table class="report-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Results</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in page">
              <tr :key="'report-' + item.id">
                <td style="width: 40px">{{ item.no }}</td>
                <td style="width: 300px">
                  <div class="report__image" :style="{ backgroundImage: 'url(' + item.img + ')' }"></div>
                </td>
                <td>
                  <template v-for="box in item.boxes">
                    <div :key="'box-' + item.id + box.id" class="report-box">
                      <div>
                        <div class="report-box__color-box" :style="{ backgroundColor: box.color }">
                          {{ 'P' + (box.$index + 1) }}
                        </div>
                      </div>
                      <div>{{ box.object }}</div>
                      <div>{{ Math.ceil(box.score * 100) }}%</div>
                    </div>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </section>
      <div v-if="n < page.length - 1" :key="'page-break-' + n" class="report__page-break"></div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'OfflineAdsPdfContent',
  props: {
    title: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default() {
        return []
      }
    },
    minLocalization: {
      type: Number,
      required: true,
      default: 0,
    },
    minSimilarity: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      itemsPerPage: 4,
      pages: [],
    }
  },
  watch: {
    items: {
      deep: true,
      handler(val) {
        this.parseItems(val || [])
      }
    }
  },
  methods: {
    parseItems(items) {
      this.pages = []
      for (let i = 0; i < items.length; i += this.itemsPerPage) {
        this.pages.push(items.slice(i, i + this.itemsPerPage))
      }
      console.log(this.pages)
    }
  }
}
</script>

<style lang="scss" scoped>
.report {
  // padding: 5mm;
  padding-left: 6mm;
  padding-right: 6mm;

  &-item {
    padding-top: 3mm;
    padding-bottom: 6mm;
    height: 297mm;
    overflow: hidden;
  }

  // & > &-item + &-item {
  //   clear: both;
  //   page-break-after: always;
  // }
  &__page-break {
    page-break-inside: avoid;
  }

  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    &__title {
      font-family: 'Kanit', 'Roboto', sans-serif;
      font-weight: 500;
      font-size: 1.2rem;
    }

    &__key {
      font-family: 'Kanit', 'Roboto', sans-serif;
      font-weight: 500;
      font-size: 0.8rem;
    }

    &__value {
      font-family: 'Kanit', 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 0.8rem;
    }
  }

  &__image {
    width: 300px;
    aspect-ratio: 4/3;
    max-height: 300px;
    background-repeat: no-repeat;
    background-size: contain;
  }

  &-table {
    width: 100%;
    border-collapse: collapse;

    & th,
    & td {
      // border: thin solid #eee;
      padding: 8px;
      font-family: 'Kanit', 'Roboto', sans-serif;
    }

    & th {
      font-size: 1rem;
      font-weight: 500;
      background-color: #dddddd;
    }

    & td {
      vertical-align: top;
      font-weight: 300;
    }

    & > tbody > tr > td:first-child {
      text-align: center;
    }
  }

  &-box {
    display: flex;

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

    & > * {
      flex: 1;
      font-family: 'Kanit', 'Roboto', sans-serif;
    }

    & > *:first-child {
      flex: 0;
      min-width: 28px;
    }

    & > *:last-child {
      flex: 0;
      min-width: 40px;
      text-align: right;
    }
  }

  td > &-box + &-box {
    margin-top: 8px;
  }
}
@page {
  size: A4;
  margin: 0;
}
@media print {
  .report {
    width: 210mm;
    height: 297mm;
  }
}
</style>
