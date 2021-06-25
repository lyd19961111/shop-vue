<template>
  <div>
    <el-card>
        <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
     <common-table :total="total" :pag="queryInfo" @changeCurrent="changeCurrent" @changePage="changePage" :tableData="userlist" :tableLabel="tableLabel" @changeState="changeState" @openEdit="openEdit"  @delUser="delUser">
       <el-table-column slot="a" label="状态">
         <template slot-scope="scope">
           <el-switch v-model="scope.row.mg_state" @change="changeState (scope.row)"> </el-switch>
         </template>
       </el-table-column>
       <el-table-column slot="b" label="操作" width="180px">
         <template slot-scope="scope">
           <el-button
             type="primary"
             icon="el-icon-edit"
             size="mini"
             @click="openEdit(scope.row.id)"
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
               @click="assignRole(scope.row)"
             ></el-button>
           </el-tooltip>
         </template>
       </el-table-column>
     </common-table>
    </el-card>

    <!-- 添加用户区域  这里的v-model="addForm" 相当于:value="addForm" @input="input"-->
    <common-dialog  v-model="addForm" :FormLabel="addFormLabel" :FormRules="addFormRules" :visible.sync="addDialogVisible" @handleAdd="addUser">
    </common-dialog>
<!--   编辑用户区域-->
    <common-dialog  v-model="editForm" :FormLabel="editLabel" :FormRules="editFormRules" :visible.sync="editDialogVisible"  @handleAdd="updateUser" :disabled="true">
    </common-dialog>
<!--    分配角色区域-->
    <el-dialog title="角色分配" :visible.sync="roleFormVisible"
    width="50%" @close="roleDialogClose">
      <div>
        <p>当前用户:{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
      </div>
      <p>分配新角色：
        <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolelist"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select></p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogClose">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import userApi from '@/api/user.js'
import commonTable from '../../../components/commonTable/commonTable.vue'
import CommonDialog from '../../../components/commonDialog/commonDialog.vue'
export default {
  components: { commonTable, CommonDialog },
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/
      if (regEmail.test(value)) {
        // 合法邮箱
        callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkmobile = (rule, value, callback) => {
      const regPhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regPhone.test(value)) {
        // 合法手机号
        callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      addDialogVisible: false, // 添加用户对话框的显示和隐藏
      // 面包屑列表
      crumbList: [
        {
          name: '首页',
          path: '/home'
        },
        {
          name: '课程管理'
        },
        {
          name: '用户列表'
        }
      ],
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数
        pagesize: 2// 当前每页显示多少条
      }, // 总记录数
      total: 0,
      // 用户列表
      userlist: [],
      // 表格菜单
      tableLabel: [
        {
          name: '姓名',
          prop: 'username'
        },
        {
          name: '邮箱',
          prop: 'email'
        },
        {
          name: '电话',
          prop: 'mobile'
        },
        {
          name: '角色',
          prop: 'role_name'
        }
      ],
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的Label
      addFormLabel: [
        {
          name: '用户名',
          prop: 'username'
        },
        {
          name: '密码',
          prop: 'password'
        },
        {
          name: '邮箱',
          prop: 'email'
        },
        {
          name: '手机号',
          prop: 'mobile'
        }
      ],
      // 添加用户表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 编辑用户的表单数据
      editForm: {},
      // 编辑用户的Label:
      editLabel: [
        {
          name: '用户名',
          prop: 'username'
        },
        {
          name: '邮箱',
          prop: 'email'
        },
        {
          name: '手机号',
          prop: 'mobile'
        }
      ],
      // 编辑用户验证规则
      editFormRules: {
        username: [
          { required: true, message: '用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 编辑用户的显示与隐藏
      disabled: true, // 禁用input
      roleFormVisible: false, // 角色分配弹出框
      roleForm: {
        region: ''
      }, // 角色分配
      // 需要被分配的角色等级
      userInfo: {},
      rolelist: [], // 所有角色数据列表
      selectRoleId: ''// 分配角色选中的id

    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList () {
      userApi.userList(this.queryInfo.query, this.queryInfo.pagenum, this.queryInfo.pagesize).then(response => {
        const resp = response.data
        console.log('用户列表', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '获取列表失败'
          })
        } else {
          this.userlist = resp.data.users
          this.total = resp.data.total
        }
      })
    },
    // 改变每页显示条数
    changePage (val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 改变当前页
    changeCurrent (val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 修改状态开关
    changeState (val) {
      console.log(val)
      userApi.changeUseState(val.id, val.mg_state).then(response => {
        const resp = response.data
        console.log(resp)
        if (resp.meta.status !== 200) {
          val.mg_state = !val.mg_state
          this.$message({
            type: 'error',
            message: '状态更新失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '状态更新成功'
          })
        }
        // console.log(resp)
      })
    },
    // 弹出添加用户对话框
    showDialog () {
      this.addDialogVisible = !this.addDialogVisible
    },
    // 弹出框取消按钮
    adddialog (val) {
      // console.log(val)
      this.addDialogVisible = val
    },
    // 新增用户
    addUser () {
      userApi.addUser(this.addForm).then(response => {
        console.log(response)
        const resp = response.data
        if (resp.meta.status !== 201) {
          this.$message({
            type: 'error',
            message: '添加用户失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '添加用户成功'
          })
          // 添加成功后，隐藏弹框
          this.addDialogVisible = false
          // 重新获取用户列表
          this.getUserList()
        }
      })
    },
    // 打开编辑窗口
    openEdit (id) {
      this.editDialogVisible = !this.editDialogVisible
      userApi.getId(id).then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: '查询用户失败'
          })
        } else {
          this.editForm = resp.data
        }
      })
    },
    // 保存修改后的用户
    updateUser () {
      // console.log('1111', this.editForm)
      userApi.updateUser(this.editForm).then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            success: '更新用户失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '更新用户成功'
          })
          this.getUserList()
          this.editDialogVisible = false
        }
      })
    },
    // 删除用户
    delUser (id) {
      // 询问是否删除数据
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteUser(id).then(response => {
          const resp = response.data
          if (resp.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 更新列表
            this.getUserList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log('11111', id)
    },
    assignRole (userInfo) {
      this.roleFormVisible = !this.roleFormVisible
      this.userInfo = userInfo
      // 展示对话框之前，获取所有角色列表
      userApi.getAssign().then(response => {
        const resp = response.data
        console.log('授权角色', resp)
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口调用失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '获取列表成功'
          })
          this.rolelist = resp.data
        }
      })
    },
    // 点击确定按钮，分配角色 保存角色权限
    saveRoleInfo () {
      if (!this.selectRoleId) {
        this.$message({
          type: 'warning',
          message: '请选择角色'
        })
      } else {
        userApi.giveAssign(this.userInfo.id, this.selectRoleId).then(response => {
          const resp = response.data
          console.log('角色分配成功', resp)
          if (resp.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: '接口调用失败'
            })
          } else {
            this.$message({
              type: 'success',
              message: '更新角色成功'
            })
            this.roleFormVisible = false
            this.getUserList()
          }
        }

        )
      }
    },
    // 监听权限分配的对话框关闭事件
    roleDialogClose () {
      this.selectRoleId = ''
      this.userInfo = {}
      this.roleFormVisible = false
    }
  }
}
</script>

<style>
</style>
