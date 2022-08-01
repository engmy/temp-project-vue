<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="工单号：">
              <el-input size="small" v-model="search.doc_no" placeholder="请输入工单号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button type="success"  size="small"  @click="detialexportExcel" icon="el-icon-download">导出明细</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="doc_no" label="工单号" width="450" />
        <el-table-column prop="site_no" label="工厂代码" width="120" align="center" />
        <el-table-column prop="brand_no" label="品牌代码" width="120" align="center" />
        <el-table-column prop="sku_no" label="产品编码" width="150" align="center" />
        <el-table-column prop="pline_no" label="产线代码" width="120" align="center" />
        <el-table-column prop="lot_no" label="生产批次" width="120" align="center" />
        <el-table-column prop="mfg_time" label="生产时间" width="180" align="center" />
        <el-table-column prop="httptxt" label="上传状态" width="120" align="center" />
        <el-table-column prop="update_user" label="更新人" width="150" align="center" />
        <el-table-column prop="update_time" label="更新时间" width="160"  align="center" />
      </el-table>

      <div class="custom-table-pagination">
        <pagination @handleQuery="queryList" :pagination="pagination" />
      </div>
    </div>
  </div>
</template>

<script>
import product from "./product";
import pagination from "@/components/pagination/index.vue";

export default {
  components: { pagination },
  setup() {
    const state = product();
    state.queryList();
    return {
      ...(state),
    };
  },
};
</script>