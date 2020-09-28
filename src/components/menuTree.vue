<template>
  <div class="tree-wrapper">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>

    <el-tree
      @node-click="onClickNode"
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      node-key="menuId"
      ref="tree">
    </el-tree>
  </div>
</template>

<script>
import {getTreeMenu} from "../api/menu";

export default {
  name: "menuTree",
  props: {
    onClickNode: {
      type: Function,
      require: true
    }
  },
  data() {
    return {
      filterText: undefined,
      data: [{menuId: null, name: "顶级目录", child: []}],
      defaultProps: {
        children: "child",
        label: "name"
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getMenuTree();
  },
  methods: {
    getMenuTree() {
      getTreeMenu({status: "0"}).then(res => {
        this.data[0].child = res.data;
      })
    },
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.name.indexOf(value) !== -1;
    }
  }
}
</script>

