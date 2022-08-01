import request from '../../http/request'

// 更新个人资料
export function updateProfile(data) {
	return request({
		method: "POST",
		url: '/admin/profile',
		data
	})
}

// 上传头像
export function getUserAvatar() {
	return request({
		method: "GET",
		url: '/admin/profile/avatar',
		responseType: 'arraybuffer',
	})
}

// 修改个人密码
export function updatePassword(data) {
	return request({
		method: "PUT",
		url: '/admin/profile/password',
		data
	})
}

// 强制修改登录密码
export function compulsoryUpdatePassword(data) {
	return request({
		method: "PUT",
		url: '/admin/profile/forcibly-password',
		data
	})
}