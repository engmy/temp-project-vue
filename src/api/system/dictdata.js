import request from '../../http/request'

// 字典列表
export function getDictDataList(data) {
	return request({
		method: "GET",
		url: '/admin/dict/data',
		params: data
	})
}

// 字典信息
export function getDictDataInfo(dataId)
{
	return request({
		method: "GET",
		url: '/admin/dict/data/'+dataId,
	})
}

// 新增字典
export function createDictData(data)
{
	return request({
		method: "POST",
		url: '/admin/dict/data',
		data
	})
}

// 编辑字典
export function updateDictData(dataId, data)
{
	return request({
		method: "PUT",
		url: '/admin/dict/data/'+dataId,
		data
	})
}

// 删除字典
export function deleteDictData(dataId)
{
	return request({
		method: "DELETE",
		url: '/admin/dict/data/'+dataId
	})
}

// 更新状态
export function updateStatus(data)
{
	return request({
		method: "PUT",
		url: '/admin/dict/data/change',
		data
	})
}