<template>
  <div class="wrapper">
    <el-tag v-for="(item,index) in routes" :type="tabClass(item)"
            :key="item.name"
            :closable="index !== 0"
            @close="handleClose(item)"
    ><router-link :to="item" v-html="item.name" tag="span"></router-link></el-tag>
  </div>
</template>

<script>
export default {
  name: "tabBar",
  data() {
    return {
      routes: []
    }
  },
  created() {
    this.routes = this.$store.getters.routesHistory;
  },
  watch: {
    $route(){
      this.addTags();
    }
  },
  methods: {
    addTags(){
      const {name} = this.$route;
      if (name) {
        this.$store.dispatch('cacheViews/addView', this.$route);
      }
    },
    handleClose(item) {
      this.$store.dispatch("delHistory", item).then(resolve => {
        if (this.$route.name === item.name) {
          this.$router.push(this.routes[this.routes.length - 1]);
        }
      });
      this.$store.dispatch('cacheViews/delView', item).then(resolve => {

      })
    },
    handleClick(item) {
      if (this.$route.name !== item.name) {
        this.$router.push(item);
      }
    },
    tabClass(item) {
      let name2 = item.name;
      let name1 = this.$route.name;
      return name2 === name1 ? "" : "info";
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
div.wrapper {
  padding: 0 10px 10px 10px;
  border-bottom: 1px solid #DCDFE6;

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .el-tag {
    cursor: pointer;
  }
}
</style>
