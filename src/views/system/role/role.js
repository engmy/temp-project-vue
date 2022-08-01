import { reactive, toRefs, ref } from 'vue'
import { elMessageBox, elMessage } from 'element-plus'
import {
	getRoleList,
	getRoleInfo,
	createRole,
	updateRole,
	deleteRole,
	updateStatus,
	createRolebrand,
	getRoleAndBrandInfo
} from '@/api/system/role'
import { useStore } from "vuex";
import { deepTree, checkNumber } from "@/utils";
import { generateDynamicRoutes } from "@/router";
import { getRoleDataInfo } from '@/api/system/role'

export default function () {
	const store = useStore();
	const dataForm = ref(null);
	const roleForm = ref(null);
	const roleTree = ref(null);
	const menuTree = ref(null);

	const state = reactive({
		pagination: {
			current_page: 1,
			page_size: 10,
		},
		list: [],
		role_name: '',
		checkIdList: [],
		dialogTitle: {
			update: "编辑角色",
			create: "新增角色",
			roledata: "角色数据",
		},
		statusOptions: {
			1: "启用",
			2: "禁用"
		},
		dialogStatus: "",
		dialogFormVisible1: false,
		dialogFormVisible: false,
		menuList: [],
		roleDataList: [],
		menuidArray1: [],
		typeArray1: [],
		form: {
			role_id: "",
			role_name: "",
			role_sort: 0,
			status: 1,
			menu_ids: [],
			company_nos: [],//
			remarks: ""
		},
		rules: {
			role_name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
			role_sort: [
				{ required: true, message: "角色排序不能为空", trigger: "blur" },
				{ validator: checkNumber, trigger: "blur" }],
			status: [{ required: true, message: "角色状态不能为空", trigger: "blur" }],
			menu_ids: [{ required: true, message: "请选择角色权限", trigger: "blur" }],
			company_nos: [{ required: true, message: "请选择角色权限", trigger: "blur" }],
		},
		search: {
			role_name: "",
		}
	})

	const clearPermList = async () => {
		await store.dispatch("perm/getPermList");
	};

	const clearMenu = async () => {
		const viewRoutes = await store.dispatch("menu/generateRoutes");
		generateDynamicRoutes(viewRoutes)
	};

	// 查询角色列表
	const queryRoleList = async () => {
		let search = {
			...state.pagination,
			...state.search
		};
		const res = await getRoleList(search)
		if (res.code === 200) {
			const { list, ...pagination } = res.data;
			state.list = list;
			state.pagination = pagination;
		}
	}

	const queryMenuList = async () => {
		let list = await store.dispatch("menu/getTreeMenuList");
		state.menuList = deepTree(list);
	};


	// 重置页码
	const resetPagination = () => {
		state.pagination.current_page = 1;
	}

	// 搜索
	const handleSearch = () => {
		resetPagination();
		queryRoleList()
	}

	const stateForm = () => {
		state.form = {
			role_name: "",
			role_sort: 0,
			status: 1,
			menu_ids: [],
			company_nos: [],
			remarks: "",
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
		await queryMenuList();
		const result = await getRoleInfo(row.role_id)
		if (result.code === 200) {
			state.form = Object.assign({}, result.data);
		}
		state.dialogStatus = "update";
		state.dialogFormVisible = true;
	}


	// 新增角色
	const createData = () => {
		dataForm.value.validate(async (valid) => {
			if (valid) {
				const result = await createRole(state.form);
				if (result.code === 200) {
					clearMenu();
					clearPermList();
					queryRoleList();
					dataHandleClose();
					elMessage({ message: result.msg, type: 'success', duration: 2000 })
				}
			}
		});
	}

	// 更新角色
	const updateData = () => {
		dataForm.value.validate(async (valid) => {
			if (valid) {
				const result = await updateRole(state.form.role_id, state.form);
				if (result.code === 200) {
					clearMenu();
					clearPermList();
					queryRoleList();
					dataHandleClose();
					elMessage({ message: result.msg, type: 'success', duration: 2000 })
				}
			}
		});
	}

	// 删除角色
	const handleDelete = (row) => {
		let item = row;
		elMessageBox.confirm(`是否删除角色${item.role_name}？`, '提示',
			{
				confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
			}).then(async () => {
				const result = await deleteRole(item.role_id);
				if (result.code === 200) {
					clearMenu();
					clearPermList();
					queryRoleList();
					elMessage({ message: result.msg, type: 'success', duration: 2000 })
				} else {
					elMessage({ message: result.msg, type: 'error', duration: 2000 })
				}
			}).catch(() => {
				console.log('已取消删除');
			})
	}

	// 更新角色状态
	const handleChange = async (row) => {
		let data = {
			"role_id": row.role_id,
			"status": row.status
		}
		await updateStatus(data).then(result => {
			if (result.code === 200) {
				clearMenu();
				clearPermList();
				queryRoleList();
				elMessage({ message: result.msg, type: 'success', duration: 2000 })
			} else {
				queryRoleList();
				elMessage({ message: result.msg, type: 'error', duration: 2000 })
			}
		}).catch(() => {
			queryRoleList();
		})

	}


	// 获取的菜单
	const queryRoleDataList = async () => {
		// let list = await store.dispatch("menu/getTreeRoleDataList");
		let list = await getRoleDataInfo().then((result) => {
			const menus = result.data;
			return handleList(menus);
		})
		state.roleDataList = deepTree(list);
	}

	// 处理list集合
	function handleList(menus) {
		const routes = menus.map((e) => {
			return {
				id: e.menu_id,
				ids: e.menu_id + '-' + e.sort * 1 + '-' + e.parent_id,
				parent_id: e.parent_id,
				name: e.name,
				sort: e.sort * 1,
				children: [],
			}
		})
		return routes;
	}

	// 角色数据
	const handleData = async (row) => {
		await queryRoleDataList();
		const result = await getRoleAndBrandInfo({
			role_id: row.role_id
		})
		if (result.code === 200) {

			let menus = result.data.role_brand.map(p => {
				let obj = {};
				obj.menu_id = p.mern_id;
				obj.sort = p.type;
				return Object.assign(obj, p)
			})

			const routes = handleList(menus);

			let obj = routes.map((item, index) => {
				return { ...item, ...menus[index] };
			});

			obj.role_id = result.data.role_id;
			obj.role_name = result.data.role_name;

			obj.company_nos = obj.map(p => p.ids)

			state.form = Object.assign({}, obj);
			state.dialogStatus = "roledata";
			state.dialogFormVisible1 = true;
		}

	}

	const insertrolebrandData = () => {
		roleForm.value.validate(async (valid) => {
			if (valid) {
				// 处理下数据
				state.form.menuid_array = state.form.company_nos;
				const result = await createRolebrand(state.form);
				if (result.code === 200) {
					handleClose();
					elMessage({ message: result.msg, type: 'success', duration: 2000 })
				}
			}
		});
	}

	const handleClose = () => {
		state.dialogFormVisible1 = false;
		state.form = {
			role_id: "",
			role_name: "",
			role_sort: 0,
			status: 1,
			menu_ids: [],
			company_nos: [],//
			remarks: ""
		}
		roleForm.value.resetFields();
		state.roleDataList = [];
		state.menuList = [];
		roleTree.value.clear();
	}

	const dataHandleClose = () => {
		state.dialogFormVisible = false;
		state.form = {
			role_id: "",
			role_name: "",
			role_sort: 0,
			status: 1,
			menu_ids: [],
			company_nos: [],//
			remarks: ""
		}
		dataForm.value.resetFields();
		state.menuList = [];
		menuTree.value.clear();
	}

	return {
		dataForm, ...toRefs(state),
		handleChange,
		clearMenu,
		clearPermList,
		queryRoleList,
		queryMenuList,
		handleSearch,
		handleDelete,
		handleCreate,
		handleEdit,
		createData,
		updateData,
		handleData,
		queryRoleDataList,
		insertrolebrandData,
		handleClose,
		roleForm,
		roleTree,
		menuTree,
		dataHandleClose
	}
}