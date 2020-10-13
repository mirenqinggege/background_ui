<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <el-form ref="search" label-width="80px" :model="search">
        <el-row>
          <el-col :span="6">
            <el-form-item label="广告标题">
              <el-input v-model="search.title"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="6">
            <el-button @click="doSearch" type="primary">
              <i class="el-icon-search"></i>
              搜索
            </el-button>
            <el-button @click="doReset('search')" type="info">
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
      <el-table :data="tableData">
        <el-table-column prop="title" label="广告标题"/>
        <el-table-column prop="titleSm" label="子标题"/>
        <el-table-column prop="bannerSrc" label="图片" align="center">
          <template slot-scope="scope">
            <div>
              <img height="31px" :src="scope.row.bannerSrc">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="use" label="是否使用" align="center">
          <template slot-scope="scope">
            <div v-html="dictFormat(scope.row.use)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"
                         :formatter="(row) => new Date(row.createTime).toLocaleString()"/>
        <el-table-column prop="updateTime" label="修改时间" align="center"
                         :formatter="(row) => row.updateTime ? new Date(row.updateTime).toLocaleString() : '-'"/>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="edit(scope.row)">修改</el-button>
              <el-button type="text" @click="showImg(scope.row.bannerSrc)">查看</el-button>
              <el-button type="text" @click="rm(scope.row.bannerId)">删除</el-button>
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
    <el-dialog :close-on-click-modal="false" :visible.sync="showEdit" :title="title" v-loading="loading">
      <el-form ref="edit" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="子标题" prop="titleSm">
          <el-input v-model="form.titleSm"/>
        </el-form-item>
        <el-form-item label="广告状态" prop="use">
          <el-switch v-model="form.use" active-text="使用中" inactive-text="未使用" active-value="1" inactive-value="0"/>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="/bgData/file/upload"
            :limit="1"
            :on-success="onUploadSuccess"
            :on-progress="progress"
            class="upload-demo"
            :file-list="fileList"
            :show-file-list="true"
            :on-remove="handleRemove">
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
    <el-dialog :visible.sync="showView" title="图片查看">
      <img style="width: 100%" :src="viewImg">
    </el-dialog>
  </div>
</template>
<script>
import {delBanner, getBannerList, saveBanner} from "../../../api/banner";
import {dictFormatter, getDictDataListByDictType} from "../../../api/dict";
import {ajaxCallback} from "../../../util/callbackUtil";
import {fileUpload, getFileInfoById} from "../../../api/file";

const dictType = 'banner_status';

export default {
  name: "index",
  data() {
    return {
      title: undefined,
      search: {},
      form: {},
      showEdit: false,
      showView: false,
      viewImg: undefined,
      dictDataList: [],
      fileList: [],
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        titleSm: [
          {required: true, message: '请输入子标题', trigger: 'blur'}
        ]
      },
      tableData: [],
      loading: false
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
    showImg(src){
      this.showView = true;
      this.viewImg = src;
    },
    onUploadSuccess(response, file, fileList){
      this.form.fileId = response.data.fileId;
      this.fileList = fileList;
    },
    progress() {
    },
    fileUpload(request) {
      fileUpload(request.file).then(res => {
        ajaxCallback(res, () => {
          this.form.fileId = res.data.fileId;
        })
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    getTableData() {
      this.listLoading = true;
      getBannerList(this.search).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.search.pageNum = res.data.pageNum;
        this.search.pageSize = res.data.pageSize;
        this.search.total = res.data.total;
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
        fileId: undefined,
        bannerId: undefined
      }
    },
    edit(row) {
      this.doReset();
      this.form = row;
      this.showEdit = true;
      getFileInfoById(row.fileId).then(res => {
        this.fileList.length = 0;
        this.fileList.push(res.data);
      });
      this.title = '修改广告';
    },
    add() {
      this.doReset();
      this.fileList.splice(0);
      this.title = '添加广告';
      this.showEdit = true;
    },
    rm(id) {
      delBanner(id, () => {
        this.getTableData();
      });
    },
    save() {
      this.$refs['edit'].validate(valid => {
        if (valid) {
          if(!this.form.fileId){
            ajaxCallback({code: '-1', message: '请选择图片文件'});
            return false;
          }
          this.loading = true;
          //do submit
          saveBanner(this.form).then(res => {
            ajaxCallback(res, () => {
              this.loading = false;
              this.getTableData();
              this.showEdit = false;
            });
          }, reject => {
            this.loading = false;
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
