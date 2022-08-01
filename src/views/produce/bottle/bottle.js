import { reactive, toRefs, ref } from 'vue'
import { getBottleExcelList, getBottleList } from "@/api/produce/bottle";
import { newDataTime } from "@/utils/export2Excel";
import { ElMessage } from "element-plus";

export default function () {
    const dataForm = ref(null);
    const resetForm = ref(null);
    const state = reactive({
        statusOptions: {
            0: "待上传",
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
            item_code: "",
            carton_code: "",
            pallet_code: "",
            doc_no: "",
            sku_no: "",
            lot_no: "",
            filling_no: ""
        },
        checkIdList: []
    })

    // 查询
    const queryBottleList = async () => {
        let search = {
            ...state.pagination,
            ...state.search
        };
        const result = await getBottleList(search)
        if (result.code === 200) {
            const { list, ...pagination } = result.data
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
        queryBottleList()
    }

    const detialexportExcel = async () =>
    {
        if (state.search.doc_no.length > 0)
        {
            let search = {
                ...state.paginationExel,
                ...state.search,
            };
            await getBottleExcelList(search).then(res =>
            {
                if (!res) {
                    return false;
                }

                const fileName = '单品数据导出' + newDataTime();
                let blob = new Blob([res], { type: 'application/ms-excel;charset=utf-8' });
                let href = window.URL.createObjectURL(blob);
                let downloadElement = document.createElement('a');
                downloadElement.href = href;
                downloadElement.download = fileName + '.xlsx';
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);
                window.URL.revokeObjectURL(href);

            }).catch(() => {
                ElMessage.error("导出失败");
            })
        } else {
            ElMessage.error("请输入工单号之后再导出");
            return;
        }
    }
    return { dataForm, ...toRefs(state), resetForm, queryBottleList, handleSearch, detialexportExcel }
}