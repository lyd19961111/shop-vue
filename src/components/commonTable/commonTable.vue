<template>
  <div>
    <template>
      <!-- 表格部分 -->
      <el-table border stripe :data="tableData" style="width: 100%">
        <el-table-column label="序号" width="85" type="index">
        </el-table-column>
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.name"
          :prop="item.prop"
          width="120"
        >
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pag.pagenum"
      :page-sizes="[1, 2, 5,10]"
      :page-size="pag.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array,
    tableLabel: Array,
    pag: Object,
    total: Number
  },
  data () {
    return {
      currentPage4: 4
    }
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      console.log(newSize)
      this.$emit('changePage', newSize)
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newCurrent) {
      console.log(newCurrent)
      this.$emit('changeCurrent', newCurrent)
    },
    // 监听switch开关状态的改变
    userStateChange (row) {
      this.$emit('changeState', row)
    },
    // 编辑
    handleEdit (id) {
      this.$emit('openEdit', id)
    },
    //  删除用户
    delUser (id) {
      this.$emit('delUser', id)
    }
  }
}
</script>

<style>
</style>
