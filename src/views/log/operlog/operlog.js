import { reactive, toRefs, ref } from 'vue'
import { getOperLogList} from '@/api/log/operationlog';

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
            status: "",
            create_user: "",
            business_type: ""
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
        typeList:  [
            { key: "", label: "请选择" },
            { key: "0", label: "其它" },
            { key: "1", label: "新增" },
            { key: "2", label: "修改" },
            { key: "3", label: "删除" },
            { key: "4", label: "授权" },
            { key: "5", label: "导出" },
            { key: "6", label: "强退" },
            { key: "7", label: "生成代码" },
            { key: "8", label: "清空数据" }
        ],
        typeOptions: {
            "0": "其它",
            "1": "新增",
            "2": "修改",
            "3": "删除",
            "4": "授权",
            "5": "导出",
            "6": "强退",
            "7": "生成代码",
            "8": "清空数据"
        },
        selectData: [],
        dialogStatus: "",
        dialogFormVisible: false,
        temp: {
            response:''
        }
    })

    // 查询用户
    async function queryOperLogList()
    {
        state.search.startime = state.selectData.length > 1 ? conversionTime(state.selectData[0]) : null,
            state.search.endtime  = state.selectData.length > 1 ? conversionTime(state.selectData[1]) : null
        let search = {
            ...state.pagination,
            ...state.search
        };
        const result = await getOperLogList(search)
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

    // 切换页码
    const handleCurrentChange = (pageNo) =>
    {
        state.pagination.current_page = pageNo;
        queryOperLogList();
    };

    // 搜索
    const handleSearch = () =>
    {
        resetPagination();
        queryOperLogList()
    }

    // 刷新
    const refresh = () =>
    {
        queryOperLogList();
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
    return { ...toRefs(state), dataForm, resetForm, queryOperLogList, refresh, handleSearch, handleCurrentChange, handleDetial ,resetBtn}
}