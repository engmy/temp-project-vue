<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="字典名称：">
              <el-input v-model="search.dict_name" size="small" placeholder="请输入字典名称" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus">新增字典</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号" width="180" />
        <el-table-column prop="dict_name" label="字典名称" width="180" />
        <el-table-column prop="dict_type" label="字典类型" width="180" />
        <el-table-column prop="sort" label="排序" width="180" />
        <el-table-column prop="status" label="字典状态" align="center" width="180">
          <template #default="scope">
            <el-tooltip :content="statusOptions[scope.row.status]" placement="top">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="handleChange(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="update_user" label="创建人" width="220" />
        <el-table-column prop="update_time" label="创建时间" width="220" />
        <el-table-column label="操作" align="center" width="280" fixed="right">
          <template #default="scope">
            <el-button size="mini" type="success" @click="handleData(scope.row)" icon="el-icon-tickets">列表</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger"  @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryDictList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog :title="dialogTitle[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="字典名称" prop="dict_name">
          <el-input v-model="form.dict_name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dict_type">
          <el-input v-model="form.dict_type" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="字典排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入字典排序" type="number" />
        </el-form-item>
        <el-form-item label="字典状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="备注说明" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请选择备注说明" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" icon="el-icon-close" @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus === 'create' ? createData() : updateData()" icon="el-icon-check">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import useRole from "./dict";
import pagination from "@/components/pagination";
export default {
  components: { pagination },
  setup()
  {
      const state = useRole();
      state.queryDictList();
      return { ...state };
  },
};
</script>