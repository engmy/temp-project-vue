<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box" v-permission="'admin:operlog:data'">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="系统模块：">
              <el-input v-model="search.title" placeholder="请输入系统模块" size="small" />
            </el-form-item>
            <el-form-item label="操作人：">
              <el-input v-model="search.create_user" placeholder="请输入操作人" size="small" />
            </el-form-item>
            <el-form-item label="操作状态：">
              <el-select v-model="search.status" placeholder="请选择操作状态" size="small">
                <el-option v-for="item in statusList" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作类型：">
              <el-select v-model="search.business_type" placeholder="请选择操作类型" size="small">
                <el-option v-for="item in typeList" :key="item.key" :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="操作时间：">
              <el-date-picker v-model="selectData" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"   :clearable="false">
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
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:operlog:data'">刷新</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号"    width="50"  align="center"/>
        <el-table-column prop="title" label="系统模块" width="150" align="center"/>
        <el-table-column prop="business_type" label="业务类型" width="150" align="center">
          <template #default="scope">{{ typeOptions[scope.row.business_type] }}</template>
        </el-table-column>
        <el-table-column prop="ip" label="主机" width="150" align="center" />
        <el-table-column prop="method" label="请求方式" width="150" align="center" />
        <el-table-column prop="uri"    label="请求地址" width="300" align="left" />
        <el-table-column prop="status" label="操作状态" align="center" width="120">
          <template #default="scope">{{ statusOptions[scope.row.status] }}</template>
        </el-table-column>
        <el-table-column prop="create_user"  label="操作人"  width="150" align="center" />
        <el-table-column prop="create_time"  label="操作时间" width="220" align="center" />
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleDetial(scope.row)" icon="el-icon-document" v-permission="'admin:operlog:detail'">日志详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="custom-table-pagination">
        <pagination @handleQuery="queryOperLogList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog title="日志详情" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="70px">
        <el-form-item label="请求参数" prop="params">
          <el-input type="textarea" v-model="temp.params" placeholder="" :rows="18" />
        </el-form-item>
        <el-form-item label="相应参数" prop="response">
          <el-input v-model="temp.response" ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false" icon="el-icon-refresh-left" size="small">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import operationLog from "./operlog";
import pagination from "@/components/pagination/index.vue";
export default {
  components: { pagination },
  setup() {
    const state = operationLog();
    state.queryOperLogList();
    return {
      ...(state),
    };
  },
};
</script>