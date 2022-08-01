<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box" v-if="false">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="菜单名称：">
              <el-input v-model="search.menu_name" placeholder="请输入菜单名称" @keyup.enter="handleSearch" size="small" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="queryMenuList" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button v-permission="'admin:menu:add'" type="primary" size="small" @click="handleCreate" icon="el-icon-plus">新增菜单</el-button>
          <el-button type="warning" size="small" @click="handleExpand()" icon="el-icon-arrow-down">全部展开</el-button>
          <el-button type="danger" size="small" @click="handleCollect()" icon="el-icon-arrow-right">全部折叠</el-button>
        </div>
      </div>

      <el-table :data="list" ref="theTable" :expand-row-keys="expends" row-key="id" border :tree-props="{ children: 'children' }">
        <el-table-column prop="name" label="名称" width="190" />
        <el-table-column prop="icon" label="图标" width="100" align="center">
          <template #default="scope">
            <icon-svg :name="scope.row.icon" v-if="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="90">
          <template #default="scope">{{ typeOptions[scope.row.type] }}</template>
        </el-table-column>
        <el-table-column prop="status" label="菜单状态" align="center" width="100">
          <template #default="scope">
            <el-tooltip :content="statusOptions[scope.row.status]" placement="top">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="handleChange(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="path" label="菜单路劲" width="190" />
        <el-table-column prop="permission" label="角色权限" width="190" />
        <el-table-column prop="view_path" label="文件路径" show-overflow-tooltip width="220" />
        <el-table-column prop="update_time" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="300px">
          <template #default="scope">
            <el-button v-permission="'admin:menu:add'" type="primary" size="mini" @click="handleCreateToRaw(scope.row.id)" icon="el-icon-plus">新增子菜单</el-button>
            <el-button v-permission="'admin:menu:edit'" type="primary" size="mini" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button v-permission="'admin:menu:delete'" type="danger" size="mini" @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="dialogTitle[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="上级菜单" prop="parent_id">
          <MenuTree v-model:value="form.parent_id" :menuList="menuList" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="url_type">
          <el-radio-group v-model="form.url_type">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="form.menu_name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <MenuIcons v-model:value="form.icon" @changeIcon="changeIconFun" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入菜单排序" type="number" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="url">
          <el-input v-model="form.url" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="form.permission" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="文件路径" prop="view_path" v-if="form.url_type==2">
          <MenuFilePath v-model="form.view_path" placeholder="请选择文件路径" />
        </el-form-item>
        <el-form-item label="备注说明" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请选择备注说明" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" icon="el-icon-close" @click="handleClose">取消</el-button>
        <el-button type="primary" size="small" @click="dialogStatus === 'create' ? createData() : updateData()" icon="el-icon-check">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { deepTree, checkNumber } from "@/utils";
import { reactive, toRefs, ref, onMounted } from "vue";
import { elMessageBox, elMessage } from "element-plus";
import MenuTree from "@/components/menu-tree";
import MenuIcons from "@/components/menu-icons";
import MenuFilePath from "@/components/menu-file-path";
import { createMenu, updateMenu, deleteMenu, updateStatus, getMenuInfo } from "@/api/system/menu";
import { generateDynamicRoutes } from "@/router";
import _ from 'lodash';

