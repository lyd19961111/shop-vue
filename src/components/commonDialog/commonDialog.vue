<template>
  <el-dialog title="添加用户" :visible="visible" @close="handleClose" >
    <slot></slot>
      <!-- 内容主题区域 -->
  <el-form :model="value" :rules="FormRules" ref="FormRef" label-width="70px">
    <el-form-item  v-for="item in FormLabel" :key="item.prop"  :label="item.name"  :prop="item.prop" :label-width="formLabelWidth">
    <el-input :value="value[item.prop]" @input="handleInput($event,item.prop)" />
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
    FormRules: Object,
    FormLabel: Array
  },
  data () {
    return {
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleAdd () {
      this.$refs.FormRef.validate(valid => {
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
    // val代表input中输入的值
    handleInput (val, key) {
      const { value } = this
      // 等同于 const value = this.value
      const tempObj = {}
      tempObj[key] = val
      // 合并
      this.$emit('input', { ...value, ...tempObj })
    },
    handleClose () {
      this.$refs.FormRef.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style>

</style>
