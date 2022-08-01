import { reactive, toRefs, ref } from 'vue'
import { getApiLogList } from '@/api/log/apilog';

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
        statusList: [
            { key: "",  label: "请选择" },
            { key: "1", label: "成功" },
            { key: "2", label: "失败" }
        ],
        statusOptions: {
            "" : "请选择",
            "1" : "成功",
            "2" : "失败"
        },
        checkIdList: [],
        selectData: [],
        dialogTitleMap: {
            details: "详情",
            update: "修改日志",
            create: "添加日志",
        },
        dialogStatus: "",
        dialogFormVisible: false,
        temp: {
            title: "",
            action: "",
            params: "",
            error_msg: "",
            create_user:  "",
            create_time: ''
        }
    })

    // 查询用户
    async function queryInterFaceList()
    {
         state.search.startime = state.selectData.length > 1 ? conversionTime(state.selectData[0]) : null,
            state.search.endtime  = state.selectData.length > 1 ? conversionTime(state.selectData[1]) : null

        let search = {
            ...state.pagination,
            ...state.search,
        };
        const result = await getApiLogList(search)
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
    // 重置页码
    const resetPagination = () =>
    {
        state.pagination.current_page = 1;
    }

    // 记录选中
    const handleSelectionChange = (val) =>
    {
        let ids = val.map((e) => e.user_id)
        state.checkIdList = ids;
    }

    // 搜索
    const handleSearch = () =>
    {
        resetPagination();
        queryInterFaceList()
    }

    // 刷新
    const refresh = () =>
    {
        queryInterFaceList();
    };

    const handleDetial = (row) =>
    {
        state.temp = Object.assign({}, row);
        state.dialogStatus = "details";
        state.dialogFormVisible = true;
    };

    // 重置日期组件
    const resetBtn = () =>
    {
        state.selectData = '';
        handleSearch();
    }

    return { ...toRefs(state), dataForm, resetForm, queryInterFaceList, refresh, handleSearch, handleDetial, handleSelectionChange ,resetBtn}
}