import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getBrandList, addBrand, editBrand, deleteBrand, customer, editCode } from '@/api/basic/brand';
import { getSiteListByComPk } from '@/api/basic/site';
import { arrayToExcel } from '@/utils/export2Excel';
import { checkNumber } from "@/utils";

export default function () {
  const dataForm = ref(null);
  const editCodeForm = ref(null);

  const state = reactive({
    //搜索关键字
    search: {
      brand_name: '',
      site_pk: '',
    },
    siteSearchList: [],
    pagination: {
      current_page: 1,
      page_size: 10,
    },
    // 用来与需要提交的信息做对比、
    old_brand_no: '',
    list: [], //展示的数据
    temp: {
      brand_no: '',
      brand_name: '',
      remarks: '',
      site_pk: '', // 工厂id
      is_delete: 0,
      customer_name: '',
      site_pks: [],
    },
    uploadMeonth: [
      {
        value: 0,
        text: "关闭"
      },
      {
        value: 1,
        text: "开启"
      }
    ],
    statusOptions: {
      1: '正常',
      2: '禁用'
    },
    customer_list: [], //客户列表
    dialogTitle: '',
    DialogVisible: false,
    dialogStatus: '',
    siteList: [], // 工厂列表
    rules: {
      brand_no: [
        { required: true, message: "品牌编号不能为空" },
        { validator: checkBrandNo, trigger: "blur" }
      ],
      brand_name: [{ required: true, message: "品牌名称不能为空", trigger: "blur" }],
      company_no: [{ required: true, message: "所属公司不能为空", trigger: "blur" }],
      site_pks: [{ required: true, message: "所属工厂不能为空", trigger: "blur" }],
      customer_name: [{ required: true, message: "客户名称不能为空", trigger: "change" }],
      item_code_length: [
        { required: true, message: "单品码长度不能为空", trigger: "change" },
        { validator: checkNumber, trigger: "blur" }
      ],
      carton_code_length: [
        { required: true, message: "外箱码长度不能为空", trigger: "change" },
        { validator: checkNumber, trigger: "blur" }
      ],
      pallet_code_length: [
        { required: true, message: "托盘码长度不能为空", trigger: "change" },
        { validator: checkNumber, trigger: "blur" }
      ],
      upload_data_methon: [
        { required: true, message: "请选择上传方式", trigger: "blur" },
      ]
    },
    CodeDialogVisible: false, //配置单独的弹窗
    editCode: {
      item_code_length: 0,
      carton_code_length: 0,
      pallet_code_length: 0,
    },

  })

  function checkBrandNo(rule, value, callback) {
    if (value) {
      if (state.dialogStatus === 'update' && state.old_brand_no !== value) {
        return callback(new Error("禁止修改品牌编号"));
      } else {
        return callback();
      }
    } else {
      return callback(new Error("品牌编号不能为空"));
    }
  }

  // 重置表单提交数据
  const resetTemp = () => {
    state.temp = {
      brand_no: '',
      brand_name: '',
      remarks: '',
      site_pk: '', // 工厂编号
      is_delete: 0,
      customer_name: '',
    }
    state.editCode = {
      item_code_length: 0,
      carton_code_length: 0,
      pallet_code_length: 0,
    }
    state.siteList = [];
    state.company_no = '';
    state.old_brand_no = '';
  }

  // 重置页码
  const resetPagination = () => {
    state.pagination.current_page = 1;
  }


  // 查询
  const queryBrandList = async () => {
    let payload = {
      ...state.pagination,
      brand_name: state.search.brand_name,
      site_pk: state.search.site_pk === '0' ? null : state.search.site_pk,
    };
    let res = await getBrandList(payload);
    if (res.code === 200) {
      const { list, ...pagination } = res.data;
      state.list = list;
      state.pagination = pagination;
    }
  }


  // 刷新
  const refresh = () => {
    queryBrandList();
  }

  const getCustomerList = async () => {
    await customer().then(res => {
      state.customer_list = res.data.filter(p => p !== null).map(p => {
        let obj = {};
        obj.value = p;
        return obj;
      })
    })
  }

  // 搜索
  const handleSearch = () => {
    resetPagination();
    queryBrandList();
  }

  // 新增
  const handleCreate = async () => {
    state.dialogStatus = 'create';
    state.DialogVisible = true;
    state.dialogTitle = '新增品牌';
    getCustomerList();
    allSiteList();
  }

  // 根据公司的id获取其所有的工厂
  const allSiteList = async () => {
    if (state.siteList.length !== 0 && state.siteSearchList.length !== 0) {
      return;
    }
    await getSiteListByComPk().then(res => {
      if (res.code === 200) {
        state.siteList = res.data;
        state.siteSearchList = res.data;
      }
    })
  }

  // 编辑
  const handleEdit = (row) => {
    state.temp = Object.assign({}, row);
    state.temp.site_pks = state.temp.site_pk;
    state.old_brand_no = state.temp.brand_no;
    state.dialogStatus = 'update';
    state.dialogTitle = '修改品牌';
    state.DialogVisible = true;
    allSiteList();
    getCustomerList();
  }

  // 弹窗关闭
  const handleClose = () => {
    state.dialogStatus = '';
    state.DialogVisible = false;
    state.dialogTitle = '';
    state.customer_list = [];
    dataForm.value.resetFields();
    resetTemp();
  }

  // 创建数据
  const createData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        // 将数组转换成字符串 逗号分隔
        state.temp.site_pk = state.temp.site_pks.toString();
        await addBrand(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            queryBrandList();
            ElMessage.success(res.msg);
          }
        }).catch(err => {
          console.log(err)
        })
      }
    });
  }

  // 修改数据
  const updateData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        // 将数组转换成字符串 逗号分隔
        state.temp.site_pk = state.temp.site_pks.toString();
        await editBrand(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            queryBrandList();
            ElMessage.success(res.msg);
          }
        }).catch(err => {
          console.log(err)
        })
      }
    })
  }


  // 删除
  const handleDelete = (index) => {
    let item = state.list[index];
    ElMessageBox.confirm(`是否删除品牌 ${item.brand_name} ？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteBrand({ brand_id: item.brand_id }).then(res => {
        if (res.code === 200) {
          queryBrandList();
          ElMessage.success(res.msg);
        }
      }).catch(() => {
        queryBrandList();
      })
    }).catch(() => {
      console.log('已取消删除');
    })
  }

  const querySearch = (queryString, cb) => {
    var results = queryString
      ? state.customer_list.filter(createFilter(queryString))
      : state.customer_list;
    // 调用 callback 返回建议列表的数据
    cb(results);
  };
  const createFilter = (queryString) => {
    return (restaurant) => {
      return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      );
    };
  };

  const handleEditCode = (row) => {
    state.CodeDialogVisible = true;
    state.editCode = Object.assign({}, row);
  }

  const updateCode = () => {
    editCodeForm.value.validate(async (valid) => {
      if (valid) {
        // 将数组转换成字符串 逗号分隔
        state.editCode.site_pk = state.editCode.site_pk.toString();
        await editCode(state.editCode).then(res => {
          if (res.code === 200) {
            editClose();
            queryBrandList();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          queryBrandList();
        })
      }
    })
  }

  const editClose = () => {
    state.CodeDialogVisible = false;
    editCodeForm.value.resetFields();
    resetTemp();
  }

  //定义导出Excel表格事件
  const exportExcel = async () => {
    // 加载后台的数据

    let payload = {
      current_page: 1,
      page_size: 6000000, // 设置无穷大的数据
      brand_name: state.search.brand_name,
      site_pk: state.search.site_pk === '0' ? null : state.search.site_pk,
    };
    let res = await getBrandList(payload);

    if (res.code === 200) {
      let listData = res.data.list;
      require.ensure([], () => {
        const header =
          ['品牌编号', '品牌名称', '工厂', '客户名称', '创建人', '创建时间'];

        const filterVal =
          ['brand_no', 'brand_name', 'site_name', 'customer_name', 'create_user', 'create_time'];

        const data = formatJson(filterVal, listData);

        let filename = '品牌信息导出';

        arrayToExcel({
          header, data, filename
        });
      })
    }
  }
  const formatJson = (filterVal, jsonData) => {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }


  return {
    ...toRefs(state), dataForm, refresh, handleCreate, handleSearch, handleEdit, handleDelete,
    resetPagination, queryBrandList, handleClose, createData, updateData, resetTemp, querySearch,
    allSiteList, handleEditCode, updateCode, editCodeForm, editClose, exportExcel
  }
}