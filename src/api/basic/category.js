import request from '../../http/request'

// 获取分类树结构
export function getCategoryTree(data) {
  return request({
    method: "GET",
    url: '/admin/category/all_list',
    params: data
  })
}

// 添加一个分类
export function addCategory(data) {
  return request({
    method: "POST",
    url: '/admin/category/add',
    data
  })
}

// 获取分类的详情
export function getCategoryInfo(data) {
  return request({
    method: "GET",
    url: '/admin/category/' + data,
  })
}

// 修改分类的详情
export function editCategoryInfo(data) {
  return request({
    method: "PUT",
    url: '/admin/category/edit',
    data
  })
}

// 删除分类
export function deleteCategoryInfo(data) {
  return request({
    method: "DELETE",
    url: '/admin/category',
    data
  })
}