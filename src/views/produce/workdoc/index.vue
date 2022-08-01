<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="table-search-box" v-permission="'admin:workdoc:data'">
          <el-form :inline="true" :model="search" class="form-inline">
            <el-form-item label="工单号：">
              <el-input size="small" v-model="search.doc_no"  placeholder="请输入工单号" style="width: 160px"></el-input>
            </el-form-item>

            <el-form-item label="产品编号：">
              <el-input size="small" v-model="search.sku_no"  placeholder="请输入产品编号" style="width: 160px"></el-input>
            </el-form-item>

            <el-form-item label="产品批号：">
              <el-input size="small" v-model="search.lot_no"  placeholder="请输入产品批号" style="width: 160px"></el-input>
            </el-form-item>

            <el-form-item label="单据状态：">
              <el-select size="small" v-model="search.doc_status" placeholder="请选择单据状态" @change="changeStatus" style="width: 160px">
                <el-option v-for="item in statusList" :key="item.doc_status" :label="item.doc_statusVal" :value="item.doc_status"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工单类型：">
              <el-select size="small" v-model="search.doc_catalog" placeholder="请选择单据状态" style="width: 160px">
                <el-option v-for="item in docCatalogList" :key="item.docCatalog" :label="item.docCatalogVal" :value="item.docCatalog" style="width: 160px"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工厂：">
              <el-select size="small" v-model="search.site_no" placeholder="请选择工厂" @change="changeSiteForm" style="width: 160px">
                <el-option v-for="search in siteFormList" :key="search.site_no" :label="search.site_name" :value="search.site_no"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-form>

        </div>
        <div class="custom-table-header-action">
          <el-button @click="refresh" size="small" icon="el-icon-refresh" type="primary" plain v-permission="'admin:workdoc:data'">刷新</el-button>
          <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-plus" v-permission="'admin:workdoc:add'">新增工单</el-button>
          <el-button type="success"  size="small"  @click="exportExcel" icon="el-icon-download">导出Excel</el-button>
        </div>
      </div>

      <el-table :data="list" border fit max-height="700" current-row-key="id" id="newwoektable">
        <el-table-column type="index"       label="序号"    width="50" align="center" />
        <el-table-column prop="doc_no"      label="工单号"   width="470" />
        <el-table-column prop="doc_catalog" label="工单类型"   width="170" align="center"  >
          <template #default="scope">{{ docCatalogOptions[scope.row.doc_catalog] }}</template>
        </el-table-column>
        <el-table-column prop="sku_no" label="产品编码" width="160" align="center" />
        <el-table-column prop="customer_sku_no" label="客户产品编码" width="160" align="center" />
        <el-table-column prop="bar_code" label="商品码" width="160" align="center" />
        <el-table-column prop="sku_desc" label="产品名称" width="530" />
        <el-table-column prop="extend2" label="罐装单号" width="120" align="center"/>
        <el-table-column prop="lot_no" label="产品批号" width="120" align="center" />
        <el-table-column prop="pline_no" label="产线代码" width="120" align="center" />
        <el-table-column prop="team_no" label="班组" width="120" align="center" />
        <el-table-column prop="site_no" label="工厂编号" width="120" align="center" />
        <el-table-column prop="site_name" label="工厂描述" width="190" align="center" />
        <el-table-column prop="brand_no" label="品牌编号" width="120" align="center" />
        <el-table-column prop="brand_name" label="品牌描述" width="120" align="center" />
        <el-table-column prop="mfg_date" label="生产日期" width="120" align="center" />
        <el-table-column prop="req_qty" label="计划外箱数量" width="120" align="center" />
        <el-table-column prop="real_item_num" label="实际单品数量"  width="120"  align="center" />
        <el-table-column prop="real_carton_num" label="实际外箱数量"  width="120"  align="center" />
        <el-table-column prop="uploaded_item_num" label="已上传单品数量" width="120" align="center" />
        <el-table-column prop="uploaded_carton_num" label="已上传外箱数量" width="120" align="center" />
        <el-table-column prop="doc_status" label="单据状态" width="100" align="center">
          <template #default="scope">{{ statusOptions[scope.row.doc_status] }}</template>
        </el-table-column>
        <el-table-column prop="source"      label="创建方式" width="120"   align="center" >
          <template #default="scope">{{ sourceOptions[scope.row.source] }}</template>
        </el-table-column>
        <el-table-column prop="update_user" label="更新人" width="120"  align="center" />
        <el-table-column prop="update_time" label="更新时间" width="185" align="center" />
        <el-table-column fixed="right"      label="操作"    width="400" align="center">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleDetial(scope.row.doc_no)" icon="el-icon-document" v-permission="'admin:workdoc:detail'">工单明细</el-button>
            <span v-if="scope.row.is_upload_btn" style="margin: 0 10px">
              <el-button size="mini" type="warning" @click="handleUpload(scope.$index)" icon="el-icon-upload" v-if="scope.row.doc_status=='30'" v-permission="'admin:workdoc:delete'">上传数据</el-button>
              <el-button size="mini" type="warning" disabled="disabled" icon="el-icon-upload" v-if="scope.row.doc_status!='30'" v-permission="'admin:workdoc:delete'">上传数据</el-button>
            </span>
            <el-button size="mini" type="danger"  @click="handleDelete(scope.$index)" icon="el-icon-delete" v-if="scope.row.doc_status=='00'" v-permission="'admin:workdoc:delete'">删除</el-button>
            <el-button size="mini" type="danger"  disabled="disabled" icon="el-icon-delete" v-if="scope.row.doc_status!='00'" v-permission="'admin:workdoc:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <pagination @handleQuery="queryWorkDocList" :pagination="pagination" />
      </div>
    </div>

    <el-dialog :title="dialogTitleMap[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-form-item label="工&ensp;单&ensp;号" prop="title">
          <el-input v-model="temp.doc_no" placeholder="工单号系统自动生成" disabled />
        </el-form-item>

        <el-form-item label="工&emsp;&emsp;厂" prop="site_no">
          <el-select v-model="temp.site_no" placeholder="请选择工厂"  @change="siteChange"  style="width: 100%">
            <el-option v-for="item in siteList" :key="item.site_no" :label="item.site_name" :value="item.site_no"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工厂描述" prop="uri"   style="display: none" >
          <el-input v-model="temp.site_name" placeholder="" />
        </el-form-item>

        <el-form-item label="工厂ID" prop="uri" style="display: none" >
          <el-input v-model="temp.site_id" placeholder="" />
        </el-form-item>

        <el-form-item label="班&emsp;&emsp;组" prop="team_no">
          <el-select v-model="temp.team_no" placeholder="请选择班组"  @change="changeTeam"  style="width: 100%">
            <el-option v-for="item in teamList" :key="item.team_no" :label="item.team_name" :value="item.team_no"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="班组描述" prop="uri"   style="display: none" >
          <el-input v-model="temp.team_name" placeholder="" />
        </el-form-item>

        <el-form-item label="班组ID" prop="uri" style="display: none" >
          <el-input v-model="temp.team_id" placeholder="" />
        </el-form-item>

        <el-form-item label="品&emsp;&emsp;牌" prop="brand_no">
          <el-select v-model="temp.brand_no" placeholder="请选择品牌"   @change="changeBrand" style="width: 100%">
            <el-option v-for="item in brandList" :key="item.brand_no" :label="item.brand_name" :value="item.brand_no"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="品牌描述" prop="uri"  style="display: none" >
          <el-input v-model="temp.brand_name" placeholder="" />
        </el-form-item>

        <el-form-item label="品牌ID" prop="uri"  style="display: none" >
          <el-input v-model="temp.brand_id" placeholder="" />
        </el-form-item>

        <el-form-item label="产&emsp;&emsp;线" prop="pline_no">
          <el-select v-model="temp.pline_no" placeholder="请选择产线" @change="changePline" style="width: 100%">
            <el-option v-for="item in plineList" :key="item.pline_no" :label="item.pline_name" :value="item.pline_no"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产线ID" prop="uri" style="display: none" >
          <el-input v-model="temp.pline_id" placeholder="" />
        </el-form-item>

        <el-form-item label="产线描述" prop="uri"  style="display: none" >
          <el-input v-model="temp.pline_name" placeholder="" />
        </el-form-item>

        <el-form-item label="选择产品" prop="sku_no">
          <el-select v-model="temp.sku_no"  filterable  placeholder="请选择产品" @change="changeSkuDesc" style="width: 100%">
            <el-option v-for="item in sku_noList" :key="item.sku_no" :label="item.bar_code" :value="item.sku_no"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品描述" prop="uri"  style="display: none" >
          <el-input v-model="temp.sku_desc" placeholder="" />
        </el-form-item>

        <el-form-item label="产品描述" prop="uri"  style="display: none" >
          <el-input v-model="temp.sku_id" placeholder="" />
        </el-form-item>

        <el-form-item label="生产日期" prop="mfg_date">
          <el-date-picker type="date" placeholder="请选择生产日期" v-model="temp.mfg_date"    style="width: 100%;"></el-date-picker>
        </el-form-item>

        <el-form-item label="产品批号" prop="lot_no">
          <el-input  v-model="temp.lot_no" :rows="8"  placeholder="请输入产品批号" ></el-input>
        </el-form-item>

        <el-form-item label="计划数量" prop="req_qty">
          <el-input v-model="temp.req_qty" :rows="8" type="number"  placeholder="请输入计划数量"></el-input>
          <span class="unit-span">箱</span>
        </el-form-item>

        <el-form-item label="罐装单号" prop="extend2">
          <el-input v-model="temp.extend2" :rows="8"   placeholder="请输入罐装单号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false" icon="el-icon-refresh-left" size="small">取消</el-button>
        <el-button  type="primary" icon="el-icon-check" size="small" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
      </template>
    </el-dialog>

    <el-dialog title="工单详情" v-model="dialogFormVisible2" :close-on-click-modal="false">
      <el-form :inline="true" :model="search1" class="form-inline">
        <el-form-item label="箱码：">
          <el-input size="small" v-model="search1.carton_code"  placeholder="请输入箱码" ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch2" icon="el-icon-search">查询</el-button>
          <el-button type="success"  size="small"  @click="detialexportExcel" icon="el-icon-download">导出明细</el-button>
        </el-form-item>

      </el-form>

      <el-table :data="listDetial" border fit max-height="400" current-row-key="id">
        <el-table-column prop="sku_no"   label="产品编号" width="220" align="center" />
        <el-table-column prop="lot_no"  label="批号"     width="220" align="center" />
        <el-table-column prop="carton_code" label="箱码"  width="220" align="center" />
        <el-table-column prop="item_code"   label="瓶码"  align="center" />
      </el-table>

      <div class="custom-table-pagination">
        <pagination @handleQuery="DetialhandleSizeChange" :pagination="pagination2" />
      </div>
      <template #footer>
        <el-button @click="dialogFormVisible2 = false" icon="el-icon-refresh-left" size="small">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import workdoc from "./workdoc";
import pagination from "@/components/pagination/index.vue";
export default {
  components: { pagination },
    setup()
    {
        const state = workdoc();
        state.queryWorkDocList();
        return {
          ...(state),
        };
    }
};
</script>

<style lang="scss" scoped>
.app-body {
  ::v-deep .el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #dcdfe6;
}
</style>
