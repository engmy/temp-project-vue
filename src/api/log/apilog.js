import request from '../../http/request'



// 接口日志列表
export function getApiLogList(data) {
    return request({
        method: "GET",
        url: '/admin/apilog',
        params: data
    })
}