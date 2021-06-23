<template>
<div  style="height:100px " ref="echart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'echart.vue',
  props: {
    chartData: {
      type: Object,
      default () {
        return {
          xData: [],
          series: []
        }
      }
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options () {
      return this.isAxisChart ? this.axisOption : this.normalOption
    }
  },
  watch: {
    chartData: {
      handler: function () {
        this.initChart()
      },
      deep: true
    }
  },
  data () {
    return {
      echart: null,
      axisOption: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      },
      normalOption: {
        series: []
      }
    }
  },
  methods: {
    initChart () {
      this.initChartData()
      if (this.echart) {
        this.echart.setOption(this.options)
      } else {
        this.echart = echarts.init(this.$refs.echart)
        this.echart.setOption(this.options)
      }
    },
    initChartData () {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        this.normalOption.series = this.chartData.series
      }
    }
  }
}
</script>

<style scoped>

</style>
