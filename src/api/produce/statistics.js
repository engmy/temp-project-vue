import request from '../../http/request'


export function getEchartsData(data) {
	return request({
		method: "GET",
		url: '/admin/stats/echarts_data',
		params: data
	})
}

export function getEchartsDataGroupDayByMonth(data) {
	return request({
		method: "GET",
		url: '/admin/stats/echarts_data_by_day',
		params: data
	})
}

// 获取最近七天的单品数据
export function getEchartsDataGroupOnWeek(data) {
	return request({
		method: "GET",
		url: '/admin/stats/echarts-data-by-week',
		params: data
	})
}
// 测试数据
export function getEchartsDataTest() {
	return request({
		method: "GET",
		url: '/admin/stats/test',
	})
}
