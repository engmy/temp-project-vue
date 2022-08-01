import request from '../../http/request'

// 中台数据列表
export function getList(data) {
    return request({
        method: "GET",
        url: '/admin/product',
        params: data
    })
}

// 工单查询
export function getView(data) {
    return request({
        method: "GET",
        url: '/admin/product/view',
        params: data
    })
}