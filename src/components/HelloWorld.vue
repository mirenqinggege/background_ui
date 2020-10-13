<template>
  <el-container>
    <el-header></el-header>
    <el-container>
      <el-aside width="201px">
        <el-menu
          :default-active="activeItem"
          :router="true"
          :unique-opened="true"
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <menu-item v-for="item in menuItems" :key="item.menuId + ''" :menu-item="item"/>
        </el-menu>
      </el-aside>
      <el-main>
        <tab-bar/>
        <keep-alive :include="cachedViews">
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getTreeMenu} from "../api/menu";
import {mapGetters} from "vuex"
import MenuItem from "./menuItem";
import tabBar from "./tabBar";

export default {
  name: 'HelloWorld',
  components: {MenuItem, tabBar},
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      isCollapse: false,
      menuItems: []
    }
  },
  created() {
    this.initMenu();
  },
  computed: {
    ...mapGetters(["routes"]),
    activeItem() {
      return this.$route.path;
    },
    cachedViews(){
      return this.$store.getters.cachedViews;
    }
  },
  methods: {
    initMenu() {
      getTreeMenu({status: "0"}).then(res => {
        this.menuItems = res.data;
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.el-container {
  .el-header {
    background: #303133;
  }

  .el-container {
    .el-main {
      padding-left: 0;
      padding-right: 0;
      padding-top: 10px;
      height: calc(100vh - 60px);
      overflow: hidden;

      .wrapper + .wrapper {
        padding: 10px 10px;
        height: calc(100% - 23px);
        overflow-y: auto;
      }
    }

    .el-aside {

      .el-menu {
        display: inline-block;
        height: calc(100vh - 60px);

        .el-menu-item {
          text-align: left;
        }
      }

      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
      }
    }
  }
}
</style>
<style lang="less">
.el-submenu {
  .el-submenu__title {
    text-align: left;
  }
}

.el-container {
  .el-main {
    .wrapper + .wrapper {
      .page-wrapper {
        padding: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
