import request from '../../http/request'

// 外箱数据
export function getCartonList(data)
{
    return request({
        method: "GET",
        url: '/admin/carton',
        params: data
    })
}

// 导出外箱数据
export function exportExcel(data)
{
    return request({
        method: "GET",
        url: '/admin/carton/export',
        responseType: 'blob',
        params: data
    })
}