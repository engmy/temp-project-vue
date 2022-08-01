import request from '../../http/request'

// 登录
export function login(data) {
	return request({
		method: "POST",
		url: '/admin/login',
		data
	});
}

// 退出登录
export function logout(data) {
	return request({
		method: "POST",
		url: '/admin/logout',
		data
	});
}

// 获取验证码
export function getCaptcha() {
	return request({
		method: "GET",
		url: "/admin/captcha",
	})
}

// 获取用户信息
export function getUserInfo() {
	return request({
		method: "GET",
		url: '/getUserInfo',
	});
}

// 用户列表
export function getUserList(data) {
	return request({
		method: "GET",
		url: '/admin/user',
		params: data
	})
}


// 添加用户
export function createUserInfo(data) {
	return request({
		method: "POST",
		url: "/admin/user",
		data
	})
}

// 根据用户id删除用户
export function deleteUserInfo(data) {
	return request({
		method: "DELETE",
		url: "/admin/user",
		data
	})
}

// 根据用户id修改用户信息
export function updateUserInfo(data) {
	return request({
		method: "PUT",
		url: "/admin/user",
		data
	})
}

// 更新用户账号状态
export function changeUserStatus(data) {
	return request({
		method: "PUT",
		url: "/admin/user/change",
		data
	})
}

// 角色信息
export function getRoleInfo(data) {
	return request({
		method: "POST",
		url: '/sys/role/info',
		data
	})
}

// 重置用户密码
export function resetUserPassword(data){
	return request({
		method: "PUT",
		url: '/admin/user/editpass',
		data
	})
}

// 重置用户密码
export function updateProfile(data){
	return request({
		method: "POST",
		url: '/admin/user/profile',
		data
	})
}

// 图片上传
export function updateUserAvatar(data){
	return request({
		method: "POST",
		url: '/admin/user/avatar',
		data
	})
}

// 图片上传
export function getUserAvatar(){
	return request({
		method: "GET",
		url: '/admin/user/avatar',
	})
}