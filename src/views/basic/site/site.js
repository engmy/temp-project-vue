import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getSiteList, addSite, changeSiteStatus, editSite, deleteSite } from '@/api/basic/site';

export default function () {
  const dataForm = ref(null);
  const state = reactive({
    search: {
      site_name: ''
    }, //搜索关键字
    pagination: {
      current_page: 1,
      page_size: 10,
    },
    list: [], //展示的数据
    temp: {
      site_no: '',
      site_name: '',
      city: '',
      area: '',
      contact_person: '',
      phone: '',
      remarks: '',
      status: 1,
      company_no: ''
    },
    statusOptions: {
      1: '正常',
      2: '禁用'
    },
    dialogTitle: '',
    DialogVisible: false,
    dialogStatus: '',
    rules: {
      site_no: [{ required: true, message: "工厂编号不能为空" }, { validator: checkSiteNo, trigger: "blur" }],
      site_name: [{ required: true, message: "工厂名称不能为空", trigger: "blur" }],
      company_no: [{ required: true, message: "公司不能为空", trigger: "blur" }],
      status: [{ required: true, message: "该项不能为空", trigger: "blur" }],
      phone: [{ validator: checkPhone, trigger: "blur" }],
    },
    companyList: [], //公司列表
    oldSiteNo: '', //原工厂编号
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

  function checkSiteNo(rule, value, callback) {
    if (value) {
      if (state.dialogStatus === 'update' && state.oldSiteNo !== value) {
        return callback(new Error("禁止修改工厂编号"));
      } else {
        return callback();
      }
    } else {
      return callback(new Error("工厂编号不能为空"));
    }
  }

  // 重置表单提交数据
  const resetTemp = () => {
    state.temp = {
      site_no: '',
      site_name: '',
      city: '',
      area: '',
      contact_person: '',
      phone: '',
      remarks: '',
      status: 1,
      company_no: ''
    }
  }

  // 重置页码
  const resetPagination = () => {
    state.pagination.current_page = 1;
  }


  // 查询
  const querySiteList = async () => {
    let payload = {
      ...state.pagination,
      site_name: state.search.site_name
    };
    state.list = [];

    let res = await getSiteList(payload);

    if (res.code === 200) {
      const { list, ...pagination } = res.data;
      state.list = list;
      state.pagination = pagination;
    }
  }


  // 刷新
  const refresh = () => {
    querySiteList();
  }

  // 搜索
  const handleSearch = () => {
    resetPagination();
    querySiteList();
  }

  // 新增
  const handleCreate = () => {
    state.dialogStatus = 'create';
    state.DialogVisible = true;
    state.dialogTitle = '新增工厂信息';
  }

  // 编辑
  const handleEdit = (row) => {
    state.temp = Object.assign({}, row);
    state.oldSiteNo = state.temp.site_no;
    state.dialogStatus = 'update';
    state.DialogVisible = true;
    state.dialogTitle = '修改工厂信息';
  }

  // 弹窗关闭
  const handleClose = () => {
    state.dialogStatus = '';
    state.DialogVisible = false;
    state.dialogTitle = '';
    state.oldSiteNo = '';
    dataForm.value.resetFields();
    resetTemp();
  }

  // 滑块控制启用与关闭
  const changeSwitch = async (row) => {
    await changeSiteStatus(row).then(res => {
      if (res.code === 200) {
        querySiteList();
        ElMessage.success(res.msg);
      }
    }).catch(() => {
      querySiteList();
    })

  }


  // 创建数据
  const createData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        await addSite(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            querySiteList();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          querySiteList();
        })
      }
    });
  }

  // 修改数据
  const updateData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        await editSite(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            querySiteList();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          querySiteList();
        })

      }
    })
  }


  // 删除
  const handleDelete = (index) => {
    let item = state.list[index];
    ElMessageBox.confirm(`是否删除工厂 ${item.site_name} ？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteSite(item).then(res => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          querySiteList();
        }
      }).catch(() => {
        querySiteList();
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
    querySiteList,
    handleClose,
    createData,
    updateData,
    resetTemp,

  }
}