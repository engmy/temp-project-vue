import Cookies from 'js-cookie'

const TokenKey = 'Authorization';
const verifyKey = 'verify_user_stata';

export function getToken() {
	return Cookies.get(TokenKey)
}

export function setToken(token) {
	return Cookies.set(TokenKey, token)
}

export function removeToken() {
	return Cookies.remove(TokenKey)
}

export function checkToken() {
	if (Cookies.get(TokenKey)) {
		return true;
	} else {
		return false;
	}
}

// 刷新时路由要比实例先创建好 所以会存在vuex中的数据丢失或未完成加载
export function setVerify(verify) {
	return Cookies.set(verifyKey, verify)
}
export function getVerify() {
	return Cookies.get(verifyKey)
}
