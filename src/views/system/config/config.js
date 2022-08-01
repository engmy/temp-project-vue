import { reactive, toRefs, ref } from 'vue'
import { getConfigList, getConfigData, updateConfigData, insertConfigData, deleteConfigData } from '@/api/system/sysconfig';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useStore } from "vuex";
import _ from 'lodash';

export default function () {
  const store = useStore();
  const dataForm = ref(null);
  const state = reactive({
    configList: [], //配置列
    group_id: 1, // 需要加载的数据id
    dataList: [], //获取的详细数据展示
    dialogTitle: '',  //弹出层标题
    dialogStatus: '', // 弹出层类型 
    dialogFormVisible: false,
    // 添加配置的提交数据
    temp: {
      config_id: '',
      config_name: '',
      config_key: '',
      config_value: '',
      config_type: '',
      group_id: '',
      remark: ''
    },
    // 用来与需要提交的信息做对比、
    old_data: [],
    typeList: [
      { typeId: 'Y', typeName: '系统内置' },
      { typeId: 'N', typeName: '自定义' },
    ],
    rules: {
      config_name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
      config_key: [{ required: true, message: "请输入参数键名", trigger: "blur" }],
      config_value: [{ required: true, message: "请输入参数键值", trigger: "blur" }],
      config_type: [{ required: true, message: "请选择参数类型", trigger: "blur" }],
    },

  })

  // 加载列表
  const queryConfigList = async () => {
    state.configList = [];
    state.group_id = 1;
    await getConfigList().then(res => {
      if (res.code == 200) {
        state.configList.push(...res.data);
        state.group_id = state.configList[0].code;
        querConfigData();
      }
    }).catch(() => {
      querConfigData();
    })

  }

  // 加载数据
  const querConfigData = async () => {
    let data = {
      group_id: state.group_id
    }
    state.dataList = [];
    let res = await getConfigData(data);
    state.dataList.push(...res.data);
    if (data.group_id === 1) {
      // 如果是修改系统配置信息的 则刷新vuex中保存的系统信息
      store.dispatch("app/addConfig", Object.assign({}, res.data)); //避免数据污染 这里进行一个深拷贝
    }
    if (data.group_id === 3) {
      state.old_data = _.cloneDeep(res.data);
    }

  }

  // 切换tabs页
  const handleClick = (row) => {
    state.group_id = state.configList[row.index].code;
    querConfigData();
  }

  // 刷新
  const refresh = () => {
    querConfigData();
  }

  // 重置配置数据
  const resetTemp = () => {
    state.temp = {
      config_id: '',
      config_name: '',
      config_key: '',
      config_value: '',
      config_type: '',
      group_id: '',
      remark: ''
    };
    state.dialogTitle = "";
    state.dialogStatus = "";
    state.dialogFormVisible = false;
    dataForm.value.resetFields();
  }

  // 新建配置
  const handleCreate = (item) => {
    state.dialogFormVisible = true;
    state.dialogTitle = "新增" + item.info;
    state.dialogStatus = item.code;
    state.temp.group_id = item.code;
  }

  // 弹窗关闭事件
  const handleClose = () => {
    resetTemp();
  }

  // 新增提交事件
  const createData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        await insertConfigData(state.temp).then(res => {
          if (res.code === 200) {
            state.dialogFormVisible = false;
            querConfigData();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          querConfigData();
        })
      }
    });
  }

  // 提交修改事件
  const submitBtn = async () => {
    // 检查一下 是不是存在空值 若存在 则不允许提交
    let flage = state.dataList.filter(item => item.config_value.length <= 0);
    if (flage.length >= 1) {
      ElMessage.warning(flage[0].config_name + " 不能为空");
      return false;
    }
    // 企业编号不能修改 做限制判断
    if (state.group_id === 3) {
      // 企业信息的修改 处理数组 获取新的对象
      let state_temp = state.dataList.filter(p => p.config_key === "company_no").map(p => {
        return p.config_value
      })
      // 获取原数据的编号
      let old_temp = state.old_data.filter(p => p.config_key === "company_no").map(p => {
        return p.config_value
      })
      if (old_temp[0] !== state_temp[0]) {
        ElMessage.warning("禁止修改企业编号");
        return false;
      }
    }

    // 正确 开始修改操作
    let res = await updateConfigData(state.dataList);
    if (res.code === 200) {
      ElMessage.success(res.msg);
      querConfigData();
    }
  }

  // 配置删除按钮
  const deletebtn = (item) => {
    ElMessageBox.confirm(`是否删除配置 ${item.config_name} ？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let res = await deleteConfigData(item.config_id);
      if (res.code === 200) {
        ElMessage.success(res.msg)
        querConfigData();
      }
    }).catch(() => {
      console.log('已取消删除');
    })
  }

  return {
    ...toRefs(state),
    dataForm,
    queryConfigList,
    handleClick,
    querConfigData,
    refresh,
    handleCreate,
    submitBtn,
    resetTemp,
    handleClose,
    createData,
    deletebtn
  }
}