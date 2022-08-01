<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">

        <div class="table-search-box" >
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="企业名称：">
              <el-input v-model="search.company_name" placeholder="请输入企业名称" @keyup.enter="handleSearch" size="small" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:company:data'">刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus" v-permission="'admin:company:add'">新增企业</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" style="width: 100%" current-row-key="id">
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column prop="company_no" label="企业编号" width="80" align="center" />
        <el-table-column prop="company_name" label="企业名称" width="120" align="center" />
        <el-table-column prop="city" label="城市" width="120" align="center" />
        <el-table-column prop="area" label="地址" width="120" align="center" />
        <el-table-column prop="contact_person" label="联系人" width="120" align="center" />
        <el-table-column prop="phone" label="联系电话" width="150" align="center" />
        <el-table-column prop="status" label="状态" align="center" width="120" >
          <template #default="scope" v-permission="'admin:company:update'">
            <el-tooltip :content="' ' + statusOptions[scope.row.status]" placement="top">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="changeSwitch(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="create_user" label="创建人" width="150" align="center" />
        <el-table-column prop="create_time" label="创建时间" align="center" width="180" />
        <el-table-column prop="remarks" label="备注" align="center" width="230" />
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit" v-permission="'admin:company:update'">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index)" icon="el-icon-delete" v-permission="'admin:company:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryCompanyList" :pagination="pagination" />
      </div>
    </div>
    <!-- 新增、修改弹窗 -->
    <el-dialog :title="dialogTitle" v-model="DialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <!-- 主体 -->
      <el-form :model="temp" status-icon :rules="rules" ref="dataForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="公司编号" prop="company_no">
          <el-input v-model="temp.company_no" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company_name">
          <el-input v-model="temp.company_name" />
        </el-form-item>
        <el-form-item label="所在城市">
          <el-input v-model="temp.city" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="temp.area" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="temp.contact_person" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remarks" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="temp.status" :label="1">开启</el-radio>
          <el-radio v-model="temp.status" :label="2">关闭</el-radio>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" icon="el-icon-refresh-left" size="small">取消</el-button>
          <el-button type="primary" icon="el-icon-check" size="small" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import company from "./company";
import pagination from "@/components/pagination/index.vue";

export default {
  components: { pagination },
  setup() {
    const state = company();

    state.queryCompanyList();

    return {
      ...state,
    };
  },
};
</script>

<style>
</style>