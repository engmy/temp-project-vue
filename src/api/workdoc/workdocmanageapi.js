import request from '../../http/request'

// 接口日志列表
export function getWorkDocList(data) {
    return request({
        method: "GET",
        url: '/admin/workdoc',
        params: data
    })
}

// 新增工单
export function insertWorkDoc(data) {
    return request({
        method: "POST",
        url: "/admin/workdoc",
        data
    })
}

// 根据工单id删除工单信息
export function deleteWorkDoc(data) {
    return request({
        method: "DELETE",
        url: "/admin/workdoc/" + data
    })
}

//工单详情
export function getRelationList(data) {
    return request({
        method: "GET",
        url: '/admin/workdoc/details',
        params: data
    })
}

//工单详情
export function getRelationExcelList(data) {
    return request({
        method: "GET",
        url: '/admin/workdoc/detailsexport',
        responseType: 'blob',
        params: data
    })
}

//工单上传
export function uploadWorkDoc(data)
{
    return request({
        method: "POST",
        url: '/admin/workdoc/upload',
        data
    })
}