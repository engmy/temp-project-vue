
import { reactive, toRefs, ref } from 'vue'
// import { getList } from '@/api/produce/checkdata';
import { getWorkDocList } from '@/api/workdoc/workdocmanageapi';
import { getSiteListByComPk } from '@/api/basic/site';

export default function () {
  const dataForm = ref(null);
  const resetForm = ref(null);
  const state = reactive({
    pagination: {
      current_page: 1,
      page_size: 10,
    },
    list: [],
    selectData: [],
    search:
    {
      site_no: "",
      startime: "",
      endtime: ""
    },
    siteSearchList: [],
  })

  // 时间转换函数
  function conversionTime(d) {
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  // 查询
  async function queryList() {
    state.search.startime = state.selectData.length > 1 ? conversionTime(state.selectData[0]) : null,
      state.search.endtime = state.selectData.length > 1 ? conversionTime(state.selectData[1]) : null

    let payload = {
      ...state.pagination,
      ...state.search,
      site_no: state.search.site_no === '0' ? null : state.search.site_no,
    };
    
    const result = await getWorkDocList(payload);

    if (result.code === 200) {
      const { list, ...pagination } = result.data
      state.list = list;
      state.pagination = pagination;
    }

    // let search =
    // {
    //   ...state.pagination,
    //   ...state.search
    // };

    // const result = await getList(search)
    // if (result.code === 200) {
    //   const { list, ...pagination } = result.data
    //   state.list = list;
    //   state.pagination = pagination;
    // }
  }

  // 重置页码
  const resetPagination = () => {
    state.pagination.current_page = 1;
  }

  // 搜索
  const handleSearch = () => {
    resetPagination();
    queryList();
  }

  const changeData = () => {
    queryList();
  }

  // 重置日期组件
  const resetBtn = () => {
    state.selectData = '';
    handleSearch();
  }

  // 获取工厂
  const getSiteList = async () => {
    if (state.siteSearchList.length !== 0) {
      return;
    }

    getSiteListByComPk().then(res => {
      if (res.code === 200) {
        state.siteSearchList = res.data;
      }
    })
  }

  return { ...toRefs(state), dataForm, resetForm, queryList, handleSearch, changeData, resetBtn, getSiteList }
}