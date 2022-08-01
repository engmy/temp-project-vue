import { reactive, toRefs, ref } from 'vue'
import { getProductLogList } from '@/api/log/middlelog';

export default function ()
{
    const dataForm = ref(null);
    const resetForm = ref(null);
    const state = reactive({
        pagination: {
            current_page: 1,
            page_size: 10,
        },
        list: [],
        search: {
            title: "",
            status: ""
        },
        dialogTitleMap: {
            details: "详情",
            update: "修改日志",
            create: "添加日志",
        },
        statusList: [
            { key: "", label: "请选择" },
            { key: "1", label: "成功" },
            { key: "2", label: "失败" }
        ],
        statusOptions: {
            "" : "请选择",
            "1" : "成功",
            "2" : "失败"
        },
        dialogStatus: "",
        dialogFormVisible: false,
        selectData: [],
        temp: {
            response:''
        }
    })

    // 查询用户
    async function queryProductLogList()
    {
        state.search.startime = state.selectData.length > 1 ? conversionTime(state.selectData[0]) : null,
            state.search.endtime  = state.selectData.length > 1 ? conversionTime(state.selectData[1]) : null
        let search = {
            ...state.pagination,
            ...state.search
        };
        const result = await getProductLogList(search)
        if (result.code === 200)
        {
            const { list, ...pagination } = result.data
            state.list = list;
            state.pagination = pagination;
        }
    }

    // 时间转换函数
    function conversionTime(d)
    {
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }
    // 重置日期组件
    const resetBtn = () =>
    {
        state.selectData = '';
        handleSearch();
    }
    // 重置页码
    const resetPagination = () =>
    {
        state.pagination.current_page = 1;
    }

    // 切换页码
    const handleCurrentChange = (pageNo) =>
    {
        state.pagination.current_page = pageNo;
        queryProductLogList();
    };

    // 搜索
    const handleSearch = () =>
    {
        resetPagination();
        queryProductLogList()
    }

    // 刷新
    const refresh = () =>
    {
        queryProductLogList();
    };

    const handleDetial = (row) =>
    {
        state.temp = Object.assign({}, row);
        state.dialogStatus = "details";
        state.dialogFormVisible = true;
    };

    return { ...toRefs(state), dataForm, resetForm, queryProductLogList, refresh, handleSearch, handleCurrentChange, handleDetial,resetBtn }
}