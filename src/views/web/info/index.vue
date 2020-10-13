<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <el-form ref="search" label-width="80px" :model="search">
        <el-row>
          <el-col :span="6">
            <el-form-item label="标题" prop="title">
              <el-input v-model="search.title"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="6">
            <el-button @click="doSearch" type="primary">
              <i class="el-icon-search"></i>
              搜索
            </el-button>
            <el-button @click="$refs.search.resetFields()" type="info">
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
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column label="标题" prop="title"/>
        <el-table-column label="子标题" prop="titleSm"/>
        <el-table-column label="内容" prop="content" show-overflow-tooltip/>
        <el-table-column label="图片" prop="imgSrc" align="center">
          <template slot-scope="scope">
            <div>
              <el-image :src="scope.row.imgSrc" lazy/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="应用位置" prop="inMode" align="center">
          <template slot-scope="scope">
            <div v-html="dictFormat2(scope.row.inMode)"></div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="use" align="center">
          <template slot-scope="scope">
            <div v-html="dictFormat1(scope.row.use)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip
                         :formatter="(row) => new Date(row.createTime).toLocaleString()"/>
        <el-table-column prop="updateTime" label="修改时间" align="center" show-overflow-tooltip
                         :formatter="(row) => row.updateTime ? new Date(row.updateTime).toLocaleString() : '-'"/>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="edit(scope.row)">修改</el-button>
              <el-button type="text" @click="rm(scope.row.infoId)">删除</el-button>
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
    <el-dialog :close-on-click-modal="false" :visible.sync="showEdit" :title="title" v-loading="editLoading">
      <el-form ref="edit" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="子标题" prop="titleSm">
          <el-input v-model="form.titleSm"/>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            action="/bgData/file/upload"
            :limit="1"
            show-file-list
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="应用位置" prop="inMode">
          <el-select v-model="form.inMode">
            <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in dictDataList2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="use">
          <el-switch
            inactive-text="未使用"
            active-text="使用中"
            inactive-value="0"
            active-value="1"
            v-model="form.use"
          />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" resize="none" :autosize="{minRows: 4}" maxlength="1024" show-word-limit v-model="form.content"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" size="small">确定</el-button>
          <el-button @click="showEdit = false" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getGroupInfoList, removeGroupInfo, saveGroupInfo} from "../../../api/info";

const dictType1 = 'element_use_status';
const dictType2 = 'group_info_in_mode';
import {dictFormatter, getDictDataListByDictType} from "../../../api/dict";
import {ajaxCallback} from "../../../util/callbackUtil";
import {getFileInfoById} from "../../../api/file";

export default {
  name: "index",
  data() {
    return {
      title: undefined,
      search: {title: undefined},
      form: {},
      showEdit: false,
      dictDataList1: [],
      dictDataList2: [],
      rules: {
        content: [{required: true, message: '请认真填写内容', trigger: 'blur'}],
        title: [{required: true, message: '请认真填写标题', trigger: 'blur'}]
      },
      tableData: [],
      editLoading: false,
      listLoading: false,
      fileList: []
    }
  },
  created() {
    this.getTableData();
    this.getDictDataList();
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.form.fileId = response.data.fileId;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handlePageChange(val) {
      this.search.pageNum = val;
      this.getTableData();
    },
    getTableData() {
      this.listLoading = true;
      getGroupInfoList(this.search).then(res => {
        this.tableData = res.data.list;
        this.search.pageSize = res.data.pageSize;
        this.search.pageNum = res.data.pageNum;
        this.search.total = res.data.total;
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      })
    },
    dictFormat1(val) {
      return dictFormatter(this.dictDataList1, val);
    },
    dictFormat2(val) {
      return dictFormatter(this.dictDataList2, val);
    },
    getDictDataList() {
      getDictDataListByDictType(dictType1).then(res => {
        this.dictDataList1 = res.data;
      })
      getDictDataListByDictType(dictType2).then(res => {
        this.dictDataList2 = res.data;
      })
    },
    doSearch() {
      this.getTableData();
    },
    doReset() {
      this.form = {
        infoId: undefined,
        title: undefined,
        titleSm: undefined,
        inMode: undefined,
        content: undefined,
        fileId: undefined
      };
    },
    edit(row) {
      this.doReset();
      this.fileList.splice(0);
      this.form = row;
      getFileInfoById(row.fileId).then(res => {
        this.fileList.push({name: res.data.originalName});
      })
      this.showEdit = true;
      this.title = '修改集团简介';
    },
    add() {
      this.fileList.splice(0);
      this.doReset();
      this.title = '添加集团简介';
      this.showEdit = true;
    },
    rm(id) {
      removeGroupInfo(id, () => {
        this.getTableData();
      });
    },
    save() {
      this.$refs['edit'].validate(valid => {
        if (valid) {
          if (this.form.fileId) {
            this.editLoading = true;
            saveGroupInfo(this.form).then(res => {
              ajaxCallback(res, () => {
                this.editLoading = false;
                this.getTableData();
                this.showEdit = false;
              }, () => {
                this.editLoading = false;
              });
            }).catch(() => {
              this.editLoading = false;
            })
          } else {
            this.$message.warning("请上传图片");
            return false;
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
