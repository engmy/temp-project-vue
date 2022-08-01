import { toRaw } from 'vue'
export default {
    // 用户token
    token: (state) => state.user.token,
    // 用户信息
    userInfo: (state) => state.user.userInfo,
    // 菜单列表
    menuGroup: (state) => toRaw(state.menu.menuGroup),
    // 路由列表
    viewRoutes: (state) => toRaw(state.menu.viewRoutes),
    // 菜单是否展开
    menuCollapse: (state) => state.menu.collapse,
    // 窗口列表
    processList: (state) => state.process.list,
    // 语言包
    language: (state) => state.app.language,
    // 按钮权限
    permList: (state) => state.perm.permList,
    // 配置信息
    configeData: (state) => state.app.configDate,
    // 用户登录状态 false：需要强制修改密码
    userVerify: (state) => state.user.verify,
    // 获取用户密码更改原因
    updateMsg: (state) => state.user.msg,
}