import request from '../../http/request'
// 获取配工厂列表
export function getSiteList(data) {
  return request({
    method: "GET",
    url: '/admin/site',
    params: data
  })
}

// 根据公司id获取配工厂列表
export function getSiteListByComPk(data) {
  return request({
    method: "GET",
    url: '/admin/site/list',
    params: data
  })
}

// 添加一个新工厂
export function addSite(data) {
  return request({
    method: "POST",
    url: '/admin/site',
    data
  })
}

// 改变工厂的可用状态
export function changeSiteStatus(data) {
  return request({
    method: "PUT",
    url: '/admin/site/change',
    data
  })
}

// 修改工厂信息
export function editSite(data) {
  return request({
    method: "PUT",
    url: '/admin/site/edit',
    data
  })
}

// 删除工厂信息
export function deleteSite(data) {
  return request({
    method: "DELETE",
    url: '/admin/site',
    data
  })
}



// 产品信息列表
export function getSitelList(data) {
  return request({
    method: "GET",
    url: '/admin/site/role',
    params: data
  })
}