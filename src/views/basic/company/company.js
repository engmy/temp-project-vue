import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getcompanyList, addCompany, changeCompanyStatus, editCompany, deleteCompany } from '@/api/basic/company';

export default function () {
  const dataForm = ref(null);
  const state = reactive({
    search: {
      company_name: ''
    }, //搜索关键字
    pagination: {
      current_page: 1,
      page_size: 10,
    },
    list: [], //展示的数据
    temp: {
      company_no: '',
      company_name: '',
      city: '',
      area: '',
      contact_person: '',
      phone: '',
      remarks: '',
      status: 1
    },
    statusOptions: {
      1: '正常',
      2: '禁用'
    },
    dialogTitle: '',
    DialogVisible: false,
    dialogStatus: '',
    rules: {
      company_no: [{ required: true, message: "公司编号不能为空", trigger: "blur" }],
      company_name: [{ required: true, message: "公司名称不能为空", trigger: "blur" }],
      status: [{ required: true, message: "该项不能为空", trigger: "blur" }],
      phone: [{ validator: checkPhone, trigger: "blur" }],
    },


  })

  // 手机号码的验证
  function checkPhone(rule, value, callback) {
    if (value) {
      let re = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
      let re2 = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/;
      if (re.test(value || re2.test(value))) {
        return callback();
      } else {
        return callback(new Error("请输入正确的电话号码"));
      }
    } else {
      return callback();
    }
  }

  // 重置表单提交数据
  const resetTemp = () => {
    state.temp = {
      company_no: '',
      company_name: '',
      city: '',
      area: '',
      contact_person: '',
      phone: '',
      remarks: '',
      status: 1
    }
  }

  // 重置页码
  const resetPagination = () => {
    state.pagination.current_page = 1;
  }


  // 查询
  const queryCompanyList = async () => {
    let payload = {
      ...state.pagination,
      company_name: state.search.company_name
    };
    let res = await getcompanyList(payload);
    if (res.code === 200) {
      const { list, ...pagination } = res.data;
      state.list = list;
      state.pagination = pagination;
    }
  }


  // 刷新
  const refresh = () => {
    queryCompanyList();
  }

  // 搜索
  const handleSearch = () => {
    resetPagination();
    queryCompanyList();
  }

  // 新增
  const handleCreate = () => {
    state.dialogStatus = 'create';
    state.DialogVisible = true;
    state.dialogTitle = '新增公司信息';
  }

  // 编辑
  const handleEdit = (row) => {
    state.temp = Object.assign({}, row);
    state.dialogStatus = 'update';
    state.DialogVisible = true;
    state.dialogTitle = '修改公司信息';
  }

  // 弹窗关闭
  const handleClose = () => {
    state.dialogStatus = '';
    state.DialogVisible = false;
    state.dialogTitle = '';
    dataForm.value.resetFields();
    resetTemp();
  }

  // 滑块控制启用与关闭
  const changeSwitch = async (row) => {
    await changeCompanyStatus(row).then(res => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      }
    }).catch(() => {
      queryCompanyList();
    });

  }

  // 创建数据
  const createData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        await addCompany(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            queryCompanyList();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          queryCompanyList();
        })
      }
    });
  }

  // 修改数据
  const updateData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        await editCompany(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            queryCompanyList();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          queryCompanyList();
        })
      }
    })
  }


  // 删除
  const handleDelete = (index) => {
    let item = state.list[index];
    ElMessageBox.confirm(`是否删除公司 ${item.company_name} ？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteCompany(item).then(res => {
        if (res.code === 200) {
          queryCompanyList();
          ElMessage.success(res.msg);
        }
      }).catch(() => {
        queryCompanyList();
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
    changeSwitch,
    handleEdit,
    handleDelete,
    resetPagination,
    queryCompanyList,
    handleClose,
    createData,
    updateData,
    resetTemp,

  }
}