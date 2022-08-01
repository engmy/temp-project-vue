import { reactive, toRefs, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import _ from 'lodash';
import { getMaterialList, deleteMaterial, addMaterial, editMaterial, uploadData, dowload, getRelationType } from '@/api/basic/material';
import { getBrandListOnSiteId } from '@/api/basic/brand';
import { getCategoryTree } from '@/api/basic/category';
import { getPlineSpecs } from '@/api/basic/pline';
import { getSiteListByComPk } from '@/api/basic/site';
// 引入导出Excel表格依赖
import { arrayToExcel } from '@/utils/export2Excel'
import { checkNumber } from "@/utils";

export default function () {
  const dataForm = ref(null);
  const uploadRef = ref(null);
  const state = reactive({
    search: {
      sku_no: '',
      site_no: '',
    }, //搜索关键字
    pagination: {
      current_page: 1,
      page_size: 10,
    },
    list: [], //展示的数据
    dialogTitle: '',
    DialogVisible: false,
    dialogStatus: '',
    temp: {
      sku_no: '',
      sku_desc: '',
      sku_spec: '',
      carton_unit: '',
      pallet2carton: 0,
      gross_weight: 0,
      net_weight: 0,
      brand_pk: '',
      category_pk: '',
      brand_no: '',
      bar_code: '',
      carton2item: 0,//外箱里有几个单品
      box2item: 0,//内包装里有几个单品
      item_unit: '',
      pline_specs: '', //产线规格
      site_pk: '', // 工厂id
      site_no: '', // 工厂编号
      relation_type: '',
    },
    // 规格列表
    skuSpecList: [],
    cartonUnitList: [],
    rules: {
      sku_no: [
        { required: true, message: "产品编号不能为空", trigger: "blur" },
        { validator: checkMaterialNo, trigger: "blur" }
      ],
      customer_sku_no: [
        { required: true, message: "客户产品编号不能为空", trigger: "blur" },
      ],
      sku_desc: [{ required: true, message: "产品名称不能为空", trigger: "blur" }],
      sku_spec: [{ required: true, message: "产品规格不能为空", trigger: "blur" }],
      carton_unit: [{ required: true, message: "外箱单位不能为空", trigger: "blur" }],
      pallet2carton: [
        { required: true, message: "整盘外箱数不能为空", trigger: "change" },
        { validator: checkNumber, trigger: "blur" }
      ],
      gross_weight: [
        { required: true, message: "产品毛重不能为空", trigger: "change" },
        { validator: checkNumber, trigger: "blur" }
      ],
      net_weight: [
        { required: true, message: "产品净重不能为空", trigger: "change" },
        { validator: checkNumber, trigger: "blur" }]
      ,
      category_pk: [{ required: true, message: "产品分类不能为空", trigger: "change" }],
      brand_pk: [{ required: true, message: "请选择品牌", trigger: "change" }],
      site_pk: [{ required: true, message: "请选择工厂", trigger: "change" }],
      bar_code: [{ required: true, message: "商品码不能为空", trigger: "blur" }],
      item_unit: [{ required: true, message: "单品单位不能为空", trigger: "blur" }],
      carton2item: [{
        required: true, message: "外箱单品数不能为空", trigger: "change"
      },
      { validator: checkNumber, trigger: "blur" }
      ],
      box2item: [
        { required: true, message: "内箱单品数不能为空", trigger: "change" },
        { validator: checkNumber, trigger: "blur" }
      ],
      pline_specs: [{ required: true, message: "请选择产线规格", trigger: "change" }],
      relation_type: [{ required: true, message: "请选择包装关系", trigger: "change" }]
    },
    DialogVisibleUpload: false, // 上传组件 是否打开
    fileList: [], // 文件上传的列表
    siteList: [], // 工厂列表
    brandList: [], // 品牌列表
    categoryList: [], // 分类列表
    oldMaterialNo: '',
    siteSearchList: [],
    relationList: [], // 包装信息
    show_item_unit: true, // 单品单位
    show_carton_unit: false, // 显示外箱单位
    show_carton2item: false, // 显示箱含量
    show_pallet2carton: false, // 显示箱托规格
    show_disabled: false, //包装选择框是否禁用
  })

  function checkMaterialNo(rule, value, callback) {
    if (value) {
      if (state.dialogStatus === 'update' && state.oldMaterialNo !== value) {
        return callback(new Error("禁止修改产品编号"));
      } else {
        return callback();
      }
    } else {
      return callback(new Error("产品编号不能为空"));
    }
  }

  // 重置页码
  const resetPagination = () => {
    state.pagination.current_page = 1;
  }

  const resetTemp = () => {
    state.temp = {
      sku_no: '',
      sku_desc: '',
      sku_spec: '',
      carton_unit: '',
      pallet2carton: 0,
      gross_weight: 0,
      net_weight: 0,
      brand_pk: '',
      category_pk: '',
      brand_no: '',
      bar_code: '',
      carton2item: 0,//外箱里有几个单品
      box2item: 0,//内包装里有几个单品
      item_unit: '',
      pline_specs: '', //产线规格
      site_pk: '', // 工厂id
      site_no: '', // 工厂编号
      relation_type: '',
    }
  }

  // 查询
  const queryList = async () => {
    let payload = {
      ...state.pagination,
      sku_no: state.search.sku_no,
      site_no: state.search.site_no === '0' ? null : state.search.site_no
    };
    let res = await getMaterialList(payload);
    if (res.code === 200) {
      const { list, ...pagination } = res.data;
      state.list = list;
      state.pagination = pagination;
    }
  }

  // 搜索
  const handleSearch = () => {
    resetPagination();
    queryList();
  }

  // 选中删除
  const handleDelete = (item) => {
    ElMessageBox.confirm(`是否删除产品 ${item.sku_desc} ？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteMaterial({ id: item.material_id }).then(res => {
        if (res.code === 200) {
          queryList();
          ElMessage.success(res.msg);
        }
      }).catch(() => {
        queryList();
      })
    }).catch(() => {
      console.log('已取消删除');
    })
  }

  // 弹窗关闭
  const handleClose = () => {
    state.dialogStatus = '';
    state.DialogVisible = false;
    state.dialogTitle = '';
    state.oldMaterialNo = '';
    state.brandList = [];
    state.categoryList = [];
    dataForm.value.resetFields();
    resetTemp();
  }

  // 新增
  const handleCreate = () => {
    state.dialogStatus = 'create';
    state.DialogVisible = true;
    state.dialogTitle = '新增产品信息';
    state.show_disabled = false;
    getList();
    getRelation();
  }

  // 编辑
  const handleEdit = (row) => {
    state.temp = Object.assign({}, row);
    state.dialogStatus = 'update';
    state.DialogVisible = true;
    state.oldMaterialNo = row.sku_no;
    state.dialogTitle = '修改产品信息';
    if(state.temp.relation_type === undefined || state.temp.relation_type === 0){
      state.show_disabled = false;
    }else{
      state.show_disabled = true;
    }
    
    getList();
    getRelation();
    getCategory(state.temp.brand_pk);
  }

  const getRelation = async () => {
    await getRelationType().then(res => {
      if (res.code === 200) {
        state.relationList = res.data;
      }
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

  const getList = async () => {
    if (state.dialogStatus === 'update') {
      await getBrandListOnSiteId({ siteId: state.temp.site_pk }).then(res => {
        if (res.code === 200) {
          state.brandList = res.data;
        }
      });
    }
    getSiteList();

    //获取产线规格
    await getPlineSpecs().then(res => {
      let _id = 0;
      state.skuSpecList = res.data.filter(p => p !== null).map(p => {
        let obj = {};
        obj.Id = _id++;
        obj.skuSpecName = p.pline_specs;
        return obj;
      })
    })
  }
  // 创建数据
  const createData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        if (state.temp.category_pk === "" || state.temp.category_pk - 0 === 0) {
          ElMessage.warning('选择的分类无效 请重新选择');
          return;
        }
        await addMaterial(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            queryList();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          queryList();
        })
      }
    });
  }

  // 为了做下拉框绑定多个值 品牌
  const changeSelect = (item) => {
    state.brandList.map(p => {
      if (p.brand_id === item) {
        state.temp.brand_no = p.brand_no;
        return;
      }
    })
    getCategory(item);
  }

  const getCategory = async (item) => {
    let pyload = {
      brand_pk: item,
      site_pk: state.temp.site_pk
    }
    // 调用
    state.categoryList = [];
    //获取分类树结构
    await getCategoryTree(pyload).then(result => {
      if (result.code === 200) {
        let res = result.data.map(p => {
          let new_data = _.cloneDeep(p);
          new_data.name = p.category_name;
          new_data.id = p.category_id;
          return new_data;
        })
        state.categoryList = _.cloneDeep(res);
      }
    })
  }

  // 修改数据
  const updateData = () => {
    dataForm.value.validate(async (valid) => {
      if (valid) {
        if (state.temp.category_pk === "" || state.temp.category_pk - 0 === 0) {
          ElMessage.warning('选择的分类无效 请重新选择');
          return;
        }
        state.temp.id = state.temp.material_id;
        await editMaterial(state.temp).then(res => {
          if (res.code === 200) {
            handleClose();
            queryList();
            ElMessage.success(res.msg);
          }
        }).catch(() => {
          queryList();
        })
      }
    })
  }

  // 文件上传按钮点击
  const upload = () => {
    state.DialogVisibleUpload = true;
  }

  const UploadUrl = () => {
    // 因为action参数是必填项，我们使用二次确认进行文件上传时，
    //直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
    return "";
  }

  // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
  const beforeUploadFile = (file) => {
    let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
    let size = file.size / 1024 / 1024;
    if (extension !== "xlsx" && extension !== "xls") {
      ElMessage.warning("只能上传后缀是.xlsx或.xls的文件");
      return false;
    }
    if (size > 10) {
      ElMessage.warning("文件大小不得超过10M");
      return false;
    }

  }

  // 确认上传
  const submitUpload = () => {
    if (uploadRef.value.uploadFiles.length <= 0) {
      ElMessage.warning("请选择需要上传的文件！")
      return false;
    }
    uploadRef.value.submit();
  }

  // 上传到服务器方法  自定义上传方法，param是默认参数，可以取得file文件信息
  const uploadHttpRequest = async (param) => {
    const fileObj = param.file
    const formData = new FormData()
    formData.append('file', fileObj)
    await uploadData(formData).then(res => {
      if (res.code === 200) {
        state.DialogVisibleUpload = false;
        state.fileList = [];
        uploadRef.value.clearFiles(); //清空已上传的文件列表
        handleSearch();
        ElMessage.success(res.msg)
      }
    })
  }

  // 模板下载
  const download = async () => {
    await dowload().then(response => {
      if (!response) {
        return false;
      }
      const fileName = '产品导入模板';
      let blob = new Blob([response], { type: 'application/ms-excel;charset=utf-8' });
      let downloadElement = document.createElement('a');
      let href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = fileName + '.xlsx';
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);
    })
  }

  const changeSiteSelect = async (row) => {
    state.siteList.map(p => {
      if (p.site_id === row) {
        state.temp.site_no = p.site_no;
      }
    })
    state.brandList = [];
    state.temp.brand_pk = '';
    // 获取品牌列表
    await getBrandListOnSiteId({ siteId: row }).then(res => {
      if (res.code === 200) {
        state.brandList = res.data;
      }
    });
  }

  //定义导出Excel表格事件
  const exportExcel = async () => {
    // 加载后台的数据
    let payload = {
      current_page: 1,
      page_size: 6000000, // 设置无穷大的数据
      sku_no: state.search.sku_no,
      site_no: state.search.site_no === '0' ? null : state.search.site_no
    };
    let res = await getMaterialList(payload);
    if (res.code === 200) {
      let listData = res.data.list;
      require.ensure([], () => {
        const header =
          ['产品编号', '产品名称', '产品分类', '产品规格', '产线规格', '外包装单位', '箱含量', '箱托规格', '品牌', '净重', '毛重', '更新人', '更新时间'
          ];

        const filterVal =
          ['sku_no', 'sku_desc', 'category_name', 'sku_spec', 'pline_specs', 'carton_unit', 'carton2item', 'pallet2carton', 'brand_name', 'net_weight', 'gross_weight', 'update_user', 'update_time'
          ];

        const data = formatJson(filterVal, listData);

        let filename = '物料信息导出';

        arrayToExcel({
          header, data, filename
        });

      })
    }
  }

  const formatJson = (filterVal, jsonData) => {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }

  // 切换包装关系
  const changeRelation = (item) => {
    /**
     *1.单瓶包装
      2.瓶箱包装
      3.箱托包装
      4.瓶箱托包装
     */
    if (item === 1) {
      state.show_item_unit = true;
      state.show_carton_unit = false;
      state.show_carton2item = false;
      state.show_pallet2carton = false;
    } else if (item === 2) {
      state.show_item_unit = true;
      state.show_carton_unit = true;
      state.show_carton2item = true;
      state.show_pallet2carton = false;
    } else if (item === 3) {
      state.show_item_unit = false;
      state.show_carton_unit = true;
      state.show_carton2item = true;
      state.show_pallet2carton = true;
    } else if (item === 4) {
      state.show_item_unit = true;
      state.show_carton_unit = true;
      state.show_carton2item = true;
      state.show_pallet2carton = true;
    }
    // 切换时也更新表单的验证信息
    //dataForm.value.resetFields();
  }

  return {
    ...toRefs(state), dataForm, resetPagination, queryList, handleSearch, handleCreate, getSiteList,
    handleEdit, handleDelete, handleClose, createData, updateData, upload, beforeUploadFile, UploadUrl, submitUpload, uploadRef, uploadHttpRequest, download, changeSelect, changeSiteSelect, exportExcel, changeRelation
  }
}