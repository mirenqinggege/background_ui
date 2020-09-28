<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <el-form ref="search" :model="search" label-width="80px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="字典名称">
              <el-input v-model="search.dictName"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-button type="primary" @click="doSearch">
              <i class="el-icon-search"></i>
              搜索
            </el-button>
            <el-button type="info" @click="doReset">
              <i class="el-icon-refresh"></i>
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list-wrapper">
      <div class="btn-wrapper">
        <el-button size="mini" @click="add">
          <i class="el-icon-plus"></i>
          新增
        </el-button>
        <el-table v-loading="isLoading" :data="dictTypeList" highlight-current-row>
          <el-table-column prop="dictName" label="字典名称"/>
          <el-table-column prop="dictType" label="字典类型">
            <template slot-scope="scope">
              <router-link :to="{path: '/dictData', query: {dictType: scope.row.dictType}}" v-html="scope.row.dictType"></router-link>
            </template>
          </el-table-column>
          <el-table-column prop="isDisabled" label="字典状态" align="center">
            <template slot-scope="scope">
              <div v-html="dictFormat(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="字典备注" show-overflow-tooltip/>
          <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip :formatter="(row)=> new Date(row.createTime).toLocaleString()"/>
          <el-table-column prop="updateTime" label="修改时间" align="center" show-overflow-tooltip :formatter="(row)=> row.updateTime ? new Date(row.updateTime).toLocaleString() : '-'"/>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="edit(scope.row)" size="mini">编辑</el-button>
                <el-button type="text" @click="rm(scope.row.dictId)" size="mini">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="page-wrapper"></div>
    <el-dialog :title="title" :visible.sync="showEdit">
      <el-form ref="edit" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称">
          <el-input v-model="form.dictName"/>
        </el-form-item>
        <el-form-item label="字典类型">
          <el-input v-model="form.dictType"/>
        </el-form-item>
        <el-form-item label="字典状态">
          <el-radio-group v-model="form.isDisabled">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字典备注">
          <el-input v-model="form.remark" type="textarea" maxlength="1024" show-word-limit :autosize="{minRows: 4}"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="save">确定</el-button>
          <el-button size="small" @click="showEdit = false;">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const dictType = 'system_status';
import {dictFormatter, dictTypeRemove, dictTypeSave, getDictDataList, getDictTypeList} from "../../../api/dict";
import {ajaxCallback} from "../../../util/callbackUtil";

export default {
  name: "index",
  data() {
    return {
      showEdit: false,
      search: {
        dictName: undefined
      },
      dictTypeList: [],
      form: {},
      rules: {},
      title: undefined,
      isLoading: false,
      dictDataList: []
    }
  },
  methods: {
    getDictDataList(dictType){
      getDictDataList(dictType).then(res => {
        this.dictDataList = res.data;
      })
    },
    doReset(){
      this.search = {};
      this.getDictTypeList();
    },
    doSearch(){
      this.getDictTypeList(this.search);
    },
    getDictTypeList(form) {
      this.isLoading = true;
      getDictTypeList(form).then(res => {
        this.dictTypeList = res.data;
        this.isLoading = false;
      });
    },
    edit(row){
      this.form = row;
      this.showEdit = true;
      this.title = "修改字典类型";
    },
    add() {
      this.form = {isDisabled: "0"};
      this.showEdit = true;
      this.title = "添加字典类型";
    },
    save() {
      this.$refs["edit"].validate(valid => {
        if (valid) {
          dictTypeSave(this.form).then(res => {
            ajaxCallback(res, () => {
              this.showEdit = false;
              this.form = {isDisabled: "0"};
              this.getDictTypeList();
            });
          })
        } else {
          return false;
        }
      });
    },
    rm(id){
      dictTypeRemove(id).then(res => {
        ajaxCallback(res, ()=>{
          this.getDictTypeList();
        })
      })
    },
    dictFormat(row){
      return dictFormatter(this.dictDataList, row.isDisabled);
    }
  },
  created() {
    this.getDictTypeList();
    this.getDictDataList(dictType);
  }
}
</script>

<style scoped>

</style>
