import { reactive, toRefs, ref } from 'vue'
import { uploadWorkDoc, deleteWorkDoc, getWorkDocList, insertWorkDoc, getRelationList, getRelationExcelList} from '@/api/workdoc/workdocmanageapi';
import { ElMessage, elMessage, ElMessageBox } from "element-plus";
import { getMaterialListByBrandNo } from '@/api/basic/material';
import { getSelectTeamList } from "@/api/produce/team";
import { getSiteBrandList } from "@/api/basic/brand";
import { getSelectPlineList } from "@/api/basic/pline";
import { getSitelList } from "@/api/basic/site";
import { arrayToExcel, formatJson } from '@/utils/export2Excel'
import { checkNumber } from "@/utils";
import _ from 'lodash';
import { newDataTime } from "@/utils/export2Excel";

export default function () {
	const dataForm = ref(null);
	const resetForm = ref(null);
	const state = reactive({
		pagination: {
			current_page: 1,
			page_size: 10,
		},
		pagination2: {
			current_page: 1,
			page_size: 10,
		},
		doc_no: '',//搜索关键字
		sku_no: '',//搜索关键字
		lot_no: '',//搜索关键字
		site_no: '',//搜索关键字
		doc_status: '',
		docCatalog:'',
		list: [],
		listDetial: [],//工单详情
		siteList: [],//工厂
		siteFormList: [],//工厂
		checkIdList: [],
		sku_noList: [], // 产品列表
		brandList: [],//品牌列表
		plineList: [],//产线列表
		statusList: [
			{ doc_status: "", doc_statusVal: "请选择" },
			{ doc_status: "00", doc_statusVal: "待执行" },
			{ doc_status: "10", doc_statusVal: "执行中" },
			{ doc_status: "30", doc_statusVal: "已执行" },
			{ doc_status: "40", doc_statusVal: "已上传" },
			{ doc_status: "50", doc_statusVal: "上传异常" },
		],
		docCatalogList:[
			{ docCatalog: "", docCatalogVal: "请选择" },
			{ docCatalog: "01", docCatalogVal: "成品生产任务单" },
			{ docCatalog: "02", docCatalogVal: "返工生产任务单" }
		],
		countdata: "0",
		teamList: [],//班组
		dialogTitleMap: {
			details: "详情",
			update: "修改日志",
			create: "新建工单",
		},
		statusOptions: {
			"10": "执行中",
			"30": "已执行",
			"40": "已上传",
			"50": "上传异常",
			"00": "待执行"
		},
		sourceOptions: {
			"1": "接口",
			"2": "手动创建"
		},
		docCatalogOptions: {
			"01": "成品生产任务单",
			"02": "返工生产任务单"
		},
		dialogStatus: "",
		dialogFormVisible: false,
		dialogFormVisible2: false,
		temp: {
			doc_no: "",
			sku_id: "",
			sku_no: "",
			sku_desc: "",
			mfg_date: "",
			lot_no: "",
			req_qty: "",
			extend2: "",

			site_id: "",
			site_no: "",
			site_name: "",
			team_id: "",
			team_no: "",
			team_name: "",
			brand_id: "",
			brand_no: "",
			brand_name: "",

			pline_id: "",
			pline_no: "",
			pline_name: "",
			customer_sku_no:"",
			bar_code:""
		},
		search: {
			doc_no: '',//搜索关键字
			sku_no: '',//搜索关键字
			lot_no: '',//搜索关键字
			site_no: '',//搜索关键字
			doc_status: '',
		},
		search1: {
			carton_code: '',//箱码
			doc_no:"",
		},
		rules: {
			site_no: [{ required: true, message: "工厂不能为空", trigger: "blur" }],
			team_no: [{ required: true, message: "班组不能为空", trigger: "blur" }],
			brand_no: [{ required: true, message: "品牌不能为空", trigger: "blur" }],
			pline_no: [{ required: true, message: "产线不能为空", trigger: "blur" }],
			sku_no: [{ required: true, message: "产品不能为空", trigger: "blur" }],
			mfg_date: [{ required: true, message: "生产日期不能为空", trigger: "blur" }],
			lot_no: [{ required: true, message: "产品批号不能为空", trigger: "blur" }],
			req_qty: [
				{ required: true, message: "计划数量不能为空", trigger: "blur" },
				{ validator: checkNumber, trigger: "blur" }
			],
			extend2: [{ required: true, message: "罐装单号不能为空", trigger: "blur" }],
		}
	})

	// 查询用户
	async function queryWorkDocList() {
		const { data: role } = await getSitelList();
		var a = { site_no: "", site_name: "请选择" };
		role.unshift(a);
		for (let i = 0; i < role.length; i++) {
			role[i].site_name = role[i].site_no + "-" + role[i].site_name
		}
		state.siteFormList = role;
		let payload = {

			...state.pagination,
			...state.search,
			doc_no: state.search.doc_no,
			sku_no: state.search.sku_no,
			lot_no: state.search.lot_no,
			site_no: state.site_no,
			doc_status: state.doc_status,
		};
		const result = await getWorkDocList(payload)
		if (result.code === 200) {
			const { list, ...pagination } = result.data

			state.list = list;
			state.pagination = pagination;
		}
	}

	//工单详情
	async function queryWorkDocLDetialList()
	{
		let payload = {
			...state.pagination2,
			doc_no: state.search1.doc_no,
			carton_code: state.search1.carton_code,
		};
		const result = await getRelationList(payload)
		if (result.code === 200) {
			const { list, ...pagination2 } = result.data
			state.listDetial = list;
			state.pagination2 = pagination2;
			state.countdata = "" + list.length + "";
		}
	}

	const exportExcel = () => {
		var tHeader = ['工单号','工单类型', '产品编码','客户产品编码','商品码', '产品名称', '罐装单号'
			, '产品批号', '产线代码', '班组', '品牌编号', '品牌描述', '生产日期'
			,"计划外箱数量","实际单品数量","实际外箱数量","已上传单品数量","已上传外箱数量"
			,'单据状态', '创建方式', '更新人', '更新时间']

		var filterVal = ['doc_no', 'doc_catalog','sku_no','customer_sku_no','bar_code', 'sku_desc', 'extend2'
			, 'lot_no', 'pline_no', 'team_no', 'brand_no', 'brand_name', 'mfg_date'
			, 'req_qty', 'real_item_num', 'real_carton_num', 'uploaded_item_num', 'uploaded_carton_num'
			, 'doc_status', 'source', 'update_user', 'update_time']
		var oldArr = state.list;
		let newArr2 =_.cloneDeep(oldArr);

		for (let i = 0; i < newArr2.length; i++) {
			if (newArr2[i].doc_catalog == "01") {
				newArr2[i].doc_catalog = "成品生产任务单";
			}
			if (newArr2[i].doc_catalog == "02") {
				newArr2[i].doc_catalog = "返工生产任务单";
			}

			if (newArr2[i].doc_status == "00") {
				newArr2[i].doc_status = "待执行";
			}
			if (newArr2[i].doc_status == "10") {
				newArr2[i].doc_status = "执行中";
			}
			if (newArr2[i].doc_status == "30") {
				newArr2[i].doc_status = "已执行";
			}
			if (newArr2[i].doc_status == "40") {
				newArr2[i].doc_status = "已上传";
			}
			if (newArr2[i].doc_status == "50") {
				newArr2[i].doc_status = "上传异常";
			}
			if (newArr2[i].source == "1") {
				newArr2[i].source = "接口";
			}
			if (newArr2[i].source == "2") {
				newArr2[i].source = "手动创建";
			}
		}

		var filename = '工单管理'
		var data = formatJson(filterVal, newArr2)
		arrayToExcel({
			header: tHeader,
			data,
			filename
		})
	}

	const detialexportExcel = async () => {
		if (state.search1.doc_no.length>0){
			let search = {
				...state.paginationExel,
				...state.search1,
			};
			await getRelationExcelList(search).then(res => {
				if (!res) {
					return false;
				}
				const fileName = '生产明细数据'+newDataTime();
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
		}else {
			ElMessage.error("请输入工单号之后再导出");
			return;
		}
	}

	// 重置页码
	const resetPagination = () => {
		state.pagination.current_page = 1;
	}

	// 重置页码
	const resetPagination2= () => {
		state.pagination2.current_page = 1;
	}
	// 记录选中
	const handleSelectionChange = (val) => {
		let ids = val.map((e) => e.user_id)
		state.checkIdList = ids;
	}

	// 切换每页条数
	const handleSizeChange = (size) => {
		state.pagination.page_size = size;
		queryWorkDocList();
	};

	// 切换每页条数
	const DetialhandleSizeChange = (size) => {
		state.pagination2.page_size = size;
		queryWorkDocLDetialList();
	};

	// 切换页码
	const handleCurrentChange = (pageNo) => {
		state.pagination.current_page = pageNo;
		queryWorkDocList();
	};

	// 搜索
	const handleSearch = () => {
		resetPagination();
		queryWorkDocList()
	}

	// 搜索明细
	const handleSearch2 = () => {
		resetPagination2();
		queryWorkDocLDetialList();
	}

	// 刷新
	const refresh = () => {
		queryWorkDocList();
	};

	//工单详情
	const handleDetial = (doc_no) => {
		state.dialogStatus = "details";
		state.dialogFormVisible2 = true;
		state.search1.doc_no=doc_no;
		queryWorkDocLDetialList(doc_no);
	};

	const handleCreate = async () => {
		state.siteList = [];//工厂
		state.sku_noList = [];// 产品列表
		state.brandList = [];//品牌列表
		state.plineList = [];//产线列表
		state.teamList = [];//产线列表
		resetTemp();
		state.temp.mfg_date = getNowFormatDate();
		const { data: role0 } = await getSitelList();
		for (let i = 0; i < role0.length; i++) {
			role0[i].site_name = role0[i].site_no + "-" + role0[i].site_name
		}
		state.siteList = role0;//加载工厂下拉框

		state.dialogStatus = 'create';
		state.dialogFormVisible = true;
	}
	// 重置表单绑定数据
	const resetTemp = () => {

		state.temp = {
			doc_no: "",
			sku_id: "",
			sku_no: "",
			sku_desc: "",
			mfg_date: "",
			lot_no: "",
			req_qty: "",
			extend2: "",
			site_id: "",
			site_no: "",
			site_name: "",
			team_id: "",
			team_no: "",
			team_name: "",
			brand_id: "",
			brand_no: "",
			brand_name: "",
			pline_id: "",
			pline_no: "",
			pline_name: "",
			customer_sku_no:"",
			bar_code:""
		}
	}

	// 添加用户
	const createData = () => {
		dataForm.value.validate(async (valid) => {
			if (valid)
			{
				if (state.temp.req_qty.toString().length > 6) {
					return elMessage({ message: "计划数量超出", type: 'error', duration: 2000 })
				}
				const result = await insertWorkDoc(state.temp);
				if (result.code === 200) {
					queryWorkDocList();
					state.dialogFormVisible = false;
					elMessage({ message: result.msg, type: 'success', duration: 2000 })
				}
			}
		});
	}

	//加载产品
	const changeSkuDesc = (date) => {

		var onjVal = {};

		state.sku_noList.forEach((val) => {

			if (val.sku_no == date) {
				onjVal = val;
			}
		})
		console.log(onjVal.sku_desc, "sku_desc");
		state.temp.sku_desc = onjVal.sku_desc;
		state.temp.sku_id = onjVal.material_id;
		state.temp.customer_sku_no = onjVal.customer_sku_no;
		state.temp.bar_code = onjVal.bar_code;
	};

	//加载班组
	const changeTeam = (date) => {
		var onjVal = {};
		state.teamList.forEach((val) => {

			if (val.team_no == date) {
				onjVal = val;
			}
		})
		console.log(onjVal.team_name, "team_name");
		state.temp.team_name = onjVal.team_name.toString().split("-")[1];
		state.temp.team_no = onjVal.team_no;
		state.temp.team_id = onjVal.team_id;
	};

	//加载产线
	const changePline = (date) =>
	{
		var onjVal = {};

		state.plineList.forEach((val) =>
		{
			if (val.pline_no == date) {
				onjVal = val;
			}
		})
		console.log(onjVal.pline_name, "pline_name");
		state.temp.pline_name = onjVal.pline_name.toString().split("-")[1];
		state.temp.pline_id = onjVal.pline_id;

		state.temp.sku_desc = "";
		state.temp.sku_no = "";
		state.temp.customer_sku_no = "";
		state.temp.bar_code = "";
	};


	//加载产线
	const siteChange = (date) =>
	{
		var onjVal = {};

		state.siteList.forEach((val) => {
			if (val.site_no == date) {
				onjVal = val;
			}
		})
		console.log(onjVal.site_name, "site_name");
		state.temp.site_name = onjVal.site_name.toString().split("-")[1];
		state.temp.site_id = onjVal.site_id;

		//重新选择了工厂之后要清空班组，品牌,产线信息
		state.temp.team_id = "";
		state.temp.team_no = "";
		state.temp.team_name = "";

		state.temp.brand_id = "";
		state.temp.brand_no = "";
		state.temp.brand_name = "";

		state.temp.pline_id = "";
		state.temp.pline_no = "";
		state.temp.pline_name = "";

		getSelectTeamList(onjVal.site_id).then(res => {
			for (let i = 0; i < res.data.length; i++) {
				res.data[i].team_name = res.data[i].team_no + "-" + res.data[i].team_name
			}
			state.teamList = res.data;//加载班组下拉框
		});

		getSiteBrandList(onjVal.site_id).then(res => {
			for (let i = 0; i < res.data.length; i++) {
				res.data[i].brand_name = res.data[i].brand_no + "-" + res.data[i].brand_name
			}
			state.brandList = res.data;//加载品牌下拉框
		});

		getSelectPlineList(onjVal.site_id).then(res => {
			for (let i = 0; i < res.data.length; i++) {
				res.data[i].pline_name = res.data[i].pline_no + "-" + res.data[i].pline_name
			}
			state.plineList = res.data;//加载产线下拉框
		});
	};

	//加载品牌
	const changeBrand = (date) =>
	{
		var onjVal = {};

		state.brandList.forEach((val) =>
		{
			if (val.brand_no == date) {
				onjVal = val;
			}
		})
		state.temp.brand_name = onjVal.brand_name.toString().split("-")[1];
		state.temp.brand_no = onjVal.brand_no;
		state.temp.brand_id = onjVal.brand_id;

		getMaterialListByBrandNo(onjVal.brand_no).then(res =>
		{
			for (let i = 0; i < res.data.length; i++)
			{
				// res.data[i].bar_code = res.data[i].sku_no + "-" + res.data[i].customer_sku_no + "-" + res.data[i].bar_code;
				res.data[i].bar_code = res.data[i].sku_no + "-" + res.data[i].sku_desc;
			}
			state.sku_noList = res.data; // 加载产品下拉框
		});
	};

	//加载状态
	const changeStatus = (date) =>
	{
		var onjVal = {};
		state.statusList.forEach((val) => {

			if (val.doc_status == date) {
				onjVal = val;
			}
		})
		state.doc_status = onjVal.doc_status;
	};

	//加载状态
	const changeSiteForm = (date) => {
		var onjVal = {};
		state.siteFormList.forEach((val) => {

			if (val.site_no == date) {
				onjVal = val;
			}
		})
		state.site_no = onjVal.site_no;
	};

	// 单个删除
	const handleDelete = (index) =>
	{
		let item = state.list[index];
		ElMessageBox.confirm(`是否删除当前工单 ${item.doc_no} ？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(async () => {
			await deleteWorkDoc(item.workdoc_id).then(res =>
			{
				if (res.code === 200) {
					ElMessage.success('删除成功!');
					queryWorkDocList();
				}
			}).catch(() => {
				queryWorkDocList();
			})
		}).catch(() => {
			console.log('已取消删除');
		})
	}

	const handleUpload = (index) =>
	{
		let item = state.list[index];
		ElMessageBox.confirm(`确定要上传数据吗？`, '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(async () =>
		{
			await uploadWorkDoc({doc_no:item.doc_no}).then(res =>
			{
				if (res.code === 200)
				{
					ElMessage.success('上传成功!');
					queryWorkDocList();
				}
			}).catch(() => {
				queryWorkDocList();
			})
		}).catch(() => {
			console.log('已取消上传');
		})
	}

	return {
		...toRefs(state),
		dataForm,
		resetForm,
		handleUpload,
		queryWorkDocList,
		queryWorkDocLDetialList,
		refresh,
		handleSearch,
		handleDetial,
		handleSelectionChange,
		handleSizeChange,
		handleCurrentChange,
		handleCreate,
		createData,
		changeSkuDesc,
		handleDelete,
		changeStatus,
		changeBrand,
		changeTeam,
		changePline,
		siteChange,
		changeSiteForm,
		exportExcel,
		detialexportExcel,
		handleSearch2,
		DetialhandleSizeChange,
	}
}


function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}
