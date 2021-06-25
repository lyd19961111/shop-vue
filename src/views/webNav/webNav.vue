<template>
 <!-- :default-active="$route.path" -->
  <el-menu
    :width="$store.state.isCollapse? '64px':'200px'"
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409EFF"
    unique-opened
    :collapse="$store.state.isCollapse"
    :collapse-transition="false"
    router
    :default-active="activePath"
  >
    <!-- 一级菜单 -->
    <el-submenu :index="item.id+' '" v-for="item in menuList" :key="item.id">
      <!-- 一级菜单模版区域 -->
      <template slot="title">
        <!-- 图标 -->
        <i :class="iconFontList[item.id]"></i>
        <!-- 文本 -->
        <span>{{item.authName}}</span>
      </template>
      <!-- 二级菜单 -->
      <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem)">
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import getMenuApi from '@/api/menu.js'
export default {
  data () {
    return {
      // 菜单列表
      menuList: [],
      iconFontList: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-dingdanguanli',
        145: 'iconfont icon-shujutongji'
      },
      // 二级菜单高亮效果
      activePath: '',
      secondMenu: []// 二级菜单
    }
  },
  created () {
    this.geMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 获取菜单列表
    geMenuList () {
      getMenuApi.getMenu().then((response) => {
        const resp = response.data
        console.log(resp)
        if (resp.meta.status !== 200) {
          this.$message.error('获取列表失败')
        } else {
          this.menuList = resp.data
        }
      })
    },
    // 保存连接的激活状态
    // activePath='/'+subItem.path
    saveNavState (subItem) {
      const activePath = '/' + subItem.path
      console.log('active', activePath)
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      this.$store.commit('addTags', subItem)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu{
    border-right: 0;
}
.iconfont{
    margin-right: 10px;
}
</style>
