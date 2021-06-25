<template>
  <div>
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      :closable="tag.path!=='webmain'"
      :disable-transitions="false"
      @close="handleClose(tag)"
      @click="changeTags(tag)"
      size="small"
      :effect="$route.path==='/'+tag.path?'dark':'plain'"
    >
      {{tag.authName}}
    </el-tag>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'commonTags',
  computed: {
    ...mapState({
      tags: state => state.tags
    })
  },
  methods: {
    handleClose (tag) {
      console.log(tag.authName)
      this.$store.commit('delTag', tag)
    },
    changeTags (tag) {
      console.log('1', tag)
      console.log('2', this.$route.path)
      const path = '/' + tag.path
      this.$router.push({ path: path })
      this.$store.commit('addTags', tag)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag--small {
  margin-right: 20px;
}

</style>
