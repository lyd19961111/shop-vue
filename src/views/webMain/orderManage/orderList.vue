<template>
<div>
<!--  面包屑-->
  <bread-crumb :crumbList="crumbList"></bread-crumb>
  <el-card>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable  @clear="getOrderList()">
        <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
      </el-input>
    </el-col>
  </el-row>
    <common-table :tableData="orderList" :tableLabel="orderLabel" :pag="queryInfo" :total="total" @changePage="changePage" @changeCurrent="changeCurrent">
      <el-table-column slot="a" label="是否付款" prop="order_pay">
        <template slot-scope="scope">
          <el-tag type="danger">{{scope.row.order_pay|payState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column slot="b" label="操作">
        <template slot-scope="scope">
          <el-button type="primary"  icon="el-icon-edit" size="mini" @click="editAddress">修改地址</el-button>
          <el-button type="success"  icon="el-icon-truck" size="mini"  @click="logisticsInfo">物流信息</el-button>
        </template>
      </el-table-column>
    </common-table>
  </el-card>

<!--  //修改地址弹出框-->
  <common-dialog :visible.sync="editVisible"></common-dialog>
<!--  //物流信息弹出框-->
  <common-dialog :visible.sync="sticsInfoVisible">
  </common-dialog>
</div>
</template>

<script>
import orderApi from '@/api/order.js'
import BreadCrumb from '../../../components/breadCrumb/breadCrumb'
import CommonTable from '../../../components/commonTable/commonTable'
import CommonDialog from '../../../components/commonDialog/commonDialog'
export default {
  name: 'orderList.vue',
  components: { CommonDialog, CommonTable, BreadCrumb },
  // 是否付款过滤
  filters: {
    payState (val) {
      if (val === '0') {
        return '未付款'
      }
      return '已付款'
    }

  },
  data () {
    return {
      // 面包屑
      crumbList: [
        {
          name: '首页',
          path: '/home'
        },
        {
          name: '订单管理'
        }, {
          name: '订单列表'
        }
      ],
      orderList: [], // 订单列表数据
      orderLabel: [
        {
          name: '订单编号',
          prop: 'order_number'
        },
        {
          name: '订单价格',
          prop: 'order_price'
        },
        {
          name: '是否发货',
          prop: 'is_send'
        }
      ], // 订单列表label
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0, // 总数据,
      editVisible: false, // 修改地址弹出框
      // 物流信息弹出框
      sticsInfoVisible: false
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      orderApi.getList(this.queryInfo).then(response => {
        const resp = response.data
        console.log('订单列表', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口失败'
          })
        } else {
          this.orderList = resp.data.goods
          this.total = resp.data.total
        }
      })
    },
    // 改变显示页数
    changePage (val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    // 改变当前页
    changeCurrent (val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    // 修改地址窗口打开
    editAddress () {
      this.editVisible = !this.editVisible
    },
    // 物流信息窗口打开
    logisticsInfo () {
      this.sticsInfoVisible = !this.sticsInfoVisible
      orderApi.getlogistics().then(response => {
        console.log(response)
      })
    }

  }
}
</script>

<style scoped>

</style>