export default
  {
    components: { MenuTree, MenuIcons, MenuFilePath },
    setup() {
      const store = useStore();
      const dataForm = ref(null);
      const theTable = ref(null);
      const state = reactive({
        expends: [],
        menuList: [],
        list: [],
        typeOptions: {
          1: "目录",
          2: "菜单",
          3: "按钮",
        },
        statusOptions: {
          1: "启用",
          2: "禁用"
        },
        dialogFormVisible: false,
        dialogTitle: {
          update: "编辑菜单",
          create: "新增菜单",
        },
        dialogStatus: "",
        form: {
          url_type: 2,
          menu_name: "",
          parent_id: "0",
          sort: 0,
          status: 1,
          icon: "",
          url: "",
          view_path: ""
        },
        rules: {
          url: [{ required: true, message: "菜单路径不能为空", trigger: "blur" }],
          url_type: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
          sort: [
            { required: true, message: "请输入菜单排序", trigger: "blur" },
            { validator: checkNumber, trigger: "blur" }
          ],
          menu_name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
          status: [{ required: true, message: "菜单状态不能为空", trigger: "blur" }],
          icon: [{ required: true, message: "菜单图标不能为空", trigger: "blur" }],
          permission: [{ required: true, message: "权限标识不能为空", trigger: "blur" }],
        },
        search: {
          menu_name: ""
        }
      });

      const handleSearch = () => {
        queryMenuList();
      }

      const clearMenu = async () => {
        const viewRoutes = await store.dispatch("menu/generateRoutes");
        generateDynamicRoutes(viewRoutes)
      };

      const handleExpand = () => {
        state.expends = state.menuList.map(item => item.id)
      };

      const handleCollect = () => {
        state.menuList.forEach(row => {
          theTable.value.toggleRowExpansion(row, false);
        });
      };

      const queryMenuList = async () => {
        let result = await store.dispatch("menu/getTreeMenuList");
        state.menuList = _.cloneDeep(result);
        state.list = deepTree(result);
      };

      const stateForm = () => {
        state.form = {
          url_type: 2,
          menu_name: "",
          parent_id: "0",
          sort: 0,
          status: 1,
          icon: "",
          url: "",
          view_path: ""
        };
      };

      const handleCreate = () => {
        stateForm();
        state.dialogStatus = "create";
        state.dialogFormVisible = true;
      };

      // 新增子菜单
      const handleCreateToRaw = (parent_id) => {
        stateForm();
        state.form.parent_id = parent_id;
        state.dialogStatus = "create";
        state.dialogFormVisible = true;
      };

      // 编辑弹框
      const handleEdit = async (row) => {
        const result = await getMenuInfo(row.id)
        if (result.code === 200) {
          state.form = Object.assign({}, result.data);
        }
        state.dialogStatus = "update";
        state.dialogFormVisible = true;
      };

      // 新增菜单
      const createData = () => {
        dataForm.value.validate(async (valid) => {
          if (valid) {
            const result = await createMenu(state.form);
            if (result.code === 200) {
              clearMenu();
              queryMenuList();
              state.dialogFormVisible = false;
              elMessage({ message: result.msg, type: 'success', duration: 2000 })
            }
          }
        });
      }

      // 编辑菜单
      const updateData = () => {
        dataForm.value.validate(async (valid) => {
          if (valid) {
            const result = await updateMenu(state.form.menu_id, state.form);
            if (result.code === 200) {
              clearMenu();
              queryMenuList();
              state.dialogFormVisible = false;
              elMessage({ message: result.msg, type: 'success', duration: 2000 })
            }
          }
        });
      }

      // 删除菜单
      const handleDelete = (row) => {
        let item = row;
        elMessageBox.confirm(`是否删除菜单 ${item.name} ？`, '提示',
          {
            confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
          }).then(async () => {
            const result = await deleteMenu(item.id);
            if (result.code === 200) {
              clearMenu();
              queryMenuList();
              state.dialogFormVisible = false;
              elMessage({ message: result.msg, type: 'success', duration: 2000 })
            } else {
              elMessage({ message: result.msg, type: 'error', duration: 2000 })
            }
          }).catch(() => {
            console.log('已取消删除');
          })
      }

      // 更新菜单状态
      const handleChange = async (row) => {
        let data = {
          "menu_id": row.id,
          "status": row.status
        }
        const result = await updateStatus(data);
        if (result.code === 200) {
          clearMenu();
          queryMenuList();
          elMessage({ message: result.msg, type: 'success', duration: 2000 })
        } else {
          elMessage({ message: result.msg, type: 'error', duration: 2000 })
        }
      }

      // 选择图标
      const changeIconFun = (icon) => {
        state.form.icon = icon;
      }

      onMounted(() => {
        queryMenuList();
      })

      
  const handleClose = () => {
    state.dialogFormVisible = false;
    dataForm.value.resetFields();
  }

      return { dataForm, theTable, ...toRefs(state), handleSearch, handleExpand, handleCollect, changeIconFun, handleChange, queryMenuList, handleCreate, handleCreateToRaw, handleEdit, createData, updateData, handleDelete,handleClose };
    }
  };
</script>

<style lang="scss" scoped>
.icon-svg {
  font-size: 24px;
}
</style>