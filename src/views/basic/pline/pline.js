import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getPlineList, addPline, editPline, deletePline } from '@/api/basic/pline';
import { getSiteListByComPk } from '@/api/basic/site';

export default function () {
  const dataForm = ref(null);
  const state = reactive({
    //搜索关键字
    search: {
      pline_name: '',
      site_no: ''
    },
    siteSearchList: [],
    pagination: {
      current_page: 1,
      page_size: 10,
    },
    list: [], //展示的数据
    temp: {
      pline_no: '',
      pline_name: '',
      remarks: '',
      site_no: '', // 工厂编号
      pline_specs: '',
      is_delete: 0,
      site_pk: '',
    },
    statusOptions: {
      1: '正常',
      2: '禁用'
    },
    dialogTitle: '',
    DialogVisible: false,
    dialogStatus: '',
    company_no: '', // 选择的公司编号
    companyList: [], // 公司列表
    siteList: [], // 工厂列表
    rules: {
      pline_no: [{ required: true, message: "产线编号不能为空", trigger: "blur" },
      { validator: checkPlneeNo, trigger: "blur" }],
      pline_name: [{ required: true, message: "产线名称不能为空", trigger: "blur" }],
      company_no: [{ required: true, message: "所属公司不能为空", trigger: "blur" }],
      site_no: [{ required: true, message: "所属工厂不能为空", trigger: "blur" }],
      pline_specs: [{ required: true, message: "产线规格不能为空", trigger: "blur" }],
    },
    oldPlineNo: '',

  })


  function checkPlneeNo(rule, value, callback) {
    if (value) {
      if (state.dialogStatus === 'update' && state.oldPlineNo !== value) {
        return callback(new Error("禁止修改产线编号"));
      } else {
        return callback();
      }
    } else {
      return callback(new Error("产线编号不能为空"));
    }
  }

  // 重置表单提交数据
  const resetTemp = () => {
    state.temp = {
      pline_no: '',
      pline_name: '',
      remarks: '',
      site_no: '', // 工厂编号
      is_delete: 0,
      pline_specs: '',
      site_pk: '',
    }
    state.siteList = [];
    state.companyList = [];
    state.company_no = '';
    state.oldPlineNo = '';
  }

  // 重置页码
  const resetPagination = () => {
    state.pagination.current_page = 1;
  }


  // 查询
  const queryPlineList = async () => {
    let payload = {
      ...state.pagination,
      pline_name: state.search.pline_name,
      site_no: state.search.site_no === '0' ? null : state.search.site_no,
    };
    let res = await getPlineList(payload);
    if (res.code === 200) {
      const { list, ...pagination } = res.data;
      state.list = list;
      state.pagination = pagination;
    }
  }


  // 刷新
  const refresh = () => {
    queryPlineList();
  }

  // 搜索
  const handleSearch = () => {
    resetPagination();
    queryPlineList();
  }

  // 新增
  const handleCreate = async () => {
    state.dialogStatus = 'create';
    state.DialogVisible = true;
    state.dialogTitle = '新增产线信息';
    getSiteList();
  }

  const getSiteList = async () => {
    if (state.siteList.length !== 0 && state.siteSearchList.length !== 0) {
      return;
    }

    getSiteListByComPk().then(res => {
      if (res.code === 200) {
        state.siteList = res.data;
        state.siteSearchList = res.data;
      }
    })
  }


  // 编辑
  const handleEdit = (row) => {
    state.temp = Object.assign({}, row);
    state.dialogStatus = 'update';
    state.dialogTitle = '修改产线信息';
    state.DialogVisible = true;
    state.company_no = row.company_no;
    state.oldPlineNo = row.pline_no;
    getSiteList();
  }

  // 弹窗关闭
  const handleClose = () => {
    state.dialogStatus = '';
    state.DialogVisible = false;
    state.dialogTitle = '';
    dataForm.value.resetFields();
    resetTemp();
  }

  const selectChange = (item) => {
    state.siteList.filter(p => {
      if (p.site_no === item) {
        state.temp.site_pk = p.site_id
      }
    });
  }


  // 创建数据
  const createData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        await addPline(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            queryPlineList();

            ElMessage.success(res.msg);
          }
        }).catch(() => {
          queryPlineList();
        })
      }
    });
  }

  // 修改数据
  const updateData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        await editPline(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            queryPlineList();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          queryPlineList();
        })
      }
    })
  }


  // 删除
  const handleDelete = (index) => {
    let item = state.list[index];
    ElMessageBox.confirm(`是否删除产线 ${item.pline_name} ？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deletePline(item).then(res => {
        if (res.code === 200) {
          queryPlineList();
          ElMessage.success(res.msg);
        }
      }).catch(() => {
        queryPlineList();
      })
    }).catch(() => {
      console.log('已取消删除');
    })
  }

  return {
    ...toRefs(state),
    dataForm,
    refresh,
    handleCreate,
    handleSearch,
    handleEdit,
    handleDelete,
    resetPagination,
    queryPlineList,
    handleClose,
    createData,
    updateData,
    resetTemp,
    selectChange,
    getSiteList,
  }
}