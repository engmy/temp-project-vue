import request from '../../http/request'



// 接口日志列表
export function getProductLogList(data) {
    return request({
        method: "GET",
        url: '/admin/prolog/list',
        params: data
    })
}