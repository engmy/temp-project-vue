import { reactive, toRefs, ref } from 'vue';
import _ from 'lodash';
import { deepTree, formatDate, checkNumber } from "@/utils";
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCategoryTree, addCategory, getCategoryInfo, editCategoryInfo, deleteCategoryInfo } from '@/api/basic/category';
import { getBrandListOnSiteId } from '@/api/basic/brand';
import { getSiteListByComPk } from '@/api/basic/site';

export default function () {
  const dataForm = ref(null);
  const theTable = ref(null);

  const state = reactive({
    categoryList: [],
    list: [],
    expends: [],
    search: {
      category_name: '',
      site_pk: '',
      brand_pk: '',
    },
    dialogFormVisible: false,
    dialogTitle: {
      update: "编辑分类",
      create: "新增分类",
    },
    dialogStatus: "",
    rules: {
      sort: [
        { required: true, message: "请输入分类排序", trigger: "blur" },
        { validator: checkNumber, trigger: "blur" }
      ],
      category_name: [{ required: true, message: "分类名称不能为空", trigger: "blur" }],
      brand_pk: [{ required: true, message: "请选择品牌", trigger: "change" }],
      site_pk: [{ required: true, message: "请选择工厂", trigger: "change" }],
    },
    form: {
      category_name: '',
      parent_id: '',
      sort: 0,
      remarks: '',
      site_pk: '',
      brand_pk: ''
    },
    siteList: [], // 工厂列表
    brandList: [], // 品牌列表
    siteSearchList:[], // 工厂搜索列表
    brandSearchList:[], // 品牌搜索列表
  })

  const stateForm = () => {
    state.form = {
      category_name: '',
      parent_id: '',
      sort: 0,
      remarks: '',
      site_pk: '',
      brand_pk: ''
    };
  };
  const resetData = () => {
    dataForm.value.resetFields();
  }

  const changeSearchSiteSelect = async (row) => {
    state.brandSearchList = [];
    state.search.brand_pk = '';
    // 获取品牌列表
    await getBrandListOnSiteId({ siteId: row }).then(res => {
      if (res.code === 200) {
        state.brandSearchList = res.data;
      }
    });
  }

  // 搜索
  const querycategoryList = async () => {
    await getCategoryTree({
      category_name: state.search.category_name,
      site_pk: state.search.site_pk - 0 === 0 ? undefined : state.search.site_pk,
      brand_pk: state.search.brand_pk - 0 === 0 ? undefined : state.search.brand_pk
    }).then(result => {
      let res = result.data.map(p => {
        let new_data = _.cloneDeep(p);
        new_data.create_time = formatDate(new_data.create_time);
        new_data.update_time = formatDate(new_data.update_time);
        new_data.name = p.category_name;
        new_data.id = p.category_id;
        return new_data;
      })
      state.categoryList = _.cloneDeep(res);
      state.list = deepTree(res);
    })
  }

  // 展开所有
  const handleExpand = () => {
    state.expends = state.categoryList.map(item => item.id)
  }

  // 关闭所有
  const handleCollect = () => {
    state.categoryList.forEach(row => {
      theTable.value.toggleRowExpansion(row, false);
    });
  }

  const handleClose = () => {
    state.dialogFormVisible = false;
    dataForm.value.resetFields();
    resetData();
  }

  // 创建分类
  const handleCreate = () => {
    state.dialogFormVisible = true;
    state.dialogStatus = 'create';
    stateForm();
    getSiteList();
  }

  // 创建子集分类
  const handleCreateToRaw = (parent_id) => {
    stateForm();
    getSiteList();
    state.form.parent_id = parent_id;
    state.dialogStatus = "create";
    state.dialogFormVisible = true;
  }

  const createData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        state.form.parent_id = state.form.parent_id === "" ? "0" : state.form.parent_id;
        await addCategory(state.form).then(res => {
          if (res.code === 200) {
            ElMessage.success(res.msg)
            handleClose();
            querycategoryList();
          }
        })
      }
    })
  }

  // 编辑弹框
  const handleEdit = async (row) => {
    getSiteList();
    const result = await getCategoryInfo(row.id)
    if (result.code === 200) {
      state.form = Object.assign({}, result.data);
    }
    // 获取品牌列表
    await getBrandListOnSiteId({ siteId: row.site_pk }).then(res => {
      if (res.code === 200) {
        state.brandList = res.data;
      }
    });
    state.dialogStatus = "update";
    state.dialogFormVisible = true;
  };

  const updateData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        await editCategoryInfo(state.form).then(res => {
          if (res.code === 200) {
            ElMessage.success(res.msg)
            handleClose();
            querycategoryList();
          }
        })
      }
    })
  }


  // 删除
  const handleDelete = (item) => {
    ElMessageBox.confirm(`是否删除分类 ${item.category_name} ？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteCategoryInfo({ category_id: item.category_id }).then(res => {
        if (res.code === 200) {
          querycategoryList();
          ElMessage.success(res.msg);
        }
      }).catch(() => {
        querycategoryList();
      })
    }).catch(() => {
      console.log('已取消删除');
    })
  }

  const getSiteList = async () => {
    if (state.siteList.length !== 0 && state.siteSearchList.length !== 0) {
      return;
    }
    // 获取工厂列表
    let payload = {
      current_page: 1,
      page_size: 30 //一个公司一个不会超过30个工厂吧 如果有 到时早加个下拉加载的
    };
    await getSiteListByComPk(payload).then(res => {
      if (res.code === 200) {
        state.siteSearchList = res.data;
        state.siteList = res.data;
      }
    })
  }

  const changeSiteSelect = async (row) => {
    state.siteList.map(p => {
      if (p.site_id === row) {
        state.form.site_no = p.site_no;
      }
    })
    state.brandList = [];
    state.form.brand_pk = '';
    // 获取品牌列表
    await getBrandListOnSiteId({ siteId: row }).then(res => {
      if (res.code === 200) {
        state.brandList = res.data;
      }
    });
  }

  const changeSelect = (item) => {
    state.brandList.map(p => {
      if (p.brand_id === item) {
        state.form.brand_no = p.brand_no;
        return;
      }
    })
  }


  return {
    dataForm, theTable, ...toRefs(state), querycategoryList, handleExpand, handleCollect, handleCreate, handleCreateToRaw, handleEdit, handleDelete, createData, updateData, handleClose,
    changeSiteSelect, changeSelect, getSiteList, changeSearchSiteSelect
  }
}
