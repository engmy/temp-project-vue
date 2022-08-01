<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box" v-permission="'admin:loginLog:data'">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="用户名：">
              <el-input v-model="search.username" placeholder="请输入用户名" size="small" />
            </el-form-item>
            <el-form-item label="登录IP：">
              <el-input v-model="search.ip" placeholder="请输入登录IP" size="small" />
            </el-form-item>
            <el-form-item label="登录状态：">
              <el-select v-model="search.status" placeholder="请选择登录状态" size="small">
                <el-option v-for="item in statusList" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="登录时间：">
              <el-date-picker v-model="selectData" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  :clearable="false">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="resetBtn()" icon="el-icon-search">重置时间</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:loginLog:data'">刷新</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" style="width: 100%" current-row-key="id">
        <el-table-column type="index"    label="序号"     width="50"  align="center"/>
        <el-table-column prop="username" label="用户名"   width="200"  align="center" />
        <el-table-column prop="ip"       label="登录IP"   width="200"  align="center" />
        <el-table-column prop="browser"  label="浏览器"    width="200"  align="center" />
        <el-table-column prop="os"       label="操作系统"  width="200"  align="center" />
        <el-table-column prop="status"   label="状态"     width="200"  align="center" >
          <template #default="scope">{{ statusOptions[scope.row.status] }}</template>
        </el-table-column>
        <el-table-column prop="create_time" label="登录时间" width="180" align="center" />
        <el-table-column prop="response" label="返回结果" width="180" align="center">
          <template #default="scope">{{ JSON.parse(scope.row.response).msg }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleDetial(scope.row)" icon="el-icon-document" v-permission="'admin:loginLog:detail'">日志详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="custom-table-pagination">
        <pagination @handleQuery="queryLoginLogList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog title="日志详情" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="70px">
        <el-form-item label="请求参数" prop="params">
          <el-input type="textarea" v-model="temp.params" placeholder="" :rows="10" />
        </el-form-item>
        <el-form-item label="相应参数" prop="response">
          <el-input type="textarea" v-model="temp.response" :rows="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false" icon="el-icon-refresh-left" size="small">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import loginLog from "./loginlog";
import pagination from "@/components/pagination/index.vue";
export default {
  components: { pagination },
  setup() {
    const state = loginLog();
    state.queryLoginLogList();
    return {
      ...(state),
    };
  },
};
</script>