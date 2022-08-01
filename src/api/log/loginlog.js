import request from '../../http/request'



// 接口日志列表
export function getLoginLogList(data) {
    return request({
        method: "GET",
        url: '/admin/loginlog',
        params: data
    })
}