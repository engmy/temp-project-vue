<template>
  <div class="app-container">
    <div class="app-body">

      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="产品批号：">
              <el-input v-model="search.lot_no" placeholder="请输入产品批号" @keyup.enter="handleSearch" size="small" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="queryProductReportList" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus">上传质检报告</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="brand_no" label="名牌名称" width="300" />
        <el-table-column prop="lot_no" label="产品批号" width="300" align="center" />
        <el-table-column prop="create_time" label="上传时间" width="300" align="center" />
        <el-table-column prop="create_user" label="上传人" width="300" align="center" />
        <el-table-column fixed="right" label="操作" align="center" width="240">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleDetial(scope.row)" icon="el-icon-document">查看报告</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="custom-table-pagination">
        <pagination @handleQuery="queryProductReportList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog title="上传质检报告" v-model="createFormDialog" :close-on-click-modal="false" width="650px" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">

        <el-form-item label="选择工厂" prop="site_no">
          <el-select v-model="form.site_no" placeholder="请选择工厂" @change="changeSite" style="width: 100%">
            <el-option v-for="item in siteList" :key="item.site_no" :label="item.site_name" :value="item.site_no"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择品牌" prop="brand_no">
          <el-select v-model="form.brand_no" placeholder="请选择品牌" style="width: 100%">
            <el-option v-for="item in brandList" :key="item.brand_no" :label="item.brand_name" :value="item.brand_no"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品批号" prop="lot_no">
          <el-input v-model="form.lot_no" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="上传报告" prop="file_path">
          <el-upload class="avatar-uploader" :with-credentials="true" :headers="headers" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <el-button size="small" type="primary">上传质检报告</el-button>
            <el-link :underline="false" type="primary" v-if="upload_sattus" disabled>{{upload_sattus}}</el-link>
          </el-upload>

        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose" icon="el-icon-refresh-left" size="small">取消</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click="createData()">提 交</el-button>
      </template>
    </el-dialog>

    <el-dialog title="查看质检报告" v-model="detailFormDialog" :close-on-click-modal="false" width="1000px" :lock-scroll="false">
      <div class="pdf">
        <iframe id="template-iframe" ref="iframe" :src="pdf_url" width="100%" height="1000px"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import report from "./report";
import pagination from "@/components/pagination/index.vue";
export default
  {
    components: { pagination },
    setup() {
      const state = report();
      state.queryProductReportList();
      return {
        ...(state),
      };
    }
  };
</script>