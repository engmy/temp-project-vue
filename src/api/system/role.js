import request from '../../http/request'

// 角色列表
export function getRoleList(data) {
	return request({
		method: "GET",
		url: '/admin/role',
		params: data
	})
}

// 角色列表
export function getRoleAllList()
{
	return request({
		method: "GET",
		url: '/admin/role/list',
	})
}


// 角色信息
export function getRoleInfo(roleId) {
	return request({
		method: "GET",
		url: '/admin/role/' + roleId,
	})
}

// 新增角色
export function createRole(data) {
	return request({
		method: "POST",
		url: '/admin/role',
		data
	})
}

// 新增角色
export function createRolebrand(data) {
	return request({
		method: "POST",
		url: '/admin/role/insertrolebrand',
		data
	})
}

// 编辑角色
export function updateRole(roleId, data) {
	return request({
		method: "PUT",
		url: '/admin/role/' + roleId,
		data
	})
}

// 删除角色
export function deleteRole(roleId) {
	return request({
		method: "DELETE",
		url: '/admin/role/' + roleId
	})
}

// 更新状态
export function updateStatus(data) {
	return request({
		method: "PUT",
		url: '/admin/role/change',
		data
	})
}


export function getRoleDataInfo(data) {
	return request({
		method: "GET",
		url: '/admin/role/roledatalist',
		params: data
	})
}

// 根据角色id获取 角色-品牌信息
export function getRoleAndBrandInfo(data) {
	return request({
		method: "GET",
		url: '/admin/role/info',
		params: data
	})
}