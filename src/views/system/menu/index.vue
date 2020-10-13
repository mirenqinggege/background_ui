<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <el-form label-width="80px" ref="search" :model="search">
        <el-row>
          <el-col :span="6">
            <el-form-item label="菜单名称">
              <el-input v-model="search.name" style="width: 150px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="0px">
              <el-button type="primary" round @click="doSearch">
                <i class="el-icon-search"></i>
                搜索
              </el-button>
              <el-button type="info" round @click="doReset(search)">
                <i class="el-icon-refresh-left"></i>
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list-wrapper">
      <div class="button-wrapper">
        <el-button size="mini" @click="add">
          <i class="el-icon-plus"></i>
          新增
        </el-button>
      </div>
      <el-table row-key="menuId" :data="menus" :tree-props="defaultProps">
        <el-table-column prop="name" label="菜单名称"/>
        <el-table-column prop="orderNum" label="排序"/>
        <el-table-column prop="path" label="路由地址"/>
        <el-table-column prop="component" label="组件地址"/>
        <el-table-column prop="type" label="菜单类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 'B'">按钮</span>
            <span v-else>菜单</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="菜单图标" align="center">
          <template slot-scope="scope">
            <i :class="scope.row.icon" v-if="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="菜单状态" align="center">
          <template slot-scope="scope">
            <div v-html="dictFormat(scope.row.status)"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope" v-if="scope.row.menuId">
            <el-button type="text" @click="edit(scope.row.menuId)">编辑</el-button>
            <el-button type="text" @click="rm(scope.row.menuId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrapper"></div>
    <el-dialog :visible.sync="showEdit">
      <div class="form-wrapper">
        <el-form ref="mainForm" :model="form" label-width="80px" :rules="rules">
          <el-row>
            <el-col :span="10">
              <el-form-item label="上级菜单">
                <el-popover v-model="showSelectMenuTree">
                  <menu-tree :on-click-node="selectParent"/>
                  <el-input slot="reference" v-model="form.parentName" :disabled="true"></el-input>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="form.type">
                  <el-radio label="M">菜单</el-radio>
                  <el-radio label="B">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="排序" prop="orderNum">
                <el-input-number v-model="form.orderNum" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="路由地址" prop="path">
                <el-input v-model="form.path"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" v-if="form.type === 'B'">&nbsp;</el-col>
            <el-col :span="10" v-if="form.type === 'B'">
              <el-form-item label="组件地址" prop="component">
                <el-input v-model="form.component"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="菜单图标" prop="icon">
                <el-popover v-model="showIconSelect" placement="bottom" trigger="click" width="300px">
                  <icon-select :select="selectIcon"/>
                  <el-input v-model="form.name" slot="reference" :disabled="true">
                    <template slot="prepend">
                      <i :class="form.icon" v-show="form.icon"></i>
                    </template>
                  </el-input>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="目标窗口" prop="target">
                <el-select v-model="form.target">
                  <el-option value="_self" label="内部窗口"></el-option>
                  <el-option value="_blank" label="外部链接"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="菜单状态">
                <el-radio-group v-model="form.status">
                  <el-radio label="0">正常</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="save">确定</el-button>
            <el-button type="info" @click="showEdit = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const dictType = 'system_status';
import {getMenuInfo, getTreeMenu, remove, save, searchMenus} from "../../../api/menu";
import IconSelect from "../../../components/iconSelect/IconSelect";
import MenuTree from "../../../components/menuTree";
import {ajaxCallback} from "../../../util/callbackUtil";
import {dictFormatter, getDictDataListByDictType} from "../../../api/dict";

export default {
  name: "index",
  components: {MenuTree, IconSelect},
  data() {
    return {
      defaultProps: {
        children: "child",
      },
      form: {},
      rules: {
        name: [
          {required: true, message: "请输入菜单名称", trigger: "blur"}
        ],
        path: [
          {required: true, message: "请输入路由地址", trigger: "blur"}
        ],
        component: [
          {required: true, message: "请输入组件地址", trigger: "blur"}
        ]
      },
      search: {},
      menus: [],
      showEdit: false,
      showIconSelect: false,
      showSelectMenuTree: false,
      delConfirm: false,
      dictDataList: []
    }
  },
  created() {
    this.getTreeMenu();
    this.getDictDataList();
  },
  methods: {
    getDictDataList(){
      getDictDataListByDictType(dictType).then(res => {
        this.dictDataList = res.data;
      })
    },
    dictFormat(status){
      return dictFormatter(this.dictDataList, status);
    },
    log(obj){
      console.log(obj);
    },
    getTreeMenu(){
      getTreeMenu().then(res =>{
        this.menus = res.data;
      });
    },
    getChildMenus(tree, treeNode, resolve) {
      searchMenus({"parentId": tree.menuId || -1}).then(res => {
        resolve(res.data);
      })
    },
    add() {
      this.form = {type: "M", orderNum: 1, parentName: "顶级目录", status: "0", target: "_self"};
      this.showEdit = true;
    },
    edit(id) {
      getMenuInfo(id).then(res => {
        this.form = res.data;
        this.showEdit = true;
        if (res.data.parentId === null) {
          this.form.parentName = "顶级目录";
        }
      });
    },
    save() {
      this.$refs['mainForm'].validate(valid => {
        console.log(valid);
        if (!valid) {
          return false;
        }
        save(this.form).then(res => {
          ajaxCallback(res, () => {
            this.showEdit = false;
            this.getTreeMenu();
          });
        });
      });
    },
    rm(id) {
      remove(id, () => {
        this.getTreeMenu();
      })
    },
    selectIcon(icon) {
      this.form.icon = icon;
      console.log(icon);
      this.showIconSelect = false;
    },
    selectParent(data) {
      if (data.type === 'B') {
        this.$message.error("上级目录必须是菜单类型");
      } else {
        this.form.parentId = data.menuId;
        this.form.parentName = data.name;
        this.showSelectMenuTree = false;
      }
    },
    doSearch(){
      searchMenus(this.search).then(res => {
        this.menus = res.data;
      });
    },
    doReset(form){
      form = {};
    }
  },
  mounted() {
  },
  computed: {}
}
</script>

<style lang="less">
.is-disabled{
  .el-input__inner{
    cursor: pointer !important;
  }
}

div:focus {
  outline: none;
}
</style>
