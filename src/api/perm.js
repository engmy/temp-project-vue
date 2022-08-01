import request from '../http/request'

// 获取权限列表
export function getPermissionList()
{
	return request({
		method: "GET",
		url: 'admin/permission/list',
	});
}
