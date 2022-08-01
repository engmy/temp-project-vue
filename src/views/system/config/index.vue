<template>
  <div>
    <el-tabs v-if="configList.length > 0" @tab-click="handleClick" type="border-card">
      <el-tab-pane v-for="item in configList" :key="item.code" :label="item.info">
        <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
        <el-button v-permission="'admin:config:add'" type="primary" size="small" @click="handleCreate(item)" icon="el-icon-plus">新增</el-button>
        <el-divider></el-divider>
        <!-- 循环一个表单出来展示 -->
        <!-- <el-card class="box-card"> -->
        <el-form label-position="left" label-width="100px" :model="dataList">
          <el-form-item v-for="(item,key,i) in dataList" :key="i" :label="item.config_name">
            <el-row :gutter="24">
              <el-col :span="20">
                <el-input v-model="item.config_value"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="danger" icon="el-icon-delete" circle @click="deletebtn(item)"></el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button @click="refresh" icon="el-icon-refresh-left" size="small">重置</el-button>
            <el-button type="primary" icon="el-icon-check" size="small" @click="submitBtn">提交</el-button>
          </el-form-item>
        </el-form>
        <!-- </el-card> -->
      </el-tab-pane>
    </el-tabs>

    <!-- 添加的弹出层 -->
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" :close-on-click-modal="false" :before-close="handleClose" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px">
        <el-form-item label="参数名称" prop="config_name">
          <el-input v-model="temp.config_name" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="config_key">
          <el-input v-model="temp.config_key" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="config_value">
          <el-input v-model="temp.config_value" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="参数类型" prop="config_type">
          <el-select v-model="temp.config_type" placeholder="请选择参数类型" style="width: 100%">
            <el-option
              v-for="item in typeList"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" placeholder="请填写备注" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose" icon="el-icon-refresh-left" size="small">取消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="createData()">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import useUser from "./config";
export default {
  setup() {
    const state = useUser();

    state.queryConfigList();

    return {
      ...state,
    };
  },
};
</script>

<style scoped>
.box-card {
  width: 480px;
}
</style>