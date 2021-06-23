<template>
<div>
  <el-card>
    <div ref="echart" id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</div>
</template>

<script>
import * as echarts from 'echarts'
import echartApi from '@/api/echart.js'
import _ from 'lodash'
export default {
  name: 'echartManage.vue',
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }

    }
  },
  created () {
  },
  mounted () {
    const myChart = echarts.init(this.$refs.echart)
    echartApi.getEchart().then(response => {
      const resp = response.data
      console.log('表格数据', resp)
      // 指定图表的配置项和数据

      // 合并
      const result = _.merge(resp.data, this.options)

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
    })
  }
}
</script>

<style scoped>

</style>
