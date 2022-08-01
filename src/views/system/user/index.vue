<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">

        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="用户名：">
              <el-input v-model="search.username" placeholder="请输入用户名" size="small" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button v-permission="'admin:user:add'" type="primary" size="small" @click="handleCreate" icon="el-icon-plus">新增用户</el-button>
          <el-button v-show="false" v-permission="'admin:user:delete'" type="danger" size="small" @click="handleDestory" icon="el-icon-delete">删除</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column prop="username" label="用户名" width="120" align="center" />
        <el-table-column prop="nickname" label="昵称" width="120" align="center" />
        <el-table-column prop="role_name" label="角色名称" width="120" align="center" />
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="scope">
            <el-tooltip :content="statusOptions[scope.row.status]" placement="top">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="changeSwitch(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120" align="center" />
        <el-table-column prop="email" label="邮箱" width="180" align="center" />
        <el-table-column prop="login_ip" label="登录ip" width="120" align="center" />
        <el-table-column prop="create_time" label="创建时间" align="center" width="180" />
        <el-table-column fixed="right" label="操作" align="center" width="320">
          <template #default="scope">
            <el-button v-permission="'admin:user:editpass'" size="mini" type="success" @click="resetPassword(scope.row)" icon="el-icon-lock">重置密码</el-button>
            <el-button v-permission="'admin:user:edit'" size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button v-permission="'admin:user:delete'" size="mini" type="danger" @click="handleDelete(scope.$index)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryUserList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog :title="dialogTitleMap[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px" :before-close="handleCloseData">
      <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="用&ensp;户&ensp;名" prop="username" v-if="dialogStatus === 'create'">
          <el-input v-model="form.username" placeholder="请填写用户名" />
        </el-form-item>
        <el-form-item label="昵&emsp;&emsp;称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请填写昵称" />
        </el-form-item>
        <el-form-item label="用户角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="请选择用户角色" style="width: 100%">
            <el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name" :value="item.role_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性&emsp;&emsp;别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
            <el-option v-for="item in sexList" :key="item.sexId" :label="item.sexName" :value="item.sexId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密&emsp;&emsp;码" prop="password" v-if="dialogStatus === 'create'">
          <el-input v-model="form.password" placeholder="请填写密码" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手&emsp;&emsp;机" prop="phone">
          <el-input v-model="form.phone" placeholder="请填写手机" />
        </el-form-item>
        <el-form-item label="邮&emsp;&emsp;箱" prop="email">
          <el-input v-model="form.email" placeholder="请填写邮箱" />
        </el-form-item>
        <el-form-item label="状&emsp;&emsp;态" prop="status">
          <el-radio v-model="form.status" :label="1">开启</el-radio>
          <el-radio v-model="form.status" :label="2">关闭</el-radio>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseData" icon="el-icon-refresh-left" size="small">取消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码的弹窗 -->
    <el-dialog title="重置密码" v-model="resetPasswordDialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="resetData" status-icon :rules="rules" ref="resetForm" label-width="80px">
        <el-form-item label="新&ensp;密&ensp;码" prop="newpass">
          <el-input type="password" v-model="resetData.newpass" autocomplete="off"  placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="renewpass">
          <el-input type="password" v-model="resetData.renewpass" autocomplete="off" placeholder="请确认密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" icon="el-icon-refresh-left" size="small">取消</el-button>
          <el-button type="primary" icon="el-icon-check" size="small" @click="eidtPassword">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import useUser from "./user";
import pagination from "@/components/pagination/index.vue";
export default {
  components: { pagination },
  setup() {
    const state = useUser();
    state.queryUserList();
    return {
      ...(state),
    };
  },
};
</script>