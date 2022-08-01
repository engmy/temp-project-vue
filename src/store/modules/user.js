import { login, getUserInfo, getCaptcha, logout } from '@/api/system/user'
import { getToken, setToken, removeToken, setVerify } from '@/utils/auth'
import storage from '@/utils/storage'

const state = () => ({
	token: getToken() || null,
	userInfo: storage.get('userInfo') || {},
	verify: 201,
	msg: '',// 密码更改说明
})

const mutations = {
	SET_TOKEN(state, token) {
		setToken(token)
		state.token = token
	},
	SET_USERINFO(state, userInfo) {
		storage.set('userInfo', userInfo)
		state.userInfo = userInfo
	},
	SET_VERIFY(state, verify) {
		setVerify(verify);
		state.verify = verify
	},
	SET_MSG(state, value) {
		state.msg = value
	},
	CLEAR_USER(state) {
		state.userInfo = {}
		storage.remove('userInfo')
		storage.remove('permList')
		storage.remove('permList')
	},
	CLEAR_TOKEN(state) {
		state.token = null
		removeToken()
	}
}

const actions =
{
	// 将用户状态设置为正常
	async set_verify_ok({ commit }) {
		commit('SET_VERIFY', 201)
	},
	async getCaptcha() {
		return getCaptcha().then(res => {
			return Promise.resolve(res);
		})
	},
	// 用户登录
	async login({ commit }, form) {
		return login(form).then((res) => {
			if (res.code == 200) {
				commit('SET_TOKEN', res.data.token)
				commit('SET_USERINFO', res.data.user)
				// 100：初始密码，101：密码过期，102：弱密码  201:正常
				commit('SET_VERIFY', res.data.verify)
				commit('SET_MSG', res.msg)
			}
			return Promise.resolve(res);
		})
	},
	// 退出登录
	logout({ commit }) {
		return logout().then((res) => {
			if (res.code == 200) {
				commit('CLEAR_USER')
				commit('CLEAR_TOKEN')
				commit('menu/CLEAR_MENU_GROUP', null, { root: true })
				commit('menu/CLEAR_VIEW_ROUTES', null, { root: true })
				commit('process/RESET_PROCESS', null, { root: true })
			}
			return Promise.resolve(res);
		})
	},
	// 设置用户信息
	setUserInfo({ commit }, userInfo) {
		commit('SET_USERINFO', userInfo)
	},
	// 获取用户信息
	async getUserInfo({ commit }) {
		return getUserInfo().then((res) => {
			commit('SET_USERINFO', res.data.userInfo)
			return res.data.userInfo
		})
	},
	// 清空用户状态
	async clearStore({ commit }) {
		commit('CLEAR_USER')
		commit('CLEAR_TOKEN')
		commit('menu/CLEAR_MENU_GROUP', null, { root: true })
		commit('menu/CLEAR_VIEW_ROUTES', null, { root: true })
		commit('process/RESET_PROCESS', null, { root: true })
	}
}

export default {
	namespaced: true,
	state: state,
	actions: actions,
	mutations: mutations,
}
