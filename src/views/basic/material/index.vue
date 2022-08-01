<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="产品编号\名称：">
              <el-input v-model="search.sku_no" placeholder="请输入产品编号或名称" @keyup.enter="handleSearch" size="small" />
            </el-form-item>
            <el-form-item label="工厂：">
              <el-select v-model="search.site_no" placeholder="请选择工厂" style="width: 100%">
                <el-option label="查看全部" value="0" />
                <el-option v-for="item in siteSearchList" :key="item.site_no" :label="item.site_name +'('+item.site_no+')'" :value="item.site_no"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom-table-header-action">
          <el-button @click="queryList" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:material:data'">刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus" v-permission="'admin:material:add'">新增产品</el-button>
          <el-button @click="download" size="small" type="success" icon="el-icon-download" v-permission="'admin:material:download'">模板下载</el-button>
          <el-button @click="upload" type="warning" size="small" icon="el-icon-upload" v-permission="'admin:material:excel'">导入</el-button>
          <el-button @click="exportExcel" type="success" size="small" icon="el-icon-download">导出Excel</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id">
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column prop="sku_no" label="产品编号" width="150" align="center" />
        <el-table-column prop="sku_desc" label="产品名称" width="420" />
        <el-table-column prop="customer_sku_no" label="客户产品编号" width="150" align="center" />
        <el-table-column prop="bar_code" label="商品码" width="150" align="center" />
        <el-table-column prop="category_name" label="产品分类" width="120" align="center" />
        <el-table-column prop="sku_spec" label="产品规格" width="120" align="center" />
        <el-table-column prop="pline_specs" label="产线规格" width="120" align="center" />
        <el-table-column prop="relation_name" label="包装关系" width="120" align="center" />
        <el-table-column prop="carton_unit" label="外包装单位" width="120" align="center" />
        <el-table-column prop="carton2item" label="箱含量" width="120" align="center" />
        <el-table-column prop="pallet2carton" label="箱托规格" width="120" align="center" />
        <el-table-column prop="brand_name" label="品牌" width="120" align="center" />
        <el-table-column prop="net_weight" label="净重" width="120" align="center" />
        <el-table-column prop="gross_weight" label="毛重" width="120" align="center" />
        <el-table-column prop="update_user" label="更新人" width="150" align="center" />
        <el-table-column prop="update_time" label="更新时间" align="center" width="180" />
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit" v-permission="'admin:material:edit'">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete" v-permission="'admin:material:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryList" :pagination="pagination" />
      </div>
    </div>
    <!-- 新增、修改弹窗 -->
    <el-dialog :title="dialogTitle" v-model="DialogVisible" width="640px" :before-close="handleClose" :close-on-click-modal="false">
      <!-- 主体 -->
      <el-form :model="temp" status-icon :rules="rules" ref="dataForm" label-width="110px" class="demo-ruleForm">
        <el-form-item label="产品编码" prop="sku_no">
          <el-input v-model="temp.sku_no" maxlength='25' show-word-limit />
        </el-form-item>
        <el-form-item label="产品名称" prop="sku_desc">
          <el-input type="textarea" :rows="1" v-model="temp.sku_desc" maxlength='80' show-word-limit />
        </el-form-item>
        <el-form-item label="商&ensp;品&ensp;码">
          <el-input v-model="temp.bar_code" maxlength='20' show-word-limit />
        </el-form-item>
        <el-form-item label="包装关系" prop="relation_type">
          <el-select filterable @change="changeRelation" :disabled="show_disabled" v-model="temp.relation_type" placeholder="请选择包装关系" style="width: 100%">
            <el-option v-for="item in relationList" :key="item.code" :label="item.info" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户产品编号" prop="customer_sku_no">
          <el-input v-model="temp.customer_sku_no" maxlength="25" show-word-limit />
        </el-form-item>

        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="产品工厂" prop="site_pk">
              <el-select filterable @change="changeSiteSelect" v-model="temp.site_pk" placeholder="请选择工厂" style="width: 100%">
                <el-option v-for="item in siteList" :key="item.site_id" :label="item.site_name + '('+ item.site_no +')'" :value="item.site_id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品品牌" prop="brand_pk">
              <el-select filterable @change="changeSelect" v-model="temp.brand_pk" placeholder="请选择品牌" style="width: 100%">
                <el-option v-for="item in brandList" :key="item.brand_id" :label="item.brand_name + '('+ item.brand_no +')'" :value="item.brand_id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="产品分类">
          <category-tree v-model:value="temp.category_pk" :isMaterial="true" :categoryList="categoryList" />
        </el-form-item>

        <el-row :gutter="14">
          <el-col :span="12">
            <el-form-item label="产品规格" prop="sku_spec">
              <el-input v-model="temp.sku_spec" maxlength='20' show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产线规格" prop="pline_specs">
              <el-select v-model="temp.pline_specs" placeholder="请选择规格" style="width: 100%">
                <el-option v-for="item in skuSpecList" :key="item.skuSpecName" :label="item.skuSpecName" :value="item.skuSpecName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="14">
          <el-col :span="12">
            <el-form-item label="产品毛重" prop="gross_weight">
              <el-input v-model="temp.gross_weight" type='number' placeholder="小数点只能在英文模式下才可以输入" maxlength='5' /><span class="unit-span">单位:kg</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品净重" placeholder="小数点只能在英文模式下才可以输入" prop="net_weight">
              <el-input v-model="temp.net_weight" placeholder="小数点只能在英文模式下才可以输入" type='number' maxlength='5' /><span class="unit-span">单位:kg</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="14">
          <el-col :span="12" v-if="show_item_unit">
            <el-form-item label="单品单位" prop="item_unit">
              <el-input v-model="temp.item_unit" maxlength='20' show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="show_carton_unit">
            <el-form-item label="外箱单位" prop="carton_unit">
              <el-input v-model="temp.carton_unit" maxlength='20' show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="14" v-if="show_pallet2carton && show_carton2item">
          <el-col :span="12">
            <el-form-item label="箱&ensp;含&ensp;量" prop="carton2item" v-if="show_carton2item">
              <el-input v-model="temp.carton2item" type='number' placeholder="小数点只能在英文模式下才可以输入" maxlength='5' />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="箱托规格" prop="pallet2carton" v-if="show_pallet2carton">
              <el-input v-model="temp.pallet2carton" placeholder="小数点只能在英文模式下才可以输入" type='number' maxlength='5' />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" icon="el-icon-refresh-left" size="small">取消</el-button>
          <el-button type="primary" icon="el-icon-check" size="small" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 上传组件 -->
    <el-dialog title="导入Excel数据" v-model="DialogVisibleUpload" width="420px">
      <el-upload class="upload-demo" drag :action="UploadUrl()" accept=".xls,.xlsx" :limit="1" :before-upload="beforeUploadFile" :file-list="fileList" :auto-upload="false" ref="uploadRef" :http-request="uploadHttpRequest">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            请选择上传Excel文件
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" type="success" @click="submitUpload">确认上传</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import material from "./material";
import pagination from "@/components/pagination/index.vue";
import categoryTree from "@/components/category-tree";

export default {
  components: { pagination, categoryTree },
  setup() {
    const state = material();
    state.queryList();
    state.getSiteList();
    return { ...state };
  }
}
</script>
