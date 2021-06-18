<template>
  <el-dialog title="添加用户" :visible="visible" @close="handleClose" >
      <!-- 内容主题区域 -->
  <el-form :model="value" :rules="addFormRules" ref="addFormRef" label-width="70px">
    <el-form-item  v-for="item in addFormLabel" :key="item.prop"  :label="item.name"  :prop="item.prop" :label-width="formLabelWidth">
    <el-input :value="value[item.prop]" @input="handleInput($event,item.prop)" />
<!--      :disabled="item.name==='用户名'?disabled:!disabled"-->
      <!-- <el-input  v-model="addForm.value"></el-input> -->
    </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleAdd">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    visible: Boolean,
    value: {
      type: Object,
      default: () => ({})
    },
    // addForm:Object,
    addFormRules: Object,
    addFormLabel: Array
  },
  data () {
    return {
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleAdd () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          this.$message({
            type: 'warning',
            message: '请重新填写'
          })
        } else {
          this.$emit('handleAdd')
        }
      })
    },
    handleInput (val, key) {
      const { value } = this
      const tempObj = {}
      tempObj[key] = val
      this.$emit('input', { ...value, ...tempObj })
    },
    handleClose () {
      this.$refs.addFormRef.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style>

</style>
