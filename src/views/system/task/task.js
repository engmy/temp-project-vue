import { reactive, toRefs, ref } from 'vue'
import { getTaskList, changeTaskStatus, createTask, updateTask, deleteTask } from "@/api/system/task"
import { useStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus';
import _ from 'lodash';
import { getCategoryTree } from '@/api/basic/category';
import { getSiteListByComPk } from '@/api/basic/site';
import { getBrandListOnSiteId } from '@/api/basic/brand';

export default function () {
	const dataForm = ref(null);
	const state = reactive({
		pagination: {
			current_page: 1,
			page_size: 10,
		},
		list: [],
		statusOptions: {
			2: "禁用",
			1: "启用",
		},
		search: {
			task_name: ""
		},
		temp: {
			task_id: "",
			task_name: "",
			cron: "",
			task_key: "",
			status: 1,
			remark: '',
			brand_pk: '',
			brand_no: '',
			site_pk: '',
			site_no: '',
			gateway: '',
			api_key: '',
			api_secret: '',
		},
		dialogStatus: "",
		dialogFormVisible: false, //弹出框是否显示
		dialogTitleMap: {
			update: "修改计划任务",
			create: "添加计划任务",
		},
		rules: {
			task_name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
			cron: [{ required: true, message: "请输入cron", trigger: "blur" }],
			task_key: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
			site_pk: [{ required: true, message: "请选择工厂", trigger: "blur" }],
			brand_pk: [{ required: true, message: "请选择品牌", trigger: "blur" }],
			gateway: [{ required: true, message: "请填写推送网关", trigger: "blur" }],
			api_key: [{ required: true, message: "请填写登录名", trigger: "blur" }],
			api_secret: [{ required: true, message: "请填写登录密码", trigger: "blur" }],
			task_url: [{ required: true, message: "请填写任务地址", trigger: "blur" }],
		},
		siteList: [],
		brandList: [],
	})

	// 重置表单绑定数据
	const resetTemp = () => {
		state.temp = {
			task_id: "",
			task_name: "",
			cron: "",
			task_key: "",
			status: 1,
			remark: '',
			brand_pk: '',
			brand_no: '',
			site_pk: '',
			site_no: '',
			gateway: '',
			api_key: '',
			api_secret: '',
		}
	}

	// 查询列表信息
	async function queryTaskList() {
		let search = {
			...state.pagination,
			...state.search,
		};
		const result = await getTaskList(search)
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
		queryTaskList();
	}

	// 刷新
	const refresh = () => {
		queryTaskList();
	};

	// 任务状态更新
	const changeSwitch = async (row) => {
		let data = {
			update_user: useStore().getters.userInfo.username,
			status: row.status - 0 > 1 ? 2 : 1,// 反转下状态 如果是2则返回1 ,
			task_id: row.task_id
		}
		await changeTaskStatus(data).then(res => {
			if (res.code === 200) {
				ElMessage.success(res.msg);
				queryTaskList();
			}
		}).catch(() => {
			queryTaskList();
		})
	}

	// 新增
	const handleCreate = () => {
		resetTemp();
		state.dialogStatus = 'create';
		state.dialogFormVisible = true;
		getSiteList();
	}

	// 编辑
	const handleEdit = (row) => {
		state.temp = Object.assign({}, row);
		state.dialogStatus = 'update';
		state.dialogFormVisible = true;
		getSiteList();
		// 获取品牌列表
		getBrandListOnSiteId({ siteId: row.site_pk }).then(res => {
			if (res.code === 200) {
				state.brandList = res.data;
			}
		});
	}

	// 创建计划任务
	const createData = () =>
	{
		dataForm.value.validate(async (valid) => {
			if (valid) {
				await createTask(state.temp).then(res => {
					if (res.code === 200) {
						state.dialogFormVisible = false;
						handleSearch();
						ElMessage.success(res.msg);
					}
				}).catch(() => {
					queryTaskList();
				})
			}
		});
	}

	// 修改计划任务
	const updateData = () => {
		dataForm.value.validate(async (valid) => {
			if (valid) {
				await updateTask(state.temp).then(res => {
					if (res.code === 200) {
						state.dialogFormVisible = false;
						queryTaskList();
						ElMessage.success(res.msg);
					}
				}).catch(() => {
					queryTaskList();
				})
			}
		});
	}

	// 删除任务
	const handleDelete = (index) => {
		let item = state.list[index];
		ElMessageBox.confirm(`是否删除任务 ${item.task_name} ？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(async () => {
			var data = {
				task_id: item.task_id
			}
			await deleteTask(data).then(res => {
				if (res.code === 200) {
					ElMessage.success('删除成功!');
					queryTaskList();
				}
			}).catch(() => {
				handleSearch
			})
		}).catch(() => {
			console.log('已取消删除');
		})
	}

	// 新增表单 关闭事件
	const handleCloseData = () => {
		state.dialogFormVisible = false;
		dataForm.value.resetFields();
	}

	const getSiteList = async () => {
		if (state.siteList.length) {
			return;
		}
		// 获取工厂列表
		let payload = {
			current_page: 1,
			page_size: 30 //一个公司一个不会超过30个工厂吧 如果有 到时早加个下拉加载的
		};
		await getSiteListByComPk(payload).then(res => {
			if (res.code === 200) {
				state.siteSearchList = res.data;
				state.siteList = res.data;
			}
		})
	}

	const changeSiteSelect = async (row) => {
		state.siteList.map(p => {
			if (p.site_id === row) {
				state.temp.site_no = p.site_no;
			}
		})
		state.brandList = [];
		state.temp.brand_pk = '';
		// 获取品牌列表
		await getBrandListOnSiteId({ siteId: row }).then(res => {
			if (res.code === 200) {
				state.brandList = res.data;
			}
		});
	}

	// 为了做下拉框绑定多个值 品牌
	const changeSelect = (item) => {
		state.brandList.map(p => {
			if (p.brand_id === item) {
				state.temp.brand_no = p.brand_no;
				return;
			}
		})
		getCategory(item);
	}
	const getCategory = async (item) => {
		let pyload = {
			brand_pk: item,
			site_pk: state.temp.site_pk
		}
		// 调用
		state.categoryList = [];
		//获取分类树结构
		await getCategoryTree(pyload).then(result => {
			if (result.code === 200) {
				let res = result.data.map(p => {
					let new_data = _.cloneDeep(p);
					new_data.name = p.category_name;
					new_data.id = p.category_id;
					return new_data;
				})
				state.categoryList = _.cloneDeep(res);
			}
		})
	}


	return {
		...toRefs(state),
		dataForm,
		resetTemp,
		queryTaskList,
		resetPagination,
		handleSearch,
		changeSwitch,
		createData,
		updateData,
		refresh,
		handleCreate,
		handleEdit,
		handleDelete,
		getSiteList,
		handleCloseData,
		changeSelect,
		changeSiteSelect
	}
}