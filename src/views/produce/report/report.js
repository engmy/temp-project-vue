import { reactive, toRefs, ref, onMounted } from 'vue'
import { getToken } from "@/utils/auth";
import { getSitelList } from "@/api/basic/site";
import { getSiteBrandList } from "@/api/basic/brand";
import { ElMessage, elMessage, ElMessageBox } from "element-plus";
import { createProductReport, deleteProductReport, getProductReportInfo, getProductReportList } from "@/api/produce/report";

export default function () {
    const dataForm = ref(null);
    const state = reactive({
        action: "",
        headers: { token: getToken() },
        pagination: {
            current_page: 1,
            page_size: 10,
        },
        list: [],
        uploadSattus: "",
        dialogStatus: "",
        detailFormDialog: false,
        createFormDialog: false,
        form: {
            site_id: "",
            site_no: "",
            brand_id: "",
            brand_no: "",
            lot_no: "",
            file_path: ""
        },
        rules: {
            site_no: [{ required: true, message: "请选择工厂", trigger: "blur" }],
            brand_no: [{ required: true, message: "请选择品牌", trigger: "blur" }],
            lot_no: [{ required: true, message: "请输入报告产品批号", trigger: "blur" }],
            file_path: [{ required: true, message: "请上传产品质检报告", trigger: "blur" }],
        },
        search: {
          lot_no: ""
        },
        siteList: [],
        brandList: [],
        pdf_url: '',
        upload_sattus: ""
    })

    const resetForm = () => {
        state.form = {
            site_id: "",
            site_no: "",
            brand_id: "",
            brand_no: "",
            lot_no: "",
            file_path: ""
        }
        state.upload_sattus = ""
    };

    const handleAvatarSuccess = (res) => {
        if (res.code == 200) {
            state.form.file_path = res.data;
            state.upload_sattus = "上传成功";
        } else {
            state.upload_sattus = "上传失败";
            elMessage({ message: "上传失败", type: 'error', duration: 2000 })
        }
    };

    const beforeAvatarUpload = (file) => {
        const fileType = ['application/pdf'];
        const ispdf = fileType.includes(file.type);
        const isLt = file.size / 1024 / 1024 < 5;

        if (!ispdf) {
            elMessage({ message: "上传报告只能是PDF格式!", type: 'error', duration: 2000 })
        }
        if (!isLt) {
            elMessage({ message: "上传头像图片大小不能超过5MB!", type: 'error', duration: 2000 })
        }
        return ispdf && isLt;
    };

    const handleCreate = async () => {
        resetForm();
        const result = await getSitelList();
        if (result.code == 200) {
            state.siteList = result.data;
        }
        state.createFormDialog = true;
    }

    const changeSite = (site_no) => {
        let site_id = "";
        state.siteList.forEach((item) => {
            if (item.site_no == site_no) {
                site_id = item.site_id;
            }
        })

        state.form.site_id = site_id;
        state.form.site_no = site_no;
        getSiteBrandList(site_id).then(res =>
        {
            console.log(res.data);
            state.brandList = res.data;
        });
    }

    const changeBrand = (brand_no) =>
    {
        let brand_id = "";
        state.brandList.forEach((item) => {
            if (item.brand_no == brand_no) {
                brand_id = item.brand_id;
            }
        })

        state.form.brand_id = brand_id;
        state.form.brand_no = brand_no;
    }

    // 查询报告
    async function queryProductReportList() {
        let search = {
            ...state.pagination,
            ...state.search
        };
        const result = await getProductReportList(search)
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
        queryProductReportList()
    }

    // 查看质检报告
    const handleDetial = async (row) => {
        await getProductReportInfo(row.report_id).then(response => {
            const blob = new window.Blob([response], { type: 'application/pdf' });
            const url = getObjectURL(blob);
            window.open(url);
        }).catch(function (error) {
            console.log(error);
        })
    }

    const getObjectURL = (file) => {
        let url = null;
        if (window.createObjectURL != undefined)  // basic
        {
            url = window.createObjectURL(file);
        } else if (window.webkitURL != undefined)  // webkit or chrome
        {
            url = window.webkitURL.createObjectURL(file);
        } else if (window.URL != undefined) // mozilla(firefox)
        {
            url = window.URL.createObjectURL(file);
        }
        return url;
    }

    // 新增报告
    const createData = () => {
        dataForm.value.validate(async (valid) => {
            if (valid) {
                const result = await createProductReport(state.form);
                if (result.code === 200) {
                    queryProductReportList();
                    handleClose();
                    elMessage({ message: result.msg, type: 'success', duration: 2000 })
                } else {
                    elMessage({ message: result.msg, type: 'error', duration: 2000 })
                }
            }
        });
    }

    // 删除
    const handleDelete = (index) => {
        let item = state.list[index];
        ElMessageBox.confirm(`是否删除质检报告吗？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async () => {
            const result = await deleteProductReport(item.report_id);
            if (result.code === 200) {
                ElMessage.success(result.msg);
                queryProductReportList();
            }
        }).catch(() => {
            console.log('已取消删除');
        })
    }

    onMounted(() => {
        state.action = process.env.VUE_APP_BASE_API +  "/admin/report/upload";
    })

    const handleClose = () => {
        state.createFormDialog = false;
        state.uploadSattus = '';
    }

    return {
        ...toRefs(state), dataForm, resetForm, changeSite, changeBrand, getObjectURL, createData, handleDelete, handleAvatarSuccess, handleClose,
        beforeAvatarUpload, queryProductReportList, handleSearch, handleDetial, handleCreate
    }
}