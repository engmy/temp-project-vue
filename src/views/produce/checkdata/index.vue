<template>
  <div class="app-container">
    <div class="app-body">

      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="工厂代码：">
              <el-select v-model="search.site_no" @change="changeData()" placeholder="请选择工厂" style="width: 100%">
                <el-option label="查看全部" value="0" />
                <el-option v-for="item in siteSearchList" :key="item.site_no" :label="item.site_name +'('+item.site_no+')'" :value="item.site_no"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产日期：">
              <el-date-picker v-model="selectData" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeData()" :clearable="false">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="resetBtn()" icon="el-icon-search">重置时间</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="queryList" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="site_name" label="工厂" width="150" align="center" />
        <el-table-column prop="doc_no" label="工单号" width="500" />
        <el-table-column prop="sku_no" label="产品编码" width="150" align="center" />
        <el-table-column prop="brand_name" label="品牌" width="150" align="center" />
        <el-table-column prop="lot_no" label="产品批号" width="150" align="center" />
        <el-table-column prop="pline_no" label="产线" width="150" align="center" />
        <el-table-column prop="team_name" label="班组" width="150" align="center" />
        <el-table-column prop="mfg_date" label="生产时间" width="180" align="center" />
        <el-table-column prop="req_qty" label="计划单品数量" width="120" align="center" />
        <el-table-column prop="real_item_num" label="实际单品数量"  width="120"  align="center" />
        <el-table-column prop="real_carton_num" label="实际外箱数量"  width="120"  align="center" />
        <el-table-column prop="uploaded_item_num" label="已上传单品数量" width="120" align="center" />
        <el-table-column prop="uploaded_carton_num" label="已上传外箱数量" width="120" align="center" />
        <el-table-column label="单品差异数量" width="120" align="center">
          <template #default="scope">
            {{ scope.row.real_item_num - scope.row.uploaded_item_num }}
          </template>
        </el-table-column>
        <el-table-column label="外箱差异数量" width="120" align="center">
          <template #default="scope">
            {{ scope.row.real_carton_num - scope.row.uploaded_carton_num }}
          </template>
        </el-table-column>
      </el-table>

      <div class="custom-table-pagination">
        <pagination @handleQuery="queryList" :pagination="pagination" />
      </div>
    </div>
  </div>
</template>

<script>
import checkdata from "./checkdata";
import pagination from "@/components/pagination/index.vue";

export default {
  components: { pagination },
  setup() {
    const state = checkdata();
    state.queryList();
    state.getSiteList();
    return {
      ...state,
    };
  },
};
</script>
<style scoped>
.seleceData,
.resetBtn {
  margin-left: 20px;
}
</style>