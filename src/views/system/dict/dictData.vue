<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <el-form ref="search" label-width="80px" :model="search">
        <el-row>
          <el-col :span="5">
            <el-form-item label="字典值">
              <el-input disabled v-model="search.value"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="5">
            <el-button type="primary" @click="doSearch" disabled>
              <i class="el-icon-search"></i>
              搜索
            </el-button>
            <el-button type="info" @click="doReset('search')">
              <i class="el-icon-refresh"></i>
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="list-wrapper">
      <div class="btn-wrapper">
        <el-button @click="add" size="mini">
          <i class="el-icon-plus"></i>
          新增
        </el-button>
      </div>
      <el-table :data="dictDataList" v-loading="isLoading">
        <el-table-column prop="label" label="标签" align="center">
          <template slot-scope="scope">
            <div v-html="scope.row.label"></div>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="值"/>
        <el-table-column prop="createTime" label="创建时间" align="center"
                         :formatter="(value) => value.createTime ? new Date(value.createTime).toLocaleString():'-'"/>
        <el-table-column prop="updateTime" label="修改时间" align="center"
                         :formatter="(value) => value.updateTime ? new Date(value.updateTime).toLocaleString():'-'"/>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="mini" @click="edit(scope.row)">修改</el-button>
              <el-button type="text" size="mini" @click="rm(scope.row.dataId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrapper">
      <el-pagination
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        :total="search.total"
        :page-size="search.pageSize">
      </el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="showEdit">
      <el-form :model="form" ref="edit" label-width="80px" :rules="rules">
        <el-form-item label="字典类型">
          <el-input v-model="form.dictType" disabled/>
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-input v-model="form.label"/>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="form.value"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark" maxlength="1024" show-word-limit :autosize="{minRows: 4}"/>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="save">确定</el-button>
          <el-button size="small" @click="showEdit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {dictDataRemove, dictDataSave, getDictDataList} from "../../../api/dict";
import {ajaxCallback} from "../../../util/callbackUtil";

export default {
  name: "dictData",
  data() {
    return {
      title: undefined,
      showEdit: false,
      search: {},
      form: {},
      dictDataList: [],
      isLoading: false,
      rules: {
        label: [
          {required: true, message: "请填写标签", trigger: "blur"}
        ],
        value: [
          {required: true, message: "请填写值", trigger: "blur"}
        ],
        dictType: [
          {required: true, message: "请填写字典类型", trigger: "blur"}
        ]
      }
    }
  },
  created() {
    this.search.dictType = this.$route.query.dictType;
    this.form.dictType = this.$route.query.dictType;
    this.getDictDataList();
  },
  methods: {
    handlePageChange(val) {
      this.search.pageNum = val;
      this.getDictDataList();
    },
    doSearch() {
      this.getDictDataList();
    },
    doReset(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    getDictDataList() {
      this.search.dictType = this.$route.query.dictType;
      getDictDataList(this.search).then(res => {
        this.dictDataList = res.data.list;
        this.search.pageSize = res.data.pageSize;
        this.search.pageNum = res.data.pageNum;
        this.search.total = res.data.total;
      })
    },
    add() {
      this.doReset("edit");
      this.title = "新增字典数据";
      this.showEdit = true;
    },
    edit(row) {
      this.form = row;
      this.title = "修改字典数据";
      this.showEdit = true;
    },
    save() {
      this.$refs["edit"].validate(valid => {
        if (valid) {
          dictDataSave(this.form).then(res => {
            ajaxCallback(res, () => {
              this.showEdit = false;
              this.getDictDataList();
            });
          })
        } else {
          return false;
        }
      });
    },
    rm(id) {
      dictDataRemove(id).then(res => {
        ajaxCallback(res, () => {
          this.getDictDataList();
        })
      });
    }
  }
}
</script>

<style scoped>

</style>
