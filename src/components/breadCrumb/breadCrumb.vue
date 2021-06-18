<template>
<div>
  <el-breadcrumb separator="/">
  <el-breadcrumb-item v-for="(item,index) in crumbList" :key="index" :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
</el-breadcrumb>
</div>
</template>

<script>
export default {
 props:['crumbList']
}
</script>

<style>

</style>