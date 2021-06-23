<template>
<div>
  <bread-crumb :crumbList="crumblist"></bread-crumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getList()" >
          <el-button slot="append" icon="el-icon-search"  @click="getList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary"  @click="ADD">添加商品</el-button>
      </el-col>
    </el-row>

<!--    table组件-->
    <common-table :tableData="goodList" :tableLabel="goodLabel" :pag="queryInfo" :total="total" @changePage="changePage" @changeCurrent="changeCurrent">
      <el-table-column slot="a" label="创建时间" prop="add_time">
        <template slot-scope="scope">
          {{scope.row.add_time|time}}
        </template>
      </el-table-column>
     <el-table-column slot="b" label="操作">
       <template slot-scope="scope" >
       <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)"></el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="delClose(scope.row.goods_id)"></el-button>
       </template>
     </el-table-column>
    </common-table>
  </el-card>

  <common-dialog v-model="editForm" :visible.sync="editVisible" :FormLabel="editLabel" @handleAdd="allowGood()"></common-dialog>
</div>
</template>

<script>
import { time } from '@/utils/time.js'
import goodApi from '@/api/good.js'
import BreadCrumb from '../../../components/breadCrumb/breadCrumb'
import CommonTable from '../../../components/commonTable/commonTable'
import CommonDialog from '../../../components/commonDialog/commonDialog'
export default {
  name: 'goodList.vue',
  components: { CommonDialog, CommonTable, BreadCrumb },
  filters: {
    time (val) {
      return time(val)
    }
  },
  data () {
    return {
      // 面包屑
      crumblist: [
        {
          name: '首页',
          path: '/home'
        },
        {
          name: '商品管理'

        },
        {
          name: '商品列表'
        }
      ],
      // 商品列表
      goodList: [],
      goodLabel: [
        {
          name: '商品名称',
          prop: 'goods_name'
        },
        {
          name: '商品价格(元）',
          prop: 'goods_price'
        },
        {
          name: '商品重量',
          prop: 'goods_weight'
        }
      ],
      // 分页
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0, // 总数据
      editVisible: false, // 编辑窗口,
      editForm: {},
      editLabel: [
        {
          name: '商品名称',
          prop: 'goods_name'
        },
        {
          name: '商品价格(元）',
          prop: 'goods_price'
        },
        {
          name: '商品重量',
          prop: 'goods_weight'
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      goodApi.getlist(this.queryInfo).then(response => {
        const resp = response.data
        console.log('1111aa', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口获取失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '获取列表成功'
          })
          this.goodList = resp.data.goods
          this.total = resp.data.total
        }
      })
    },
    // 改变显示页数
    changePage (val) {
      this.queryInfo.pagesize = val
      this.getList()
    },
    // 改变当前页
    changeCurrent (val) {
      this.queryInfo.pagenum = val
      this.getList()
    },
    // 编辑窗口
    edit (row) {
      this.editVisible = !this.editVisible
      this.editForm = row
    },
    // 提交编辑更新
    allowGood () {
      console.log(this.editForm)
      goodApi.updateGoodList(this.editForm).then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '因后端问题，无法提交'
          })
          this.getList()
        }
      })
    },
    // 删除
    delClose (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodApi.deleteGood(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加商品跳转
    ADD () {
      this.$router.push({ path: '/goods/add' })
    }
  }

}
</script>

<style scoped>

</style>
