<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="分类名称：">
              <el-input v-model="search.category_name" placeholder="请输入一级分类名称" @keyup.enter="querycategoryList" size="small" />
            </el-form-item>
            <el-form-item label="工厂：">
              <el-select v-model="search.site_pk" placeholder="请选择工厂" @change="changeSearchSiteSelect" style="width: 100%">
                <el-option label="查看全部" value="0" />
                <el-option v-for="item in siteSearchList" :key="item.site_id" :label="item.site_name +'('+item.site_no+')'" :value="item.site_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌">
              <el-select filterable v-model="search.brand_pk" placeholder="请选择品牌" style="width: 100%">
                <el-option label="查看全部" value="0" />
                <el-option v-for="item in brandSearchList" :key="item.brand_id" :label="item.brand_name + '('+ item.brand_no +')'" :value="item.brand_id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="querycategoryList" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="querycategoryList" size="small" icon="el-icon-refresh" type="primary" plain>刷新</el-button>
          <el-button v-permission="'admin:category:add'" type="primary" size="small" @click="handleCreate" icon="el-icon-plus">新增分类</el-button>
          <el-button type="warning" size="small" @click="handleExpand()" icon="el-icon-arrow-down">全部展开</el-button>
          <el-button type="danger" size="small" @click="handleCollect()" icon="el-icon-arrow-right">全部折叠</el-button>
        </div>
      </div>

      <el-table :data="list" ref="theTable" :expand-row-keys="expends" row-key="id" border :tree-props="{ children: 'children' }">
        <el-table-column prop="name" label="分类名称" width="190" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="remarks" label="备注" width="190" />
        <el-table-column prop="site_name" label="所属工厂" width="190" />
        <el-table-column prop="brand_name" label="所属品牌" width="190" />
        <el-table-column prop="update_user" label="更新人" show-overflow-tooltip width="220" />
        <el-table-column prop="update_time" label="更新时间" width="180" />
        <el-table-column prop="create_user" label="创建人" show-overflow-tooltip width="220" />
        <el-table-column prop="create_time" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="300px">
          <template #default="scope">
            <el-button v-permission="'admin:category:add'" type="primary" size="mini" @click="handleCreateToRaw(scope.row.id)" icon="el-icon-plus">新增子分类</el-button>
            <el-button v-permission="'admin:category:edit'" type="primary" size="mini" @click="handleEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button v-permission="'admin:category:delete'" type="danger" size="mini" @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗信息 -->
    <el-dialog :title="dialogTitle[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="选择工厂" prop="site_pk">
          <el-select filterable @change="changeSiteSelect" v-model="form.site_pk" placeholder="请选择工厂" style="width: 100%">
            <el-option v-for="item in siteList" :key="item.site_id" :label="item.site_name + '('+ item.site_no +')'" :value="item.site_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择品牌" prop="brand_pk">
          <el-select filterable @change="changeSelect" v-model="form.brand_pk" placeholder="请选择品牌" style="width: 100%">
            <el-option v-for="item in brandList" :key="item.brand_id" :label="item.brand_name + '('+ item.brand_no +')'" :value="item.brand_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级分类" prop="parent_id">
          <category-tree v-model:value="form.parent_id" :categoryList="categoryList" />
        </el-form-item>
        <el-form-item label="分类名称" prop="category_name">
          <el-input v-model="form.category_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入分类排序" type="number" />
        </el-form-item>
        <el-form-item label="备注说明" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请选择备注说明" type="textarea" :rows="5" />
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
import category from "./category";
import categoryTree from "@/components/category-tree";
export default {
  components: { categoryTree },
  setup() {
    const state = category();

    state.querycategoryList();
    state.getSiteList();

    return {
      ...state,
    };
  },
}
</script>

<style>
</style>