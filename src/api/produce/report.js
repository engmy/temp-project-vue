import request from '../../http/request'

// 获取质检报告
export function getProductReportList(data)
{
    return request({
        method: "GET",
        url: '/admin/report',
        params: data
    })
}

// 创建质检报告
export function createProductReport(data)
{
    return request({
        method: "POST",
        url: '/admin/report',
        data
    })
}

// 删除质检报告
export function deleteProductReport(report_id)
{
    return request({
        method: "DELETE",
        url: '/admin/report/' + report_id
    })
}

// 查看质检报告
export function getProductReportInfo(report_id)
{
    return request({
        method: "GET",
        url: '/admin/report/'+report_id,
        responseType: 'blob'
    })
}