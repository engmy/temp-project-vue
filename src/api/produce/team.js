import request from '../../http/request'

// 托盘数据
export function getTeamList(data)
{
    return request({
        method: "GET",
        url: '/admin/team',
        params: data
    })
}

// 新增工单
export function inserTeam(data) {
    return request({
        method: "POST",
        url: "/admin/team",
        data
    })
}
// 删除托盘数据
export function deleteTeam(data)
{
    return request({
        method: "DELETE",
        url: '/admin/team/' + data
    })
}
export function editTeam(data) {
    return request({
        method: "PUT",
        url: '/admin/team',
        data
    })
}

//班组查询，编号，名称
export function getSelectTeamList(data)
{
    return request({
        method: "GET",
        url: '/admin/team/' + data
    })
}
