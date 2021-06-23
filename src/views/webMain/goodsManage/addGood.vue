<template>
<div>
  <el-card>
<!--    警告-->
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon>
    </el-alert>
<!--    步骤条-->
    <el-steps :space="200" :active="Number(activeIndex)" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
<!--    tag标签-->
    <el-form :model="addForm"   ref="addForm" label-width="100px"  label-position="top">
    <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabs" @tab-click="tabClick">
      <el-tab-pane label="基本信息" name=0>
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="addForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品种类" prop="goods_cat">
          <el-cascader
            expandtrigger="hover"
            v-model="addForm.goods_cat"
            :options="goodlist"
            :props="goodProps"
            @change="handleChange"></el-cascader>
        </el-form-item>

      </el-tab-pane>
      <el-tab-pane label="商品参数" name=1>
        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name=2>
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
          <el-input v-model="item.attr_sel"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name=3>
<!--        上传图片-->
<!--        action表示图片要上传到的后台Api地址-->
        <el-upload
          :action="uploadurl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
          :headers="headObj"
        :on-success="handleSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name=4>
<!--        富文本编辑器组件-->
        <quill-editor v-model="addForm.goods_inrtoduce"></quill-editor>
<!--        添加商品按钮-->
        <el-button type="primary" @click="add">完成</el-button>
      </el-tab-pane>
    </el-tabs>
    </el-form>
  </el-card>

    <common-dialog :visible.sync="preVisablel">
      <img :src="preview" alt="" />
    </common-dialog>
</div>
</template>

<script>
import addApi from '@/api/addGood.js'
import CommonDialog from '../../../components/commonDialog/commonDialog'
import _ from 'lodash'
export default {
  name: 'addGood.vue',
  components: { CommonDialog },
  data () {
    return {
      activeIndex: 0,
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品的详情描述
        goods_inrtoduce: '',
        attrs: []

      },
      addRules: {},
      // 商品分类列表
      goodlist: [],
      goodProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      thirdId: null,
      // 动态参数
      manyTableData: [],
      // 静态参数
      onlyTableData: [],
      uploadurl: 'http://timemeetyou.com:8889/api/private/v1/upload',
      headObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览
      preview: '',
      // 图片预览弹出框
      preVisablel: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      addApi.getSortList().then(response => {
        const resp = response.data
        if (resp.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '失败'
          })
        } else {
          this.goodlist = resp.data
        }
      })
    },
    // 级联选择器选中相变化
    handleChange () {
      console.log('ok')
    },
    beforeTabs (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    tabClick () {
      this.thirdId = this.addForm.goods_cat[2]
      // 访问动态参数
      if (this.activeIndex === '1') {
        addApi.allowMany(this.thirdId).then(response => {
          const resp = response.data
          console.log('resp', resp)
          resp.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTableData = resp.data
        })
      } else if (this.activeIndex === '2') {
        // 静态属性
        addApi.allowOnly(this.thirdId).then(response => {
          const resp = response.data
          console.log('resp', resp)
          resp.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          console.log('1212', resp)
          this.onlyTableData = resp.data
        })
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.preview = file.response.data.url
      this.preVisablel = !this.preVisablel
    },
    // 移除图片
    handleRemove (file) {
      // 1.获取图片的临时路径 2。从pics数组中找到索引值 3。移除
      const filePath = file.response.data.temp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 成功上传图片操作
    handleSuccess (response) {
      // 1.拼接图片信息对象
      const picInfo = response.data.tmp_path
      // 2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 完成操作
    add () {
      // 执行添加的业务逻辑
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      console.log('form', form)
      // 处理动态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      // 处理静态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })
      form.attrs = this.addForm.attrs
      // 增加商品
      addApi.addaaa(form).then(response => {
        const resp = response.data
        console.log('添加商品成功', resp)
        if (resp.meta.status !== 201) {
          this.$message.error('创建商品失败')
        } else {
          this.$router.push({ path: '/goods' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-steps{
  margin:15px 0;
}
.ql-editor{
  min-height: 300px;
}
</style>
