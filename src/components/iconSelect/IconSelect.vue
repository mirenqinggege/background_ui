<template>
  <div class="icon-wrapper" :style="calcStyle">
    <div v-for="item in icons" @click="select(item.className)">
      <span>
        <i :class="item.className"></i>
      </span>
    </div>
  </div>
</template>

<script>

import {getIcons} from "../../api/icon";

export default {
  name: "IconSelect",
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 300
    },
    select: {
      type: Function,
      require: true
    }
  },
  data() {
    return {
      icons: []
    }
  },
  created() {
    this.getIcons();
  },
  methods: {
    getIcons() {
      getIcons().then(res => {
        this.icons = res.data;
      })
    }
  },
  computed: {
    calcStyle() {
      const style = {};
      style.width = this.width + "px";
      style.height = this.height + "px";
      return style;
    }
  }
}
</script>
<style lang="less" scoped>
.icon-wrapper {
  overflow-x: hidden;
  overflow-y: scroll;
  border: 1px solid transparent;
  border-left-color: black;
  border-top-color: black;

  div {
    margin: -1px 0 0 -1px;
    display: inline-block;
    width: 3em;
    height: 3em;
    line-height: 3.5em;
    text-align: center;
    border-radius: 2px;
    border: 1px solid transparent;
    border-bottom-color: black;
    border-right-color: black;

    span {
      display: inline-block;
      i {
        font-size: 1.5em;
      }
    }
  }

  div:hover {
    color: #5cb6ff;
    cursor: pointer;
  }

  div:after {
    content: "";
    height: 100%;
    vertical-align: middle;
    display: inline-block;
  }
}
</style>
