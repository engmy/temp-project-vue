import { reactive, toRefs, ref } from 'vue'
import { getList } from '@/api/produce/product';
import {arrayToExcel, formatJson} from "@/utils/export2Excel";

export default function () {
  const dataForm = ref(null);
  const resetForm = ref(null);
  const state = reactive({
    pagination: {
      current_page: 1,
      page_size: 10,
    },
    paginationExel: {
      current_page: 1,
      page_size: 10000,
    },
    list: [],
    search: {
      doc_no: ""
    },
    dialogStatus: "",
    dialogFormVisible: false,
    temp: {
      response: ''
    },
    httpOptation: {
      0: "待上传",
      100: "上传中",
      200: "已上传",
      500: "上传异常"
    },
  })

  // 查询
  async function queryList()
  {
    let search = {
      ...state.pagination,
      ...state.search
    };
    const result = await getList(search)
    if (result.code === 200)
    {
      const { list, ...pagination } = result.data

     // let newList = [];
      // // 将json数组json数组化
      // let jsonList = list.map((e) => {
      //   return eval("(" + e.data_json + ")")
      // })
      // 重新制作数组对象
      list.map(((item) =>
      {
        item.httptxt = state.httpOptation[item.http_status];
       // newList.push(Object.assign({}, item, jsonList[index]))
      }))

      state.list = list;
      state.pagination = pagination;
    }
  }
  // 重置页码
  const resetPagination = () => {
    state.pagination.current_page = 1;
  }

  // 搜索
  const handleSearch = () => {
    resetPagination();
    queryList()
  }

  // 刷新
  const refresh = () => {
    queryList();
  };

  const detialexportExcel = async () => {
    let search = {
      ...state.paginationExel,
      ...state.search,
    };
    const result = await getList(search)
    let list = [];
    if (result.code === 200)
    {
       list = result.data.list
    }


    list.map(((item) =>
    {
      item.httptxt = state.httpOptation[item.http_status];
      //newList.push(Object.assign({}, item, jsonList[index]))
    }))
    var tHeader = ['工单号', '工厂代码', '品牌代码', '产品编码', '产线代码'
      , '生产批次', '生产时间', '上传状态', '更新人', '更新时间'];
    var filterVal = ['doc_no', 'site_no', 'brand_no', 'sku_no','pline_no'
      ,'lot_no','mfg_time','httptxt','update_user','update_time'];


    var filename = '中台数据'
    var data = formatJson(filterVal, list)
    arrayToExcel({
      header: tHeader,
      data,
      filename
    })
  }
  return { ...toRefs(state), dataForm, resetForm, queryList, refresh, handleSearch,detialexportExcel }
}