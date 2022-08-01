import NProgress from 'nprogress';
import { checkToken, getVerify } from '@/utils/auth';
import { useStore } from '@/store';

NProgress.configure({ showSpinner: false });

const loginIgnore = {
	names: ['404', '401'],      //根据路由名称匹配
	paths: ['/login'],   //根据路由fullPath匹配
	// 判断路由是否包含在该配置中
	includes(route) {
		return this.names.includes(route.name) || this.paths.includes(route.path)
	}
}

// 加载路由守卫
export function loadGuards(router) {
	router.beforeEach(async (to, from, next) => {
		if (!NProgress.isStarted()) {
			NProgress.start()
		}
		if (checkToken()) {
			if (to.name == 'login') {
				next({ path: '/login' })
				NProgress.done();
			} else {
				const hasRoute = router.hasRoute(to.name);
				const store = useStore();
				if (hasRoute) {
					if (!store.getters.userInfo) {
						await store.dispatch('user/getUserInfo');
					}
					await store.commit('process/ADD_PROCESS', {
						keepAlive: to.meta.keepAlive,
						label: to.meta.title,
						value: to.fullPath,
						name: to.name
					})
					// 注意刷新时路由要比实例先创建好 所以会存在vuex中的数据丢失或未完成加载，这里就从cookis中获取状态
					// 需要修改密码 放行，，并且跳转到的位置不是首页 否则会无限的跳转。如果是跳转登录页 即超时退出时也不能进行拦截
					if (getVerify() - 0 !== 201 && to.name !== '首页' && to.name !== "Login") {
						next('/')
					} else {
						next()
					}
					//next()
				} else {
					next({ ...to, replace: true })
				}
			}
		} else {
			if (!loginIgnore.includes(to)) {
				next({
					path: "/login",
					replace: true
				});
				NProgress.done();
			} else {
				next()
			}
		}
	})

	router.afterEach(() => {
		NProgress.done()
	})
}
