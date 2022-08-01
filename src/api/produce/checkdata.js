import request from '../../http/request'

export function getList(data) {
    return request({
        method: "GET",
        url: '/admin/stats',
        params: data
    })
}

