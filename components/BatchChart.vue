<template>
  <div>
    <canvas
      ref="batchChart"
      :style="canvasStyle"
    >
    </canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
export default {
  name: 'BatchChartComponent',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    label: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#3f51b5',
    },
  },
  data() {
    return {
      canvasStyle: {
        width: '100%',
        height: '200px',
        maxWidth: '100%',
        minHeight: '200px',
        maxHeight: '200px',
      },
      chart: null,
      defaultOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            align: 'start',
            labels: {
              color: this.color
            }
          }
        }
      },
      localOptions: {},
    }
  },
  watch: {
    data() {
      this.render()
    },
  },
  mounted() {
    this.initCanvas()
    this.render()
    this.localOptions = Object.assign(this.defaultOptions, this.options)
  },
  methods: {
    initCanvas() {},
    render() {
      const labels = this.data.map((x) => x.text)
      const datasets = [{
        label: this.label,
        data: this.data.map((x) => x.value),
        // backgroundColor: this.data.map((x) => x.color)
        fill: false,
        borderColor: this.color,
        backgroundColor: this.color,
        tension: 0.1
      }]
      console.log(datasets)
      if (this.chart) {
        this.chart.data.labels = labels
        this.chart.data.datasets = datasets
        this.chart.update()
      } else {
        console.log('new chart')
        this.chart = new Chart(this.$refs.batchChart, {
          type: 'line',
          data: {
            labels,
            datasets
          },
          options: this.defaultOptions
        })
      }
    }
  },
}
</script>
