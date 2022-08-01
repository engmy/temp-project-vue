import request from '../../http/request'
// 获取公司列表 可分页
export function getcompanyList(data) {
  return request({
    method: "GET",
    url: '/admin/company',
    params: data
  })
}

// 获取所有的公司列表
export function getAllCompanyList() {
  return request({
    method: "GET",
    url: '/admin/company/allList'
  })
}

// 添加一个新公司
export function addCompany(data) {
  return request({
    method: "POST",
    url: '/admin/company',
    data
  })
}

// 改变公司的可用状态
export function changeCompanyStatus(data) {
  return request({
    method: "PUT",
    url: '/admin/company/change',
    data
  })
}

// 修改公司信息
export function editCompany(data) {
  return request({
    method: "PUT",
    url: '/admin/company/edit',
    data
  })
}

// 删除公司信息
export function deleteCompany(data) {
  return request({
    method: "DELETE",
    url: '/admin/company',
    data
  })
}