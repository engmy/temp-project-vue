import { reactive, toRefs, ref, onBeforeMount } from 'vue'
import { elMessageBox, elMessage } from 'element-plus'
import { getDictList, getDictInfo, createDict, updateDict, deleteDict, updateStatus } from '@/api/system/dict'
import { useRouter } from "vue-router";
import { checkNumber } from "@/utils";

export default function () {
    const router = useRouter();
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
            update: "编辑字典",
            create: "新增字典",
        },
        statusOptions: {
            1: "启用",
            2: "禁用"
        },
        dialogStatus: "",
        dialogFormVisible: false,
        menuList: [],
        form: {
            dict_id: "",
            dict_name: "",
            dict_type: "",
            sort: 0,
            status: 1,
            remarks: ""
        },
        rules: {
            dict_name: [{ required: true, message: "字典名称不能为空", trigger: "blur" }],
            dict_type: [{ required: true, message: "字典类型不能为空", trigger: "blur" }],
            status: [{ required: true, message: "字典状态不能为空", trigger: "blur" }],
            sort: [{ validator: checkNumber, trigger: "blur" }],
        },
        search: {
            dict_name: ""
        }
    })

    // 查询角色列表
    async function queryDictList() {
        let search = {
            ...state.pagination,
            ...state.search
        };
        const res = await getDictList(search)
        if (res.code === 200) {
            const { list, ...pagination } = res.data;
            state.list = list;
            state.pagination = pagination;
        }
    }

    // 重置页码
    const resetPagination = () => {
        state.pagination.page = 1;
    }

    // 搜索
    const handleSearch = () => {
        resetPagination();
        queryDictList()
    }

    // 刷新
    const refresh = () => {
        queryDictList();
    };

    const stateForm = () => {
        state.form = {
            dict_name: "",
            dict_type: "",
            sort: 0,
            status: 1,
            remarks: ""
        }
    }

    // 新增角色弹框
    const handleCreate = () => {
        stateForm();
        state.dialogStatus = 'create';
        state.dialogFormVisible = true;
    }

    // 编辑角色弹框
    const handleEdit = async (row) => {
        const result = await getDictInfo(row.dict_id)
        if (result.code === 200) {
            state.form = Object.assign({}, result.data);
        }
        state.dialogStatus = "update";
        state.dialogFormVisible = true;
    }

    // 新增字典
    const createData = () => {
        dataForm.value.validate(async (valid) => {
            if (valid) {
                const result = await createDict(state.form);
                if (result.code === 200) {
                    queryDictList();
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
                const result = await updateDict(state.form.dict_id, state.form);
                if (result.code === 200) {
                    queryDictList();
                    state.dialogFormVisible = false;
                    elMessage({ message: result.msg, type: 'success', duration: 2000 })
                }
            }
        });
    }

    // 删除字典
    const handleDelete = (row) => {
        let item = row;
        elMessageBox.confirm(`是否删除字典${item.dict_name}？`, '提示',
            {
                confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
            }).then(async () => {
                const result = await deleteDict(item.dict_id);
                if (result.code === 200) {
                    queryDictList();
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
            "dict_id": row.dict_id,
            "status": row.status
        }
        const result = await updateStatus(data);
        if (result.code === 200) {
            queryDictList();
            elMessage({ message: result.msg, type: 'success', duration: 2000 })
        } else {
            elMessage({ message: result.msg, type: 'error', duration: 2000 })
        }
    }

    // 字典数据
    const handleData = async (row) => {
        router.push({ path: "/admin/dict/data", query: { type: row.dict_id } });
    }

    onBeforeMount(() => {
        let routey = {
            path: "/admin/dict/data",
            name: "字典数据",
            component: () => import('@/views/system/dict/data.vue'),
            meta: {
                title: '字典数据',
                show: true,
                keepAlive: 1,
                icon: 'desktop',
                type: 2,
            }
        };
        router.addRoute("layout", routey);
    })

    return { dataForm, ...toRefs(state), handleData, handleChange, queryDictList, refresh, handleSearch, handleDelete, handleCreate, handleEdit, createData, updateData }
}