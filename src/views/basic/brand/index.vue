<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="品牌名称：">
              <el-input v-model="search.brand_name" placeholder="请输入品牌名称" @keyup.enter="handleSearch" size="small" />
            </el-form-item>
            <el-form-item label="工厂：">
              <el-select v-model="search.site_pk" placeholder="请选择工厂" style="width: 100%">
                <el-option label="查看全部" value="0" />
                <el-option v-for="item in siteSearchList" :key="item.site_no" :label="item.site_name +'('+item.site_no+')'" :value="item.site_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="handleSearch" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:brand:data'">刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus" v-permission="'admin:brand:add'">新增品牌</el-button>
           <el-button @click="exportExcel" type="success" size="small" icon="el-icon-download">导出Excel</el-button>
        </div>
      </div>
      <el-table :data="list" border fit max-height="700" style="width: 100%" current-row-key="id">
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column prop="brand_no" label="品牌编号" width="150" align="center" />
        <el-table-column prop="brand_name" label="品牌名称" width="150" />
        <el-table-column prop="site_name" label="工厂" width="240" align="left" />
        <el-table-column prop="customer_name" label="客户名称" width="150" />
        <el-table-column prop="create_user" label="创建人" width="150" align="center" />
        <el-table-column prop="create_time" label="创建时间" align="center" width="180" />
        <el-table-column prop="remarks" label="备注" align="center" width="240" />
        <el-table-column fixed="right" label="操作" align="center" width="280">
          <template #default="scope">
            <el-button size="mini" type="primary" v-permission="'admin:brand:edit'" @click="handleEditCode(scope.row)" icon="el-icon-edit">配置</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit" v-permission="'admin:brand:update'">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index)" icon="el-icon-delete" v-permission="'admin:brand:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryBrandList" :pagination="pagination" />
      </div>
    </div>

    <!-- 新增、修改弹窗 -->
    <el-dialog :title="dialogTitle" v-model="DialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="temp" status-icon :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="品牌编号" prop="brand_no">
          <el-input v-model="temp.brand_no" />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brand_name">
          <el-input v-model="temp.brand_name" />
        </el-form-item>
        <el-form-item label="所属工厂" prop="site_pks">
          <el-select filterable v-model="temp.site_pks" multiple placeholder="请选择工厂" style="width: 100%">
            <el-option v-for="item in siteList" :key="item.site_id" :label="item.site_name +'('+item.site_no+')'" :value="item.site_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="customer_name">
          <el-autocomplete  style="width: 100%" class="inline-input" v-model="temp.customer_name" :fetch-suggestions="querySearch" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="备注说明" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="请选择备注说明" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" icon="el-icon-refresh-left" size="small">取消</el-button>
          <el-button type="primary" icon="el-icon-check" size="small" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 配置弹窗 -->
    <el-dialog title="编辑配置信息" v-model="CodeDialogVisible" width="650px" :before-close="editClose" :close-on-click-modal="false">
      <el-form :model="editCode" status-icon :rules="rules" ref="editCodeForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="单品码长度" prop="item_code_length">
          <el-input v-model="editCode.item_code_length" type='number' />
        </el-form-item>
        <el-form-item label="外箱码长度" prop="carton_code_length">
          <el-input v-model="editCode.carton_code_length" type='number' />
        </el-form-item>
        <el-form-item label="托盘码长度" prop="pallet_code_length">
          <el-input v-model="editCode.pallet_code_length" type='number' />
        </el-form-item>
        <el-form-item label="手动上传" prop="upload_data_methon">
          <el-select v-model="editCode.upload_data_methon" placeholder="请选择手动上传" style="width: 100%">
            <el-option v-for="item in uploadMeonth" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editClose()" icon="el-icon-refresh-left" size="small">取消</el-button>
          <el-button type="primary" icon="el-icon-check" size="small" @click="updateCode()">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script>
import brand from "./brand";
import pagination from "@/components/pagination/index.vue";

export default {
  components: { pagination },
  setup() {
    const state = brand();
    state.queryBrandList();
    state.allSiteList();

    return {
      ...state,
    };
  },
};
</script>