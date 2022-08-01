<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="班组编号：">
              <el-input size="small" v-model="search.team_no" placeholder="请输入班组编号"></el-input>
            </el-form-item>
            <el-form-item label="班组名称：">
              <el-input size="small" v-model="search.team_name" placeholder="请输入班组名称"></el-input>
            </el-form-item>

            <el-form-item label="选择工厂">
              <el-select v-model="search.site_no" placeholder="请选择工厂">
                <el-option v-for="search in siteList" :key="search.site_no" :label="search.site_name" :value="search.site_no"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:workdoc:data'">刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus" v-permission="'admin:workdoc:add'">新增班组</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="site_no" label="工厂编号" width="200" />
        <el-table-column prop="site_name" label="工厂名称" width="200" />
        <el-table-column prop="team_no" label="班组编号" width="200" />
        <el-table-column prop="team_name" label="班组名称" width="200" />
        <el-table-column prop="update_user" label="更新人" width="200" align="center" />
        <el-table-column prop="update_time" label="更新时间" width="300" align="center" />
        <el-table-column fixed="right" label="操作" align="center" width="240">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit" v-permission="'admin:material:edit'" id="edit">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index)" icon="el-icon-delete" v-permission="'admin:workdoc:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryTeamList" :pagination="pagination" />
      </div>
    </div>
    <el-dialog :title="dialogTitleMap[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">

        <el-form-item label="选择工厂" prop="site_no">
          <el-select v-model="temp.site_no" placeholder="请选择工厂" @change="changeSite" style="width: 100%">
            <el-option v-for="item in siteList" :key="item.site_no" :label="item.site_name" :value="item.site_no"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工厂ID" prop="site_id" style="display: none">
          <el-input v-model="temp.site_id" placeholder="" />
        </el-form-item>

        <el-form-item label="工厂描述" prop="site_name" style="display: none">
          <el-input v-model="temp.site_name" placeholder="" />
        </el-form-item>

        <el-form-item label="班组编号" prop="team_no" >
          <el-input v-model="temp.team_no" placeholder=""  :readonly="istrue ? false : 'readonly'"/>
        </el-form-item>
        <el-form-item label="班组名称" prop="team_name">
          <el-input v-model="temp.team_name" placeholder="" />
        </el-form-item>
        <el-form-item label="备注说明" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="请选择备注说明" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogFormVisible = false" icon="el-icon-refresh-left" size="small">取消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import team from "./team";
import pagination from "@/components/pagination";
export default {
  name: 'team',
  components: { pagination },
  setup() {
    const state = team();
    state.queryTeamList();
    return {
      ...(state),
    };
  }
};


</script>