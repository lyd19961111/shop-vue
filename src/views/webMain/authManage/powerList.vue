<template>
<div>
  <el-card>
  <common-table :tableData="powerlist" :total="total" :pag="queryInfo"  :tableLabel="tableLabel">
    <el-table-column slot="a" label="权限等级" prop="level">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
        <el-tag v-else-if="scope.row.level==='1'" type="success">标签二</el-tag>
        <el-tag v-else type="warning">标签三</el-tag>
      </template>
    </el-table-column>
  </common-table>
  </el-card>
</div>
</template>

<script>
import authApi from '@/api/auth.js'
import commonTable from '../../../components/commonTable/commonTable.vue'
export default {
  name: 'powerList',
  components: { commonTable },
  data () {
    return {
      crumbList: [
        {
          name: '首页'

        },
        {
          name: '权限管理'
        },
        {
          name: '权限列表'
        }
      ],
      // 权限列表
      powerlist: [],
      tableLabel: [
        {
          name: '权限名称',
          prop: 'authName'
        },
        {
          name: '路径',
          prop: 'path'
        }
      ],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0
    }
  },
  created () {
    this.powerList()
  },
  methods: {
    powerList () {
      authApi.getPowerList().then(response => {
        console.log('获取权限列表', response)
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '获取列表失败'
          })
        } else {
          this.powerlist = resp.data
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
