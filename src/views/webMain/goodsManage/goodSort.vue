<template>
<div>
  <el-card>
<!--    添加分类-->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addSort">添加分类</el-button>
      </el-col>
    </el-row>
<!--    table列表-->
    <tree-table class="tree-table" :data="goodsList" :columns="goodsLabel" :selection-type="false" :expand-type="false" show-index index-text="#" border>
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
        <i class="el-icon-error" v-else style="color:red"></i>
      </template>
      <template slot="order" slot-scope="scope">
        <el-tag  v-show="scope.row.cat_level===0">一级</el-tag>
        <el-tag type="success" v-show="scope.row.cat_level===1">二级</el-tag>
        <el-tag type="info" v-show="scope.row.cat_level===2">三级</el-tag>
      </template>
      <template slot="opt" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editSort(scope.row)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delSort(scope.row.cat_id)">删除</el-button>
      </template>
    </tree-table>
<!--    分页组件-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>

<!--  添加分类弹出框-->
  <el-dialog title="添加分类"  :visible.sync="sortVisible" @close="addSortClose">
    <el-form :model="addSortForm" :rules="addSortRule" ref="sortFormRef">
      <el-form-item label="分类名称"  prop="cat_name" label-width="80px" >
        <el-input v-model="addSortForm.cat_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父级分类"  prop="cat_name" label-width="80px" >
<!--        options指定数据源，props指定配置对象-->
        <el-cascader
          expand-trigger="hover"
          v-model="selectKey"
          :props="cacsderProp"
          :options="parentlist"
          @change="parentListChange"
        clearable
        change-on-select></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addSortClose">取 消</el-button>
      <el-button type="primary" @click="saveSort">确 定</el-button>
    </div>
  </el-dialog>
<!--  编辑窗口-->
  <common-dialog :visible.sync="editVisible" v-model="editForm" :FormLabel="editLabel" @handleAdd="updateSort"></common-dialog>
</div>
</template>

<script>
import goodApi from '@/api/good.js'
import CommonDialog from '../../../components/commonDialog/commonDialog'
export default {
  name: 'goodSort.vue',
  components: { CommonDialog },
  data () {
    return {
      // 面包屑
      crumbList: [
        {
          name: '首页'

        },
        {
          name: '商品管理'
        },
        {
          name: '商品分类'
        }
      ],
      // 分页
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0, // 总数据条数
      // table 数据
      goodsList: [],
      goodsLabel: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模版列
          type: 'template',
          // 当前列使用的模版名称
          template: 'isok'

        },
        {
          label: '排序',
          // 表示将当前列定义为模版列
          type: 'template',
          // 当前列使用的模版名称
          template: 'order'

        },
        {
          label: '操作',
          // 表示将当前列定义为模版列
          type: 'template',
          // 当前列使用的模版名称
          template: 'opt'

        }
      ],
      sortVisible: false, // 添加分类弹出框
      addSortForm: {
        cat_name: '', // 将要添加的分类名称
        cat_pid: 0, // 父级分类的id
        cat_level: 0// 分类的等级
      },
      addSortRule: {
        cat_name: [
          { required: true, message: '用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      parentlist: [], // 父级分类别表
      cacsderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectKey: [], // 选中的父级数组分类id
      editVisible: false, // 编辑窗口
      editForm: {}, // 编辑窗口的对象
      editLabel: [
        {
          name: '分类名称',
          prop: 'cat_name'
        }
      ]
    }
  },
  created () {
    // 获取列表
    this.getGoodsList()
  },
  methods: {
    getGoodsList () {
      goodApi.goodList(this.queryInfo).then(response => {
        const resp = response.data
        console.log('aaaaa', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '调用接口不成功'
          })
        } else {
          this.$message({
            type: 'success',
            message: '获取列表成功'
          })
          this.total = resp.data.total
          this.goodsList = resp.data.result
        }
      })
    },
    // 改变一页的树木
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 切换当前页
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 添加分类
    addSort () {
      this.getParentList()
      this.sortVisible = !this.sortVisible
    },
    // 获取父级分类数据列表
    getParentList () {
      goodApi.getParentGood().then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口获取失败'
          })
        } else {
          this.parentlist = resp.data
        }
        // console.log('121212', resp)
      })
    },
    parentListChange () {
      console.log(this.selectKey)
      // 如果electkey数组中的length>0,证明选中父级分类
      // 反之，则说明没有选中父级分类
      if (this.selectKey.length > 0) {
        // 父级分类的id
        this.addSortForm.cat_pid = this.selectKey[this.selectKey.length - 1]
        // 当前分类的等级赋值
        this.addSortForm.cat_level = this.selectKey.length
      } else {
        // 父级分类的id
        this.addSortForm.cat_pid = 0
        // 当前分类的等级赋值
        this.addSortForm.cat_level = 0
      }
    },
    saveSort () {
      this.$refs.sortFormRef.validate(valid => {
        goodApi.saveGood(this.addSortForm).then(response => {
          const resp = response.data
          console.log('122121', resp)
          if (resp.meta.status !== 201) {
            this.$message({
              type: 'error',
              message: '接口失败'
            })
          } else {
            this.$message({
              type: 'success',
              message: '增加成功'
            })
            this.sortVisible = false
            this.getGoodsList()
          }
        })
      })
    },
    addSortClose () {
      this.$refs.sortFormRef.resetFields()
      this.selectKey = []
      this.addSortForm.cat_level = 0
      this.addSortForm.cat_level = 0
      this.sortVisible = false
      // this.selectKey=[],
      // this.addSortForm.cat_name=
    },
    // 编辑窗口
    editSort (row) {
      this.editVisible = !this.editVisible
      this.editForm = row
    },
    // 确定编辑
    updateSort () {
      goodApi.updateGood(this.editForm).then(response => {
        const resp = response.data
        console.log('更新列表', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.editVisible = false
          this.getGoodsList()
        }
      })
    },
    // 删除分类
    delSort (id) {
      this.$confirm('确定删除此分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodApi.delGood(id).then(response => {
          const resp = response.data
          console.log('删除列表', resp)
          if (resp.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: '接口错误'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getGoodsList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
 .tree-table{
   margin-top: 10px;
 }
 .el-cascader{
   width: 100%;
 }
</style>
