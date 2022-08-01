export const deepTree = (list) => {
	let newList = []
	let map = {}
	list.forEach((e) => (map[e.id] = e))
	list.forEach((e) => {
		let parent = map[e.parent_id]
		if (parent) {
			(parent.children || (parent.children = [])).push(e)
		} else {
			if (!e.parent_id || e.parent_id == "0") {
				newList.push(e)
			}
		}
	})

	const fn = (list) => {
		list.map((e) => {
			if (e.children instanceof Array) {
				e.children = orderBy(e.children, 'sort')
				fn(e.children)
			}
		})
	}
	fn(newList)
	let listOrderBy = orderBy(newList, 'sort')
	return listOrderBy;
}

export function orderBy(list, key) {
	return list.sort((a, b) => a[key] - b[key])
}

export const revisePath = (path) => {
	if (!path) {
		return ''
	}

	if (path[0] == '/') {
		return path
	} else {
		return `/${path}`
	}
}

export const isNull = (value) => {
	return value === '' || value === undefined || value === null
}

// 时间格式化
export function formatDate(date) {
	let new_date = new Date(date);
	return new_date.toLocaleDateString().replace(/\//g, "-") + " "
		+ new_date.toTimeString().substr(0, 8);
}

// 给绘图工具添加一个属性
export function addOptionOnTip(option) {
	// 处理 tooltip 浮层展示形式
	let tooltip = {
		trigger: "axis",
		showContent: true,
		triggerOn: "mousemove|click",
		formatter: function (params) {
			let txt = '';
			params.forEach(p => {
				txt += p.name + '<br/>' + p.seriesName + ':' + p.data + '<br/>';
			});
			return txt;
		},
		axisPointer: {
			type: "cross",
			label: {
				backgroundColor: "#283b56",
			},
		},
	}
	let tip = {
		tooltip
	}
	return Object.assign(option, tip)
}

// 验证输入框中是否有特殊字符
export function checkInputValue(rule, value, callback) {
	if (value) {
		var regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/im,
			regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
		if (regEn.test(value) || regCn.test(value)) {
			return callback(new Error("该项禁止输入特殊字符"));
		} else {
			return callback();
		}
	} else {
		return callback(new Error("该项不能为空"));
	}
}

// 验证输入框的数字是否小于0
export function checkNumber(rule, value, callback) {
	if (value) {
		if (value - 0 < 0) {
			return callback(new Error("不能小于零"));
		} else {
			return callback();
		}
	} else {
		return callback();
	}
}

export function strongVerifiOfPassword(rule, value, callback) {
	if (value) {
		// 2022-02-14 要求 密码长度设置为至少8位 不做特殊字符的限制
		if (value.length < 8) {
			return callback(new Error("密码长度不能小于8位"));
		}
		// if (!new RegExp("^(?=.*?[A-Za-z]+)(?=.*?[0-9]+)(?=.*?[A-Z])(?=.*?[!@#$%^&*]).*$").test(value)) {
		// 	return callback(new Error("至少要有一个大写字母、一个数字、一个特殊字符"));
		// }
		return callback();
	} else {
		return callback(new Error("该项不能为空"));
	}

}