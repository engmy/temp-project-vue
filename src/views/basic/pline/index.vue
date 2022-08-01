<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box" >
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="产线名称：">
              <el-input v-model="search.pline_name" placeholder="请输入产线名称" @keyup.enter="handleSearch" size="small" />
            </el-form-item>

            <el-form-item label="工厂：">
              <el-select v-model="search.site_no" placeholder="请选择工厂" style="width: 100%">
                 <el-option label="查看全部" value="0" />
                <el-option v-for="item in siteSearchList" :key="item.site_no" :label="item.site_name +'('+item.site_no+')'" :value="item.site_no"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="handleSearch" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:pline:data'">刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus" v-permission="'admin:pline:add'">新增产线</el-button>
        </div>
      </div>
      <el-table :data="list" border fit max-height="700" style="width: 100%" current-row-key="id">
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column prop="pline_no" label="产线编号" width="150" align="center" />
        <el-table-column prop="pline_name" label="产线名称" width="150" align="center" />
        <el-table-column prop="pline_specs" label="产线规格" width="150" align="center" />
        <el-table-column prop="site_name" label="工厂" width="180" align="center" />
        <el-table-column prop="create_user" label="创建人" width="150" align="center" />
        <el-table-column prop="create_time" label="创建时间" align="center" width="180" />
        <el-table-column prop="remarks" label="备注" align="center" width="240" />
        <el-table-column fixed="right" label="操作" align="center" width="240">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit" v-permission="'admin:pline:update'">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index)" icon="el-icon-delete" v-permission="'admin:pline:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryPlineList" :pagination="pagination" />
      </div>
    </div>
    <!-- 新增、修改弹窗 -->
    <el-dialog :title="dialogTitle" v-model="DialogVisible" width="650px" :before-close="handleClose" :close-on-click-modal="false">
      <!-- 主体 -->
      <el-form :model="temp" status-icon :rules="rules" ref="dataForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="产线编号" prop="pline_no">
          <el-input v-model="temp.pline_no" />
        </el-form-item>
        <el-form-item label="产线名称" prop="pline_name">
          <el-input v-model="temp.pline_name" />
        </el-form-item>
        <el-form-item label="所属工厂" prop="site_no">
          <el-select v-model="temp.site_no" placeholder="请选择工厂" @change="selectChange" style="width: 100%">
            <el-option v-for="item in siteList" :key="item.site_no" :label="item.site_name +'('+item.site_no+')'" :value="item.site_no"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产线规格" prop="pline_specs">
          <el-input v-model="temp.pline_specs" />
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input v-model="temp.remarks" type="textarea" :rows="5" />
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
import pline from "./pline";
import pagination from "@/components/pagination/index.vue";

export default {
  components: { pagination },
  setup() {
    const state = pline();

    state.queryPlineList();
    state.getSiteList();

    return {
      ...state,
    };
  },
};
</script>

<style>
</style>