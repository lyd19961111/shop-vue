<template>
<div>
  <bread-crumb :crumbList="crumbList"></bread-crumb>
  <el-card>
<!--    添加角色-->
    <el-row>
      <el-col>
        <el-button type="primary"  @click="addRole">添加角色</el-button>
      </el-col>
    </el-row>
<!--    角色列表-->
<common-table :tableData="rolelist" :tableLabel="roleLabel" :total="total" :pag="queryInfo"  >
<!--  展开列-->
  <el-table-column slot="c" type="expand">
    <template slot-scope="scope">
      <el-row :class="['bdbottom',i===0?'bdtop':'','vcenter']" v-for="(item,i) in scope.row.children" :key="item.id">
<!--        一级权限-->
        <el-col :span="5">
          <el-tag closable @close="removeTagId(scope.row,item.id)">{{item.authName}}</el-tag>
          <i class="el-icon-arrow-right"></i>
        </el-col>
<!--        二级，三级权限-->
        <el-col :span="19">
<!--          渲染二级权限-->
          <el-row :class="[subI==0?'':'bdtop','vcenter']" v-for="(subItem,subI) in item.children" :key="subItem.id">
            <el-col :span="6">
              <el-tag type="success" closable @close="removeTagId(scope.row,subItem.id)">{{subItem.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="18">
              <el-tag type="warning " v-for="(thirdItem) in subItem.children" :key="thirdItem.id" closable @close="removeTagId(scope.row,thirdItem.id)">
                {{thirdItem.authName}}
              </el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </template>
  </el-table-column>
<!--  操作例-->
  <el-table-column slot="b" label="操作" width="350px">
    <template slot-scope="scope">
      <el-button
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="edit(scope.row)"
      >编辑</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        @click="del(scope.row.id)"
      >删除</el-button>
        <el-button
          type="warning"
          icon="el-icon-setting"
          size="mini"
          @click="showSetDialog(scope.row)"
        >分配角色</el-button>
    </template>
  </el-table-column>
</common-table>
  </el-card>
<!--  分配权限弹出框-->
  <show-set-dialog :treelist="treelist" :treeProps="treeProps" :defKeys="defKeys" :visible.sync="setDialogVisible"  @allowRole="allowRole"></show-set-dialog>
<!--  添加角色弹出框-->
  <common-dialog v-model="addRoleForm" :visible.sync="addDialogVisible" :FormLabel="roleLabel" :FormRules="addRoleRules" @handleAdd="addAssgin"></common-dialog>
<!--  编辑角色弹出框-->
  <common-dialog  v-model="editForm" :FormLabel="roleLabel" :FormRules="addRoleRules" :visible.sync="editDialogVisible"  @handleAdd="updateRole">
  </common-dialog>
</div>
</template>

<script>
import authApi from '@/api/auth.js'
import breadCrumb from '../../../components/breadCrumb/breadCrumb.vue'
import commonTable from '../../../components/commonTable/commonTable.vue'
import ShowSetDialog from '../../../components/commonDialog/showSetDialog'
import CommonDialog from '../../../components/commonDialog/commonDialog'
export default {
  components: { CommonDialog, ShowSetDialog, breadCrumb, commonTable },
  name: 'roleList.vue',
  data () {
    return {
      // 面包屑
      crumbList: [
        {
          name: '首页'

        },
        {
          name: '权限管理'
        },
        {
          name: '角色列表'
        }
      ],
      // 角色列表
      rolelist: [],
      // 角色label
      roleLabel: [
        {
          name: '角色名称',
          prop: 'roleName'
        },
        {
          name: '角色描述',
          prop: 'roleDesc'
        }
      ],
      // 分页
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      setDialogVisible: false,
      role: '',
      treelist: [], // 角色权限数列表
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      addDialogVisible: false, // 添加角色弹出框
      addRoleForm: {}, // 添加角色
      addRoleRules: {
        roleName: [
          { required: true, message: '用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      editForm: {},
      editDialogVisible: false // 编辑角色弹出框
    }
  },
  created () {
    this.getRolelist()
  },
  methods: {
    // 获取角色列表
    getRolelist () {
      authApi.getRole().then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '失败'
          })
        } else {
          this.rolelist = resp.data
        }
      })
    },
    // 根据ID删除tag标签权限
    removeTagId (role, itemId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // authApi.delRoleAuth(role.id, itemId).then(response => {
        //   const resp = response
        //   console.log('删除角色权限', resp)
        // })
        authApi.delRoleAuth(role, itemId).then(response => {
          console.log('删除角色权限', response)
          const resp = response.data
          if (resp.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: '错误'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            role.children = resp.data
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 弹出权限分配弹出框
    showSetDialog (row) {
      this.roleId = row.id
      this.setDialogVisible = !this.setDialogVisible
      authApi.getTree().then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '获取失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '获取列表成功'
          })
          // 获取到的数据保存到数组中
          this.treelist = resp.data
          // 递归三级节点的id
          // console.log('tree', row)
          this.getDefKeys(row, this.defKeys)
        }
      })
    },
    // 通过递归形式，获取角色下所有三级权限的id，并保存到defkeys数组中
    getDefKeys (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getDefKeys(item, arr))
    },
    allowRole (keystr) {
      console.log('kkk', this.roleId, keystr)
      authApi.addRole(this.roleId, keystr).then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '接口连接错误'
          })
        } else {
          this.$message({
            type: 'success',
            message: '跟新成功'
          })
          this.getRolelist()
          this.setDialogVisible = false
          this.defKeys = []
        }
      })
    },
    // 添加角色点击事件
    addRole () {
      this.addDialogVisible = !this.addDialogVisible
    },
    // 提交添加角色
    addAssgin () {
      authApi.addAssignRole(this.addRoleForm).then(response => {
        const resp = response.data
        console.log('接口获取成功', resp)
        if (resp.meta.status !== 201) {
          this.$message({
            type: 'error',
            message: '接口获取失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '创建用户成功'
          })
          this.getRolelist()
          this.addDialogVisible = false
        }
      })
    },
    // 编辑按钮
    edit (row) {
      this.editDialogVisible = !this.editDialogVisible
      this.editForm = row
    },
    // 编辑角色
    updateRole () {
      authApi.updateAssgin(this.editForm).then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '编辑接口失败'
          })
        } else {
          this.$message({
            type: 'success',
            message: '更新角色成功'
          })
          this.getRolelist()
          this.addDialogVisible = false
        }
      })
    },
    // 删除角色
    del (id) {
      this.$confirm('确定删除此角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        authApi.delAssign(id).then(response => {
          const resp = response.data
          if (resp.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: '接口获取失败'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getRolelist()
          }
        }
        )
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
.el-tag{
  margin:7px;
}
.bdtop{
  border-top:1px solid #eee;
}
.bdbottom{
  border-bottom:1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
