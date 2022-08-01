import { getToken } from '@/utils/auth';
import { getLocale } from '@/i18n';
import storage from '@/utils/storage'

const state = () => ({
	language: getLocale(),
	configDate: [], // 系统配置信息，标志该系统是什么系统
})

const actions = {
	appLoad({ dispatch }) {
		if (getToken()) {
			dispatch("menu/generateRoutes", null, { root: true });
			dispatch("user/queryUserInfo", null, { root: true });
		}
	},
	setLanguage({ commit }, language) {
		commit('SET_LANGUAGE', language)
	},
	addConfig(context, configDate) {
		context.commit('SET_CONFIG', configDate)
	}
}

const mutations = {
	SET_LANGUAGE: (state, language) => {
		state.language = language
		storage.set('language', language)
	},
	SET_CONFIG: (state, configDate) => {
		state.configDate = configDate;
	}
}

export default {
	namespaced: true,
	state: state,
	actions: actions,
	mutations: mutations
}