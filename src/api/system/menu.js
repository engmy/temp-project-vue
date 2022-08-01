import request from '../../http/request'


// 获取权限菜单
export function getPermissionMenu()
{
	return request({
		method: "GET",
		url: 'admin/permission/menu',
	});
}

// 获取全部菜单
export function getMenuList()
{
	return request({
		method: "GET",
		url: '/admin/menu/tree'
	})
}

// 获取菜单信息
export function getMenuInfo(menuId)
{
	return request({
		method: "GET",
		url: '/admin/menu/' + menuId
	})
}

// 新增菜单
export function createMenu(data)
{
	return request({
		method: "POST",
		url: '/admin/menu',
		data
	})
}

// 编辑菜单
export function updateMenu(menuId, data)
{
	return request({
		method: "PUT",
		url: '/admin/menu/'+menuId,
		data
	})
}

// 删除菜单
export function deleteMenu(menuId)
{
	return request({
		method: "DELETE",
		url: '/admin/menu/'+menuId
	})
}

// 更新状态
export function updateStatus(data)
{
	return request({
		method: "PUT",
		url: '/admin/menu/change',
		data
	})
}