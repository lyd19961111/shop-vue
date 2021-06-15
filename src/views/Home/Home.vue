<template>
  <div>
      <el-button @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
    methods:{
        logout(){
            window.sessionStorage.clear();//清除token
            this.$router.push('./login');//回到登陆界面
        }
    }

}
</script>

<style lang="scss" scoped>

</style>