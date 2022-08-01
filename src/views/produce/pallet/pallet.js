import { reactive, toRefs, ref } from 'vue'
import { deletePallet, getPalletDetial, getPalletList, getPalletExcel } from '@/api/produce/pallet';
import { elMessage, ElMessageBox } from "element-plus";
import { newDataTime } from "@/utils/export2Excel";

export default function () {
    const theTable = ref(null);
    const dataForm = ref(null);
    const resetForm = ref(null);
    const state = reactive({
        dialogFormVisible: false,
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
        palletList: [],
        cartonList: [],
        search: {
            pallet_code: "",
            doc_no: "",
            sku_no: "",
            lot_no: "",
            filling_no: ""
        },
        checkIdList: []
    })

    // 查询
    const queryPalletList = async () => {
        let search = {
            ...state.pagination,
            ...state.search
        };
        const result = await getPalletList(search)
        if (result.code === 200) {
            const { list, ...pagination } = result.data
            state.palletList = list;
            state.pagination = pagination;
        } else {
            elMessage({ message: result.msg, type: 'error', duration: 2000 })
        }
    }

    // 重置页码
    const resetPagination = () => {
        state.pagination.current_page = 1;
    }

    // 搜索
    const handleSearch = () => {
        resetPagination();
        queryPalletList()
    }

    const handleSelectionChange = (val) => {
        let ids = val.map((e) => e.relation_id)
        state.checkIdList = ids;
    }

    // 批量删除
    const handleDestory = () => {
        if (state.checkIdList.length == 0) {
            elMessage.warning('请选择托盘！')
            return false;
        }

        ElMessageBox.confirm('此操作将永久删除选中数据，是否继续？', '提示', {
            confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(async () => {
            const result = await deletePallet(state.checkIdList.join(','));
            if (result.code === 200) {
                queryPalletList();
                elMessage({ message: result.msg, type: 'success', duration: 2000 })
            } else {
                elMessage({ message: result.msg, type: 'error', duration: 2000 })
            }
        }).catch(() => {
            console.log('已取消删除');
        })
    };

    const handleDetial = async (row) => {
        const result = await getPalletDetial(row.pallet_code);
        if (result.code === 200) {
            const { list } = result.data
            state.cartonList = list;
        } else {
            elMessage({ message: result.msg, type: 'error', duration: 2000 })
        }
        state.dialogFormVisible = true;
    }

    const detialexportExcel = async () => {
        if (state.search.doc_no.length <= 0) {
            elMessage({ message: "请输入工单号之后再导出", type: 'error', duration: 2000 })
            return;
        }
        let search = {
            ...state.pagination,
            ...state.search
        };

        await getPalletExcel(search).then(response => {
            if (!response) {
                return false
            }

            const fileName = '托盘数据导出' + newDataTime();
            let blob = new Blob([response], { type: 'application/ms-excel;charset=utf-8' });
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

    return { dataForm, ...toRefs(state), resetForm, theTable, handleSelectionChange, handleDetial, handleDestory, queryPalletList, handleSearch, detialexportExcel }
}