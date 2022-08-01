<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="任务名称：">
              <el-input v-model="search.task_name" placeholder="请输入任务名称" @keyup.enter="handleSearch" size="small" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button v-permission="'admin:task:add'" type="primary" size="small" @click="handleCreate" icon="el-icon-plus">新增任务</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column prop="task_name" label="任务名称" width="200" align="center" />
        <el-table-column prop="cron" label="cron表达式" width="200" align="center" />
        <el-table-column prop="task_key" label="调用方法" width="200" align="center" />
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template #default="scope">
            <el-tooltip :content="statusOptions[scope.row.status]" placement="top">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="changeSwitch(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="update_user" label="更新人" width="150" align="center" />
        <el-table-column prop="update_time" label="更新时间" width="200" align="center" />
        <el-table-column prop="remark" label="备注" align="center" width="200" />
        <el-table-column fixed="right" label="操作" align="center" width="200">
          <template #default="scope">
            <el-button v-permission="'admin:task:add'" size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button v-permission="'admin:task:delete'" size="mini" type="danger" @click="handleDelete(scope.$index)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryTaskList" :pagination="pagination" />
      </div>
    </div>

    <!-- 弹出层 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="600px" :before-close="handleCloseData">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-form-item label="所属工厂" prop="site_pk">
          <el-select filterable @change="changeSiteSelect" v-model="temp.site_pk" placeholder="请选择工厂" style="width: 100%">
            <el-option v-for="item in siteList" :key="item.site_id" :label="item.site_name + '('+ item.site_no +')'" :value="item.site_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属品牌" prop="brand_pk">
          <el-select filterable @change="changeSelect" v-model="temp.brand_pk" placeholder="请选择品牌" style="width: 100%">
            <el-option v-for="item in brandList" :key="item.brand_id" :label="item.brand_name + '('+ item.brand_no +')'" :value="item.brand_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="temp.task_name" placeholder="请填写任务名称" />
        </el-form-item>
        <el-form-item label="定时设置" prop="cron">
          <el-input v-model="temp.cron" placeholder="请填写cron表达式" />
        </el-form-item>
        <el-form-item label="调用方法" prop="task_key">
          <el-input v-model="temp.task_key" placeholder="请填写调用方法"  :disabled="dialogStatus === 'create' ? false : true" />
        </el-form-item>
        <el-form-item label="推送网关" prop="gateway">
          <el-input v-model="temp.gateway" placeholder="请填写推送网关" />
        </el-form-item>
        <el-form-item label="登&ensp;录&ensp;名" prop="api_key">
          <el-input v-model="temp.api_key" placeholder="请填写登录名" />
        </el-form-item>
        <el-form-item label="登录密码" prop="api_secret">
          <el-input v-model="temp.api_secret" placeholder="请填写登录密码" />
        </el-form-item>
        <el-form-item label="任务地址" prop="task_url">
          <el-input v-model="temp.task_url" placeholder="请填写任务地址" />
        </el-form-item>
        <el-form-item label="任务状态" prop="status" v-if="dialogStatus === 'update'">
          <el-radio v-model="temp.status" :label="1">开启</el-radio>
          <el-radio v-model="temp.status" :label="2">关闭</el-radio>
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="temp.remark" placeholder="请填写备注说明" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseData" icon="el-icon-refresh-left" size="small">取消</el-button>
        <el-button size="small" type="primary" icon="el-icon-check" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import tast from "./task";
import pagination from "@/components/pagination/index.vue";

export default {
  components: { pagination },
  setup() {
    const state = tast();
    state.queryTaskList();
    return {
      ...(state),
    };
  },
};
</script>