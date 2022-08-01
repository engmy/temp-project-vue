import storage from '@/utils/storage'
import { elMessage } from 'element-plus'
import { deepTree, revisePath } from '@/utils'
import { getMenuList, getPermissionMenu } from "@/api/system/menu";
import { getRoleDataInfo } from '@/api/system/role'

const state = () => ({
	// 菜单列表
	menuGroup: storage.get('menuGroup') || [],
	// 路由列表
	viewRoutes: storage.get('viewRoutes') || [],
	//菜单折叠状态
	collapse: storage.get('collapse') || false,
})

const mutations =
{
	SET_MENU_GROUP(state, list) {
		state.menuGroup = list
		storage.set('menuGroup', list)
	},
	SET_VIEW_ROUTES(state, list) {
		state.viewRoutes = list
		storage.set('viewRoutes', list)
	},
	SET_COLLASPE(state, value = false) {
		state.collapse = value
		storage.set('collapse', value)
	},
	CLEAR_MENU_GROUP(state) {
		state.menuGroup = []
		storage.remove('menuGroup')
	},
	CLEAR_VIEW_ROUTES(state) {
		state.viewRoutes = []
		storage.remove('viewRoutes')
	}
}

const actions =
{
	async generateRoutes({ commit }) {
		return new Promise((resolve, reject) => {
			getPermissionMenu().then((result) => {
				const menus = result.data;
				const routes = menus.map((e) => {
					return {
						id: e.menu_id,
						parent_id: e.parent_id,
						path: revisePath(e.url),
						view_path: e.view_path,
						name: e.menu_name,
						sort: e.sort * 1,
						icon: e.icon,
						type: e.url_type,
						permission: e.permission,
						create_time: e.create_time,
						update_time: e.update_time,
						meta: {
							keepAlive: true,
							title: e.menu_name,
							type: e.url_type,
							icon: e.icon,
							show: e.status,
							sort: e.sort * 1,
						},
						children: [],
					}
				})

				// 设置菜单组
				commit('SET_MENU_GROUP', deepTree(routes))

				// 设置视图路由
				commit('SET_VIEW_ROUTES', routes)
				resolve(routes)
			}).catch((err) => {
				elMessage.error({ message: '"菜单加载异常"', type: 'error' })
				reject(err)
			})
		})
	},

	async getTreeMenuList() {
		return new Promise((resolve, reject) => {
			getMenuList().then((result) => {
				const menus = result.data;
				const routes = menus.map((e) => {

					return {
						id: e.menu_id,
						parent_id: e.parent_id,
						path: revisePath(e.url),
						view_path: e.view_path,
						name: e.menu_name,
						sort: e.sort * 1,
						icon: e.icon,
						status: e.status,
						type: e.url_type,
						permission: e.permission,
						create_time: e.create_time,
						update_time: e.update_time,
						children: [],
					}
				})
				
				return resolve(routes);
			}).catch((err) => {
				elMessage.error({ message: '"菜单加载异常"', type: 'error' })
				reject(err)
			})
		})
	},


	async getTreeRoleDataList() {
		return new Promise((resolve, reject) => {
			getRoleDataInfo().then((result) => {
				const menus = result.data;
				const routes = menus.map((e) => {
					return {
						id: e.menu_id,
						parent_id: e.parent_id,
						name: e.name,
						sort: e.sort * 1,
						children: [],
					}
				})
				return resolve(routes);
			}).catch((err) => {
				elMessage.error({ message: '"菜单加载异常"', type: 'error' })
				reject(err)
			})
		})
	}
}

export default { namespaced: true, state: state, actions: actions, mutations: mutations }
