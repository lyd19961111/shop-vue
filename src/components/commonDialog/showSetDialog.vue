<template>
  <el-dialog title="分配权限" :visible="visible" @close="handleClose"  >
    <el-tree ref="treeRef" :data="treelist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="allowRole" >确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    treelist: Array,
    treeProps: Object,
    defKeys: Array,
    visible: {
      type: Boolean,
      default: false
    }
  },
  name: 'showSetDialog.vue',
  data () {
    return {

    }
  },
  created () {
  },
  methods: {
    handleClose () {
      this.$emit('update:visible', false)
    },
    // 增加权限
    allowRole () {
      // console.log('role', this.role.id)
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const keyStr = keys.join(',')
      this.$emit('allowRole', keyStr)
    }
  }
}
</script>

<style scoped>

</style>
