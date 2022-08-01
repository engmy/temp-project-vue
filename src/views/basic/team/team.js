import { reactive, toRefs, ref } from 'vue'
import { ElMessage, elMessage, ElMessageBox } from "element-plus";
import { getTeamList, inserTeam, deleteTeam, editTeam } from "@/api/produce/team";
import { getSitelList } from "@/api/basic/site";

export default function () {
    const dataForm = ref(null);
    const resetForm = ref(null);
    const state = reactive({
        pagination: {
            current_page: 1,
            page_size: 10,
        },
        team_no: '',//搜索关键字
        team_name: '',//搜索关键字
        list: [],
        siteList: [],//工厂
        dialogTitleMap: {
            update: "修改班组",
            create: "新建班组",
        },
        dialogStatus: "",
        dialogFormVisible: false,
        istrue:true,
        temp: {
            site_no: "",
            site_name: "",
            team_no: '',
            team_name: '',
            site_id: "",
            remarks: ""
        },
        search: {
            site_no: "",
            site_name: "",
            team_no: '',
            team_name: '',
            site_id: "",
        },
        rules: {
            site_no: [{ required: true, message: "工厂不能为空", trigger: "blur" }],
            team_no: [{ required: true, message: "班组编号不能为空", trigger: "blur" }],
            team_name: [{ required: true, message: "班组名称不能为空", trigger: "blur" }],
        }
    })

    // 查询用户
    async function queryTeamList() {
        const { data: role } = await getSitelList();
        var a = { site_no: "", site_name: "请选择" };
        role.unshift(a);

        for (let i = 0; i < role.length; i++) {
            role[i].site_name = role[i].site_no+"-"+role[i].site_name
        }
        state.siteList = role;
        let payload = {
            ...state.pagination,
            ...state.search,
        };
        const result = await getTeamList(payload)
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

    // 记录选中
    const handleSelectionChange = (val) => {
        let ids = val.map((e) => e.user_id)
        state.checkIdList = ids;
    }

    // 切换每页条数
    const handleSizeChange = (size) => {
        state.pagination.page_size = size;
        queryTeamList();
    };

    // 切换页码
    const handleCurrentChange = (pageNo) => {
        state.pagination.current_page = pageNo;
        queryTeamList();
    };

    // 搜索
    const handleSearch = () => {
        resetPagination();
        queryTeamList()
    }

    // 刷新
    const refresh = () => {
        queryTeamList();
    };


    const handleCreate = async () => {
        resetTemp();
        state.istrue=true;//可以编辑
        //获取产品信息
        const { data: role } = await getSitelList();
        for (let i = 0; i < role.length; i++) {
            role[i].site_name = role[i].site_no+"-"+role[i].site_name
        }
        state.siteList = role;
        state.dialogStatus = 'create';
        state.dialogFormVisible = true;
    }
    // 重置表单绑定数据
    const resetTemp = () => {
        state.temp = {
            site_no: "",
            site_name: "",
            team_no: '',
            team_name: '',
            site_id: "",
        }
    }

    // 添加用户
    const createData = () => {
        dataForm.value.validate(async (valid) => {
            if (valid) {

                const result = await inserTeam(state.temp);
                if (result.code === 200) {
                    queryTeamList();
                    state.dialogFormVisible = false;
                    elMessage({ message: result.msg, type: 'success', duration: 2000 })
                }
            }
        });
    }

    const handleEdit = async (row) => {
        state.istrue=false,//不可编辑
        state.temp = Object.assign({}, row);
        state.dialogStatus = 'update';
        state.dialogFormVisible = true;
        state.dialogTitle = '修改班组信息';
        const { data: role } = await getSitelList();
        for (let i = 0; i < role.length; i++) {
            role[i].site_name = role[i].site_no+"-"+role[i].site_name
        }
        state.siteList = role;
    };


    // 单个删除
    const handleDelete = (index) => {
        let item = state.list[index];
        ElMessageBox.confirm(`是否删除当前班组 ${item.team_name} ？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            await deleteTeam(item.team_id).then(res => {
                if (res.code === 200) {
                    ElMessage.success('删除成功!');
                    queryTeamList();
                }
            }).catch(() => {
                queryTeamList();
            })

        }).catch(() => {
            console.log('已取消删除');
        })
    }


    // 修改数据
    const updateData = () => {
        dataForm.value.validate(async (valid) => {
            if (valid) {
                await editTeam(state.temp).then(res => {
                    if (res.code === 200) {
                        handleClose();
                        queryTeamList();
                        ElMessage.success(res.msg);
                    }
                }).catch(() => {
                    queryTeamList();
                })
            }
        })
    }

    // 弹窗关闭
    const handleClose = () => {
        state.dialogStatus = '';
        state.dialogFormVisible = false;
        state.dialogTitle = '';
        dataForm.value.resetFields();
        resetTemp();
    }

    const changeSite = (date) => {
        var onjVal = {};

        state.siteList.forEach((val) => {

            if (val.site_no == date) {
                onjVal = val;
            }
        })
        console.log(onjVal.site_name, "site_name");
        state.temp.site_name = onjVal.site_name.toString().split("-")[1];
        state.temp.site_id = onjVal.site_id;
    };

    return {
        ...toRefs(state),
        dataForm,
        resetForm,
        queryTeamList,
        refresh,
        handleSearch,
        handleSelectionChange,
        handleSizeChange,
        handleCurrentChange,
        handleCreate,
        handleEdit,
        createData,
        handleDelete,
        changeSite,
        updateData
    }
}