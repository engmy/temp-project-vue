import request from '../../http/request'

// 托盘数据
export function getPalletList(data)
{
    return request({
        method: "GET",
        url: '/admin/pallet',
        params: data
    })
}

// 删除托盘数据
export function deletePallet(data)
{
    return request({
        method: "DELETE",
        url: '/admin/pallet/' + data
    })
}

// 托盘明细
export function getPalletDetial(data)
{
    return request({
        method: "GET",
        url: '/admin/pallet/'+data
    })
}

// 托盘数据导出
export function getPalletExcel(data)
{
    return request({
        method: "GET",
        url: '/admin/pallet/excel',
        responseType: 'blob',
        params: data
    })
}