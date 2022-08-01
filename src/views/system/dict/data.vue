<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
              <el-form-item label="字典标签：">
                <el-input  v-model="search.dict_label" size="small" placeholder="请输入字典标签" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
              </el-form-item>
          </el-form>
        </div>

        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus">新增数据</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号" width="180"/>
        <el-table-column prop="dict_label" label="字典标签" width="180" />
        <el-table-column prop="dict_type"  label="字典类型" width="180" />
        <el-table-column prop="dict_sort"  label="排序" width="180" />
        <el-table-column prop="status" label="字典状态" align="center" width="180">
          <template #default="scope">
            <el-tooltip :content="statusOptions[scope.row.status]" placement="top">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2"
                         @change="handleChange(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="update_user" label="创建人" width="220"/>
        <el-table-column prop="update_time" label="创建时间" width="220"/>
        <el-table-column label="操作" align="center" width="230" fixed="right">
          <template #default="scope">
            <el-button v-permission="'admin:dict:edit'" size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button v-permission="'admin:dict:delete'" size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="custom-table-pagination">
          <pagination @handleQuery="queryDictDataList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog :title="dialogTitle[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">

        <el-form-item label="字典类型" prop="dict_type">
          <el-input v-model="form.dict_type" placeholder="请输入字典类型" :disabled="true" />
        </el-form-item>

        <el-form-item label="字典标签" prop="dict_label">
          <el-input v-model="form.dict_label" placeholder="请输入字典标签" />
        </el-form-item>

        <el-form-item label="字典键值" prop="dict_value">
          <el-input v-model="form.dict_value" placeholder="请输入字典键值" />
        </el-form-item>

        <el-form-item label="样式属性" prop="css_class">
          <el-input v-model="form.css_class" placeholder="请输入样式属性" />
        </el-form-item>

        <el-form-item label="字典排序" prop="dict_sort">
          <el-input v-model="form.dict_sort" placeholder="请输入字典排序" type="number" />
        </el-form-item>

        <el-form-item label="回显样式" prop="list_class">
          <el-select v-model="form.list_class" placeholder="请选择回显样式" style="width: 100%">
            <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="系统默认" prop="list_class">
          <el-select v-model="form.is_default" placeholder="请选择系统默认" style="width: 100%">
            <el-option v-for="item in defaultList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
import useRole from "./data";
import pagination from "@/components/pagination";
export default {
  components: { pagination },
  setup()
  {
      const state = useRole();
      state.queryDictDataList();
      return { ...state };
  },
};
</script>