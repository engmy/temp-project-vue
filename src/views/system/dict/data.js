import { useRoute } from "vue-router";
import { getDictInfo } from "@/api/system/dict";
import { reactive, toRefs, ref } from 'vue'
import { elMessageBox, elMessage } from 'element-plus'
import { getDictDataList, getDictDataInfo, createDictData, updateDictData, deleteDictData, updateStatus } from '@/api/system/dictdata';
import { checkNumber } from "@/utils";

export default function () {
    const route = useRoute();
    const dataForm = ref(null);
    const state = reactive({
        pagination: {
            current_page: 1,
            page_size: 10,
        },
        list: [],
        dict_name: '',
        checkIdList: [],
        dialogTitle: {
            update: "编辑数据",
            create: "新增数据"
        },
        statusOptions: {
            1: "启用",
            2: "禁用"
        },
        classList: [
            { "value": "default", "label": "默认" },
            { "value": "primary", "label": "主要" },
            { "value": "success", "label": "成功" },
            { "value": "info", "label": "信息" },
            { "value": "warning", "label": "警告" },
            { "value": "danger", "label": "危险" }
        ],
        defaultList: [
            { "value": "Y", "label": "是" },
            { "value": "N", "label": "否" },
        ],
        dialogStatus: "",
        dialogFormVisible: false,
        menuList: [],
        form: {
            data_id: "",
            dict_code: "",
            dict_sort: 0,
            dict_label: "",
            dict_value: "",
            dict_type: "",
            css_class: "default",
            list_class: "",
            is_default: "N",
            status: 1,
            remarks: ""
        },
        rules: {
            dict_label: [{ required: true, message: "字典标签不能为空", trigger: "blur" }],
            dict_value: [{ required: true, message: "字典键值不能为空", trigger: "blur" }],
            dict_type: [{ required: true, message: "字典类型不能为空", trigger: "blur" }],
            dict_sort: [
                { required: true, message: "字典排序不能为空", trigger: "blur" },
                { validator: checkNumber, trigger: "blur" }
            ],
            is_default: [{ required: true, message: "系统默认不能为空", trigger: "blur" }],
            status: [{ required: true, message: "字典状态不能为空", trigger: "blur" }],
        },
        search: {
            dict_label: ""
        }
    })

    // 查询字典列表
    async function queryDictDataList() {
        let search = {
            ...state.pagination,
            ...state.search
        };
        const result = await getDictDataList(search)
        if (result.code === 200) {
            state.list = result.data.list;
            state.pagination.page = result.data.current_page;
            state.pagination.limit = result.data.page_size;
        }
    }

    // 重置页码
    const resetPagination = () => {
        state.pagination.page = 1;
    }

    // 记录选中
    const handleSelectionChange = (val) => {
        let ids = val.map((e) => e.id)
        state.checkIdList = ids;
    }

    // 切换每页条数
    const handleSizeChange = (limit) => {
        state.pagination.limit = limit;
        queryDictDataList();
    };

    // 搜索
    const handleSearch = () => {
        resetPagination();
        queryDictDataList()
    }

    // 切换页码
    const handleCurrentChange = (page) => {
        state.pagination.page = page;
        queryDictDataList();
    };

    // 刷新
    const refresh = () => {
        queryDictDataList();
    };

    const stateForm = () => {
        state.form = {
            dict_code: "",
            dict_sort: 0,
            dict_label: "",
            dict_value: "",
            dict_type: "",
            css_class: "",
            list_class: "default",
            is_default: "N",
            status: 1,
            remarks: ""
        }
    }

    // 新增字典弹框
    const handleCreate = async () => {
        stateForm();
        const result = await getDictInfo(route.query.type)
        if (result.code === 200) {
            let dict = Object.assign({}, result.data);
            state.form.dict_type = dict.dict_type;
        }
        state.dialogStatus = 'create';
        state.dialogFormVisible = true;
    }

    // 编辑字典弹框
    const handleEdit = async (row) => {
        const dictData = await getDictDataInfo(row.data_id)
        if (dictData.code === 200) {
            state.form = Object.assign({}, dictData.data);
        }
        state.dialogStatus = "update";
        state.dialogFormVisible = true;
    }

    // 新增字典
    const createData = () => {
        dataForm.value.validate(async (valid) => {
            if (valid) {
                const result = await createDictData(state.form);
                if (result.code === 200) {
                    queryDictDataList();
                    state.dialogFormVisible = false;
                    elMessage({ message: result.msg, type: 'success', duration: 2000 })
                }
            }
        });
    }

    // 更新字典
    const updateData = () => {
        dataForm.value.validate(async (valid) => {
            if (valid) {
                const result = await updateDictData(state.form.data_id, state.form);
                if (result.code === 200) {
                    queryDictDataList();
                    state.dialogFormVisible = false;
                    elMessage({ message: result.msg, type: 'success', duration: 2000 })
                }
            }
        });
    }

    // 删除字典
    const handleDelete = (row) => {
        let item = row;
        elMessageBox.confirm(`是否删除字典${item.dict_label}？`, '提示',
            {
                confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
            }).then(async () => {
                const result = await deleteDictData(item.data_id);
                if (result.code === 200) {
                    queryDictDataList();
                    elMessage({ message: result.msg, type: 'success', duration: 2000 })
                } else {
                    elMessage({ message: result.msg, type: 'error', duration: 2000 })
                }
            }).catch(() => {
                console.log('已取消删除');
            })
    }

    // 更新字典状态
    const handleChange = async (row) => {
        let data = {
            "data_id": row.data_id,
            "status": row.status
        }
        const result = await updateStatus(data);
        if (result.code === 200) {
            queryDictDataList();
            elMessage({ message: result.msg, type: 'success', duration: 2000 })
        } else {
            elMessage({ message: result.msg, type: 'error', duration: 2000 })
        }
    }

    return { dataForm, ...toRefs(state), handleChange, queryDictDataList, refresh, handleSearch, handleSelectionChange, handleSizeChange, handleCurrentChange, handleDelete, handleCreate, handleEdit, createData, updateData }
}