import request from '../../http/request'

// 字典列表
export function getDictList(data) {
	return request({
		method: "GET",
		url: '/admin/dict',
		params: data
	})
}

// 字典信息
export function getDictInfo(dictId)
{
	return request({
		method: "GET",
		url: '/admin/dict/' + dictId,
	})
}

// 新增字典
export function createDict(data)
{
	return request({
		method: "POST",
		url: '/admin/dict',
		data
	})
}

// 编辑字典
export function updateDict(dictId, data)
{
	return request({
		method: "PUT",
		url: '/admin/dict/'+dictId,
		data
	})
}

// 删除字典
export function deleteDict(dictId)
{
	return request({
		method: "DELETE",
		url: '/admin/dict/'+dictId
	})
}

// 更新状态
export function updateStatus(data)
{
	return request({
		method: "PUT",
		url: '/admin/dict/change',
		data
	})
}