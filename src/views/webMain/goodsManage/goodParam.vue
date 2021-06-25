<template>
<div>
  <el-card>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      :closable="false"
      show-icon>
    </el-alert>
   <el-row >
     <el-col>
       <span>选择商品分类:</span>
       <el-cascader
         expand-trigger="hover"
         v-model="selectKey"
         :options="paramList"
         :props="paramProps"
         @change="paramsChange"></el-cascader>
     </el-col>
   </el-row>
<!--    tabs标签页-->
    <el-tabs v-model="activeName" @tab-click="tabsClick">
<!--      添加动态参数的面板-->
      <el-tab-pane label="动态参数" name="many">
<!--        添加参数的按钮-->
        <el-button type="primary" :disabled="btnDidable" @click="addParameter">添加参数</el-button>
<!--        动态参数表格-->
        <el-table :data="manyTableData" border stript>
<!--          展开列-->
          <el-table-column type="expand">
            <template slot-scope="scope">
<!--              循环渲染tags-->
              <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="tagClose(index,scope.row)">{{item}}</el-tag>
<!--              输入的文本框-->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
<!--              按钮事件-->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
<!--          索引值-->
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary"  size="mini" icon="el-icon-edit" @click="editMany(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="delAll(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="btnDidable" @click="addAttribute">添加属性</el-button>
        <el-table :data="onlyTableData" border stript>
          <!--          展开列-->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!--              循环渲染tags-->
              <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="tagClose(index,scope.row)">{{item}}</el-tag>
              <!--              输入的文本框-->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <!--              按钮事件-->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!--          索引值-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary"  size="mini" icon="el-icon-edit" @click="editMany(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="delAll(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>

<!--  添加参数弹出框-->
  <common-dialog :visible.sync="paramVisible" v-model="paramForm" :FormLabel="paramLabel" @handleAdd="fixParam"></common-dialog>
<!--  添加属性弹出框-->
  <common-dialog :visible.sync="attributeVisible" v-model="attributeForm" :FormLabel="attributeLabel" @handleAdd="fixAttribute" ></common-dialog>
<!--  编辑属性弹出框-->
  <common-dialog :visible.sync="editVisible"  v-model="editForm" :FormLabel="editLabel" @handleAdd="addEdit" ></common-dialog>
</div>
</template>

<script>
import goodApi from '@/api/good.js'
import CommonDialog from '../../../components/commonDialog/commonDialog'
export default {
  name: 'goodParam.vue',
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
          name: '参数列表'
        }
      ],
      paramList: [], // 参数列表
      paramProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }, // 级联选择框的配置对象
      selectKey: [], // 级联选择框变化
      thirdId: 0, // 第三级的id
      activeName: 'many',
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态参数数据
      paramVisible: false, // 增加参数弹出框
      paramForm: {}, // 增加参数弹出框表单
      paramLabel: [
        {
          name: '动态参数',
          prop: 'attr_name'
        }
      ],
      attributeVisible: false, // 添加属性弹出框
      attributeForm: {}, // 增加参数弹出框表单
      attributeLabel: [
        {
          name: '静态属性',
          prop: 'attr_name'
        }
      ],
      editVisible: false, // 编辑属性弹出框
      editForm: {},
      editLabel: [
        {
          name: '动态参数',
          prop: 'attr_name'
        }
      ]
    }
  },
  created () {
    this.paramsList()
  },
  computed: {
    btnDidable () {
      if (this.selectKey.length === 3) {
        return false
      }
      return true
    }
  },
  methods: {
    paramsList () {
      goodApi.getParam().then(response => {
        const resp = response.data
        console.log('参数列表', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '获取列表成功'
          })
          this.paramList = resp.data
        }
      })
    },
    getParamsData () {
      // this.thirdId = this.selectKey[2]
      // console.log(this.thirdId)
      goodApi.getList(this.thirdId, this.activeName).then(response => {
        const resp = response.data
        console.log('参数', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '获取成功'
          })
          resp.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 控制文本框的显示与隐藏
            item.inputVisible = false
            // 文本框输入的值
            item.inputValue = ''
          })
          console.log('909090', resp)
          if (this.activeName === 'many') {
            this.manyTableData = resp.data
          } else {
            this.onlyTableData = resp.data
          }
        }
      })
    },
    // 监听级联选择框的变化
    paramsChange () {
      this.thirdId = this.selectKey[2]
      this.getParamsData()
    },
    // 动态参数和静态属性的切换
    tabsClick () {
      this.getParamsData()
      // console.log('1111')
      // if (this.selectKey.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请先选择商品类型'
      //   })
      // } else {
      //   if (this.activeName === 'many') {
      //     this.paramsChange()
      //   } else if (this.activeName === 'only') {
      //     this.paramsChange()
      //   }
      // }
    },
    // 添加参数弹出框
    addParameter () {
      this.paramVisible = !this.paramVisible
    },
    // 确定添加参数
    fixParam () {
      goodApi.updateParam(this.thirdId, this.paramForm, this.activeName).then(response => {
        const resp = response.data
        if (resp.meta.status !== 201) {
          this.$message({
            type: 'error',
            message: '接口调用失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '增加成功'
          })
          this.paramVisible = false
          this.getParamsData()
        }
      })
    },
    // 添加属性弹出框
    addAttribute () {
      this.attributeVisible = !this.attributeVisible
    },
    fixAttribute () {
      goodApi.updateParam(this.thirdId, this.attributeForm, this.activeName).then(response => {
        const resp = response.data
        if (resp.meta.status !== 201) {
          this.$message({
            type: 'error',
            message: '接口调用失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '增加成功'
          })
          this.attributeVisible = false
          this.getParamsData()
        }
      })
    },
    // 编辑属性
    editMany (row) {
      console.log(row)
      this.editVisible = !this.editVisible
      this.editForm = row
    },
    // 编辑确定
    addEdit () {
      goodApi.updateMany(this.thirdId, this.editForm, this.activeName).then(response => {
        console.log(this.thirdId, this.editForm, this.activeName)
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口失败'
          })
        } else {
          this.getParamsData()
          this.editVisible = false
        }
        // console.log('编辑成功', resp)
      })
    },
    // 删除
    delAll (id) {
      this.$confirm('确定删除此属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodApi.delMany(this.thirdId, id).then(response => {
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
            this.getParamsData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // tag按下回车键或者失去焦点
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
      }
      row.inputVisible = false
      row.inputValue = ''
      // 发起网络请求，进行保存
      this.saveTag(row)
    },
    // 保存tags标签
    saveTag (row) {
      goodApi.addTag(this.thirdId, row).then(response => {
        const resp = response.data
        console.log('tag添加成功', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口调用失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '增加标签成功'
          })
        }
      })
    },
    // tag点击按钮
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除 tags标签
    tagClose (id, row) {
      row.attr_vals.splice(id, 1)
      this.saveTag(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row{
  margin:15px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
width: 120px;
}
</style>
