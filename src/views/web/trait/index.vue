<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <el-form ref="search" label-width="80px" :model="search">
        <el-row>
          <el-col :span="5">
            <el-form-item label="标题">
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
        <el-table-column prop="title" label="标题"/>
        <el-table-column prop="titleSm" label="子标题"/>
        <el-table-column prop="bannerSrc" label="图片" align="center">
          <template slot-scope="scope">
            <div>
              <img height="31px" :src="scope.row.imgSrc">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip align="center"/>
        <el-table-column prop="use" label="是否使用" align="center">
          <template slot-scope="scope">
            <div v-html="dictFormat(scope.row.use)"></div>
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
              <el-button type="text" @click="rm(scope.row.traitId)">删除</el-button>
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
        <el-form-item label="内容" prop="content">
          <el-input show-word-limit type="textarea" :autosize="{maxRows: 3, minRows: 3}" maxlength="40"
                    v-model="form.content"/>
        </el-form-item>
        <el-form-item label="状态" prop="use">
          <el-switch v-model="form.use" active-value="1" inactive-value="0" inactive-text="未使用" active-text="使用中"/>
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
        <el-form-item>
          <el-button type="primary" @click="save" size="small">确定</el-button>
          <el-button @click="showEdit = false" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getTraitList, removeTrait, saveTrait} from "../../../api/trait";

const dictType = 'element_use_status';
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
      dictDataList: [],
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        titleSm: [
          {required: true, message: '请输入子标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
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
    handlePageChange(val) {
      this.search.pageNum = val;
      this.getTableData();
    },
    handleSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.form.fileId = response.data.fileId;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    getTableData() {
      this.listLoading = true;
      getTraitList(this.search).then(res => {
        this.tableData = res.data.list;
        this.search.pageSize = res.data.pageSize;
        this.search.pageNum = res.data.pageNum;
        this.search.total = res.data.total;
        this.listLoading = false;
      }).catch(reason => {
        this.listLoading = false;
      })
    },
    dictFormat(val) {
      return dictFormatter(this.dictDataList, val);
    },
    getDictDataList() {
      getDictDataListByDictType(dictType).then(res => {
        this.dictDataList = res.data;
      })
    },
    doSearch() {
      this.getTableData();
    },
    doReset() {
      this.form = {
        title: undefined,
        titleSm: undefined,
        content: undefined,
        fileId: undefined,
        traitId: undefined
      }
    },
    edit(row) {
      this.doReset();
      this.form = row;
      this.fileList.splice(0);
      getFileInfoById(row.fileId).then(res => {
        this.fileList.push({name: res.data.originalName});
      })
      this.showEdit = true;
      this.title = '修改特点信息';
    },
    add() {
      this.doReset();
      this.title = '添加特点信息';
      this.fileList.splice(0);
      this.showEdit = true;
    },
    rm(id) {
      removeTrait(id, () => {
        this.getTableData();
      })
    },
    save() {
      this.$refs['edit'].validate(valid => {
        if (valid) {
          if (!this.form.fileId) {
            this.$message.warning("还未选择图片文件");
            return false;
          }
          this.editLoading = true;
          saveTrait(this.form).then(res => {
            ajaxCallback(res, () => {
              this.getTableData();
              this.showEdit = false;
            })
            this.editLoading = false;
          }).catch(() => {
            this.editLoading = false;
          })
        }
      });
    }
  }
}
</script>
