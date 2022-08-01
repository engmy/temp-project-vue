<template>
  <div class="app-container">
    <div class="app-body">

      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="托盘号：">
              <el-input size="small" v-model="search.pallet_code" placeholder="请输入托盘号"></el-input>
            </el-form-item>
            <el-form-item label="工单号：">
              <el-input size="small" v-model="search.doc_no" placeholder="请输入工单号"></el-input>
            </el-form-item>
            <el-form-item label="产品编码：">
              <el-input size="small" v-model="search.sku_no" placeholder="请输入产品编码"></el-input>
            </el-form-item>
            <el-form-item label="产品批号：">
              <el-input size="small" v-model="search.lot_no" placeholder="请输入产品批号"></el-input>
            </el-form-item>
            <el-form-item label="灌装单号：">
              <el-input size="small" v-model="search.filling_no" placeholder="请输入灌装单号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="queryPalletList" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:pallet:data'">刷新</el-button>
          <el-button type="success" size="small" @click="detialexportExcel" icon="el-icon-download">导出明细</el-button>
        </div>
      </div>

      <el-table :data="palletList" border fit max-height="700" current-row-key="id" ref="theTable">
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="pallet_code" label="托盘号" width="180" align="center" />
        <el-table-column prop="doc_no" label="工单号" width="180" align="center" />
        <el-table-column prop="filling_no" label="灌装单号" width="120" align="center" />
        <el-table-column prop="sku_no" label="产品编码" width="160" align="center" />
        <el-table-column prop="customer_sku_no" label="客户产品编码" width="160" align="center" />
        <el-table-column prop="bar_code" label="商品码" width="160" align="center" />
        <el-table-column prop="sku_desc" label="产品名称" width="530" />
        <el-table-column prop="lot_no" label="产品批号" width="120" align="center" />
        <el-table-column prop="mfg_date" label="生产日期" width="180" align="center" />
        <el-table-column prop="pline_no" label="产线代码" width="180" align="center" />
        <el-table-column prop="team_no" label="班组代码" width="180" align="center" />
        <el-table-column prop="upload_flag" label="上传状态" width="120" align="center">
          <template #default="scope">
            {{statusOptions[scope.row.upload_flag]}}
          </template>
        </el-table-column>
        <el-table-column prop="upload_time" label="上传时间" width="180" align="center" />
        <el-table-column prop="sequence_id" label="批次流水号" width="180" align="center" />
        <el-table-column prop="create_time" label="创建时间" width="180" align="center" />
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleDetial(scope.row)" icon="el-icon-document" v-permission="'admin:pallet:detail'">托盘明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryPalletList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog title="托盘明细" v-model="dialogFormVisible" :close-on-click-modal="false" width="900px">
      <el-table :data="cartonList" border fit max-height="780" current-row-key="id" ref="theTable">
        <el-table-column align="center" type="index" width="55" label="序号" />
        <el-table-column prop="carton_code" label="外箱码" width="150" align="center" />
        <el-table-column prop="doc_no" label="工单号" width="180" align="center" />
        <el-table-column prop="upload_flag" label="上传状态" width="120" align="center">
          <template #default="scope">{{statusOptions[scope.row.upload_flag]}}</template>
        </el-table-column>
        <el-table-column prop="upload_time" label="上传时间" width="180" align="center" />
        <el-table-column prop="sku_no" label="产品编码" width="120" align="center" />
        <el-table-column prop="sku_desc" label="产品名称" width="250" align="center" />
        <el-table-column prop="mfg_date" label="生产日期" width="180" align="center" />
        <el-table-column prop="lot_no" label="产品批号" width="120" align="center" />
        <el-table-column prop="pallet_code" label="托盘号" width="180" align="center" />
        <el-table-column prop="pline_no" label="产线代码" width="180" align="center" />
        <el-table-column prop="filling_no" label="灌装单号" width="120" align="center" />
        <el-table-column prop="team_no" label="班组代码" width="180" align="center" />
        <el-table-column prop="sequence_id" label="批次流水号" width="180" align="center" />
        <el-table-column prop="create_time" label="创建时间" width="180" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import pallet from "./pallet";
import pagination from "@/components/pagination/index.vue";
export default {
  components: { pagination },
  setup() {
    const state = pallet();
    state.queryPalletList();
    return {
      ...(state),
    };
  }
};
</script>