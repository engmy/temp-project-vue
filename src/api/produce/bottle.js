import request from '../../http/request'

// 托盘数据
export function getBottleList(data)
{
    return request({
        method: "GET",
        url: '/admin/bottle',
        params: data
    })
}
// 托盘导出
export function getBottleExcelList(data)
{
    return request({
        method: "GET",
        url: '/admin/bottle/export',
        responseType: 'blob',
        params: data
    })
}
