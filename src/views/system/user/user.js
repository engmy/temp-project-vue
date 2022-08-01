import { reactive, toRefs, ref } from 'vue'
import { getUserList, createUserInfo, deleteUserInfo, updateUserInfo, changeUserStatus, resetUserPassword } from '@/api/system/user';
import { ElMessageBox, ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { useStore } from '@/store'
import { getRoleAllList, getRoleList } from '@/api/system/role'
// import { getSitelList} from "@/api/basic/site";

export default function () {
	const dataForm = ref(null);
	const resetForm = ref(null)
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
			username: "",
		},
		checkIdList: [],
		dialogTitleMap: {
			update: "修改信息",
			create: "添加用户",
		},
		dialogStatus: "",
		dialogFormVisible: false,

		form: {
			user_id: undefined,
			username: "",
			nickname: "",
			create_time: undefined,
			status: 1,
			sex: 1,
			avatar: '',
			departmentName: "",
			email: "",
			role_id: "",
			site_no: "",
			phone: "",
			password: "",
			site_id: "",
			site_name: ""
		},
		rules: {
			name: [{ required: true, message: "姓名必须", trigger: "blur" }],
			username: [{ required: true, message: "用户名必须", trigger: "blur" }],
			nickname: [{ required: true, message: "昵称必须", trigger: "blur" }],
			role_id: [{ required: true, message: "角色必须", trigger: "blur" }],
			sex: [{ required: true, message: "性别必须选", trigger: "blur" }],
			phone: [{ validator: checkPhone, trigger: "change" }],
			email: [{ validator: checkEmail, trigger: "change" }],
			site_id: "",
			site_name: "",
			password: [
				{ required: true, message: "请输入密码", trigger: "blur" },
				{ validator: validatePass, trigger: "blur" }
			],
			newpass: [
				{ required: true, message: "请输入密码", trigger: "blur" },
				{ validator: validatePass, trigger: "blur" }
			],
			renewpass: [
				{ required: true, message: "请再次输入密码", trigger: "blur" },
				{ validator: valiResetPass, trigger: "blur" }
			],
			site_no: [{ required: true, message: "请选择工厂", trigger: "blur" }],
		},
		roleList: [], // 展示的角色列表
		siteList: [], // 工厂列表
		departmentList: [],
		sexList: [
			{ sexId: 1, sexName: '男' },
			{ sexId: 2, sexName: '女' }
		],
		loading: true,
		resetPasswordDialogVisible: false, // 重置密码的弹窗
		resetData: { //重置密码的表格
			newpass: "",
			renewpass: "",
			user_id: ""
		}
	})

	// 手机号码的验证
	function checkPhone(rule, value, callback) {
		if (value) {
			let re = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
			if (re.test(value)) {
				return callback();
			} else {
				return callback(new Error("请输入正确的手机号码"));
			}
		} else {
			return callback();
		}
	}

	// 电子邮箱的验证
	function checkEmail(rule, value, callback) {
		if (value) {
			let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (re.test(value)) {
				return callback();
			} else {
				return callback(new Error("请输入正确的电子邮箱"));
			}
		} else {
			return callback();
		}
	}

	// 密码验证的规则
	function validatePass(rule, value, callback) {
		if (value === '') {
			callback(new Error('请输入密码'));
		} else if (value.length < 6) {
			callback(new Error('请输入6位以上密码'));
		} else {
			callback();
		}
	}

	// 密码验证的规则
	function valiResetPass(rule, value, callback) {
		if (value === '') {
			callback(new Error('请再次输入密码'));
		} else if (value.length < 6) {
			callback(new Error('请输入6位以上密码'));
		} else if (value !== state.resetData.newpass) {
			callback(new Error('两次输入密码不一致!'));
		} else {
			callback();
		}
	}

	// 重置表单绑定数据
	const resetTemp = () => {
		state.form = {
			user_id: undefined,
			username: "",
			nickname: "",
			create_time: undefined,
			status: 1,
			sex: 1,
			avatar: '',
			departmentName: "",
			email: "",
			role_no: "",
			site_no: "",
			phone: "",
			remark: "",
			password: "",
			site_id: "",
			site_name: ""
		}
	}

	// 查询用户
	async function queryUserList() {
		let payload = {
			...state.pagination,
			...state.search,
		};
		const result = await getUserList(payload)
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

	// 搜索
	const handleSearch = () => {
		resetPagination();
		queryUserList()
	}

	// 刷新
	const refresh = () => {
		queryUserList();
	};

	// 批量删除
	const handleDestory = () => {
		if (state.checkIdList.length == 0) {
			ElMessage.warning('请选择用户')
			return false
		}
		if (state.checkIdList.length >= 2) {
			ElMessage.warning('操作被拒绝 禁止批量删除')
			return false
		}
		ElMessageBox.confirm('此操作将永久删除选中数据，是否继续？', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(async () => {
			var data = {
				user_id: state.checkIdList.toString(),
				update_user: useStore().getters.userInfo.username
			}
			await deleteUserInfo(data).then(res => {
				if (res.code === 200) {
					ElMessage.success('删除成功!');
					queryUserList();
				}
			}).catch(() => {
				queryUserList();
			})

		}).catch(() => {
			console.log('已取消删除');
		})
	};

	// 单个删除
	const handleDelete = (index) => {
		let item = state.list[index];
		ElMessageBox.confirm(`是否删除用户 ${item.username} ？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(async () => {
			var data = {
				user_id: item.user_id,
				update_user: useStore().getters.userInfo.username
			}
			await deleteUserInfo(data).then(res => {
				if (res.code === 200) {
					ElMessage.success('删除成功!');
					queryUserList();
				}
			}).catch(() => {
				queryUserList();
			})

		}).catch(() => {
			console.log('已取消删除');
		})
	}


	const handleCreate = async () => {
		resetTemp();
		const { data: role } = await getRoleAllList();
		//const { data: site } = await getSitelList();
		state.roleList = role;
		//state.siteList = site;
		state.dialogStatus = 'create';
		state.dialogFormVisible = true;
	}

	const handleEdit = async (row) => {
		state.form = Object.assign({}, row);
		const { data: role } = await getRoleList();
		//const { data: site } = await getSitelList();
		state.roleList = role.list;
		//	state.siteList = site;
		state.dialogStatus = "update";
		state.dialogFormVisible = true;
	};
	const changeSite = (date) => {
		var onjVal = {};

		state.siteList.forEach((val) => {

			if (val.site_no == date) {
				onjVal = val;
			}
		})
		console.log(onjVal.site_name, "site_name");
		state.form.site_name = onjVal.site_name;
		state.form.site_id = onjVal.site_id;
	};
	// 添加用户
	const createData = () => {
		dataForm.value.validate(async (valid) => {
			if (valid) {
				state.form.create_time = dayjs().format('YYYY-MM-DD h:i:s');
				state.form.create_user = useStore().getters.userInfo.username;
				// 调用创建接口
				await createUserInfo(state.form).then(res => {
					if (res.code === 200) {
						state.dialogFormVisible = false;
						handleSearch();
						ElMessage.success(res.msg);
					}
				}).catch(() => {
					handleSearch();
				})
			}
		});
	}

	// 修改用户
	const updateData = () => {
		dataForm.value.validate(async (valid) => {
			if (valid) {
				state.form.update_user = useStore().getters.userInfo.username;
				// java后端有检查 以下数据更新时不能传输过去
				state.form.login_date = undefined;
				await updateUserInfo(state.form).then(res => {
					if (res.code === 200) {
						state.dialogFormVisible = false;
						handleSearch();
						ElMessage.success(res.msg);
					}
				}).catch(() => {
					handleSearch();
				})
			}
		});
	}

	const handleAvatarSuccess = (res, file) => {
		state.form.avatar = URL.createObjectURL(file.raw);
	}

	// 滑块改变时 改变用户的账号状态
	const changeSwitch = async (row) => {
		let data = {
			status: row.status - 0 > 1 ? 2 : 1,
			user_id: row.user_id
		}
		await changeUserStatus(data).then(res => {
			if (res.code === 200) {
				ElMessage.success(res.msg);
				queryUserList();
			}
		}).catch(() => {
			queryUserList();
		})
	}

	// 重置密码
	const resetPassword = (row) => {
		state.resetPasswordDialogVisible = true;
		state.resetData.user_id = row.user_id;
	}

	// 提交重置密码
	const eidtPassword = () => {
		resetForm.value.validate(async (valid) => {
			if (valid) {
				await resetUserPassword(state.resetData).then(res => {
					if (res.code === 200) {
						state.resetPasswordDialogVisible = false;
						handleSearch();
						ElMessage.success(res.msg);
					}
				}).catch(() => {
					handleSearch();
				})
			}
		});
	}

	// 重置密码弹窗关闭事件
	const handleClose = () => {
		state.resetPasswordDialogVisible = false;
		state.resetData = {
			newpass: "",
			renewpass: "",
			user_id: ""
		}
		resetForm.value.resetFields();
	}

	// 新增表单 关闭事件
	const handleCloseData = () => {
		state.dialogFormVisible = false;
		dataForm.value.resetFields();
	}

	return {
		...toRefs(state),
		dataForm,
		resetForm,
		queryUserList,
		refresh,
		handleSearch,
		handleSelectionChange,
		handleDestory,
		handleDelete,
		handleCreate,
		handleEdit,
		createData,
		updateData,
		handleAvatarSuccess,
		changeSwitch,
		resetPassword,
		eidtPassword,
		handleClose, handleCloseData, changeSite
	}
}