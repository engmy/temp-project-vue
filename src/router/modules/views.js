const routes = {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    children: [
        {
            path: '/',
            name: '首页',
            component: () => import('@/views/dashboard/index/index'),
            meta: {
                title: '首页',
                show: true,
                keepAlive: 1,
                icon: 'desktop',
                type: 2,
            }
        },
        {
            path: '/admin/profile',
            name: '个人中心',
            component: () => import('@/views/dashboard/profile/index.vue'),
            meta: {
                title: '个人中心',
                show: true,
                keepAlive: 1,
                icon: 'desktop',
                type: 2,
            }
        }
    ]
}

export default routes;