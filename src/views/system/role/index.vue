<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="角色名称：">
              <el-input  v-model="search.role_name" size="small" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="queryRoleList" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button v-permission="'admin:role:add'" type="primary" size="small" @click="handleCreate" icon="el-icon-plus">新增角色</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="role_name" label="角色名称" width="220" align="center"/>
        <el-table-column prop="role_sort" label="排序" width="180" align="center"/>
        <el-table-column prop="status" label="角色状态" align="center" width="220">
          <template #default="scope">
            <el-tooltip :content="statusOptions[scope.row.status]" placement="top">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="handleChange(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="update_user" label="创建人" width="220" />
        <el-table-column prop="update_time" label="创建时间" width="220" />
        <el-table-column fixed="right" label="操作" align="center" width="320">
          <template #default="scope">
            <el-button v-permission="'admin:user:editpass'" size="mini" type="success" @click="handleData(scope.row)" icon="el-icon-s-unfold">角色数据</el-button>
            <el-button v-permission="'admin:role:edit'" size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button v-permission="'admin:role:delete'" size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryRoleList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog :title="dialogTitle[dialogStatus]" v-model="dialogFormVisible1" :before-close="handleClose" width="650px" :close-on-click-modal="false">
      <el-form ref="roleForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="品牌权限" prop="company_nos">
          <RoleDataTree ref="roleTree" v-model:value="form.company_nos" 
          :checked="form.company_nos" :data="roleDataList" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button size="small" icon="el-icon-close" @click="handleClose()">取消</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click="insertrolebrandData()">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog :title="dialogTitle[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px" :before-close="dataHandleClose">
      <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色排序" prop="role_sort">
          <el-input v-model="form.role_sort" placeholder="请输入角色排序" type="number" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="操作权限" prop="menu_ids">
          <RoleTree v-model:value="form.menu_ids" :data="menuList" ref="menuTree" />
        </el-form-item>
        <el-form-item label="备注说明" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请选择备注说明" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button size="small" icon="el-icon-close" @click="dataHandleClose">取消</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import RoleTree from "@/components/role-tree";
import RoleDataTree from "@/components/roledata_tree";
import pagination from "@/components/pagination";
import useRole from "./role";
export default
{
    components: { RoleTree,RoleDataTree, pagination },
    setup()
    {
        const state = useRole();
        state.queryRoleList();
        state.queryMenuList();
        return { ...(state) };
    }
};
</script>