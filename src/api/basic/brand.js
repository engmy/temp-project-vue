import request from '../../http/request'
// 获取品牌品牌列表
export function getBrandList(data) {
  return request({
    method: "GET",
    url: '/admin/brand',
    params: data
  })
}

// 获取客户
export function customer(data) {
  return request({
    method: "GET",
    url: '/admin/brand/customer_list',
    params: data
  })
}


// 添加一个新品牌
export function addBrand(data) {
  return request({
    method: "POST",
    url: '/admin/brand',
    data
  })
}

// 获取品牌品牌列表
export function getSiteBrandList(data) {
  return request({
    method: "GET",
    url: '/admin/brand/' + data
  })
}


// 修改品牌信息
export function editBrand(data) {
  return request({
    method: "PUT",
    url: '/admin/brand',
    data
  })
}

// 删除品牌信息
export function deleteBrand(data) {
  return request({
    method: "DELETE",
    url: '/admin/brand',
    data
  })
}

// 获取品牌列表 后台会根据权限返回相应的品牌信息
export function getBrandListToRole() {
  return request({
    method: "GET",
    url: '/admin/brand/role_brandnoandname',
  })
}

// 修改品牌 单品码长度
export function editCode(data) {
  return request({
    method: "PUT",
    url: '/admin/brand/edit-code',
    data
  })
}

// 根据选择的工厂 获取品牌
export function getBrandListOnSiteId(data) {
  return request({
    method: "GET",
    url: '/admin/brand/brand-list',
    params: data
  })
}