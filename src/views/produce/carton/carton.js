import { reactive, toRefs, ref } from 'vue'
import { getCartonList, exportExcel } from '@/api/produce/carton';
import { newDataTime} from "@/utils/export2Excel";
import { ElMessage } from "element-plus";

export default function ()
{
    const dataForm = ref(null);
    const resetForm = ref(null);
    const state = reactive({
        statusOptions: {
            0:   "待上传",
            100: "上传中",
            200: "已上传",
            500: "上传异常"
        },
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
            carton_code: "",
            doc_no: "",
            sku_no: "",
            lot_no: "",
            filling_no: ""
        },
        form: {
            doc_no: "",
        },
        rules: {
            doc_no: [{ required: true, message: "请输入工单号", trigger: "blur" }],
        },
        dialogFormVisible: false
    })

    // 查询
    const queryCartonList = async() =>
    {
        let search = {
            ...state.pagination,
            ...state.search
        };
        const result = await getCartonList(search)
        if (result.code === 200)
        {
            const { list, ...pagination } = result.data
            state.list = list;
            state.pagination = pagination;
        }
    }

    // 重置页码
    const resetPagination = () =>
    {
        state.pagination.current_page = 1;
    }

    // 搜索
    const handleSearch = () =>
    {
        resetPagination();
        queryCartonList()
    }

    // 弹窗关闭事件
    const handleClose = () =>
    {
        state.dialogFormVisible = false;
    }

    // 导出外箱数据
    const getExportExcel = async () =>
    {
        if (!state.search.doc_no)
        {
            ElMessage.error('请输入工单号之后再导出');
            return false;
        }
        let search = {
            ...state.pagination,
            ...state.search
        };
        await exportExcel(search).then(res =>
        {
            if (!res) {
                return false;
            }

            const fileName = '外箱数据' + newDataTime();
            let blob = new Blob([res], { type: 'application/ms-excel;charset=utf-8' });
            let href = window.URL.createObjectURL(blob);
            let downloadElement = document.createElement('a');
            downloadElement.href = href;
            downloadElement.download = fileName + '.xlsx';
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
        })
    }

    return { dataForm, ...toRefs(state), resetForm, handleClose, queryCartonList, handleSearch, getExportExcel }
}