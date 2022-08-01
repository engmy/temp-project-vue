import request from '../../http/request'
// 获取产线产线列表
export function getPlineList(data) {
  return request({
    method: "GET",
    url: '/admin/pline',
    params: data
  })
}

// 添加一个新产线
export function addPline(data) {
  return request({
    method: "POST",
    url: '/admin/pline',
    data
  })
}


// 修改产线信息
export function editPline(data) {
  return request({
    method: "PUT",
    url: '/admin/pline',
    data
  })
}

// 删除产线信息
export function deletePline(data) {
  return request({
    method: "DELETE",
    url: '/admin/pline',
    data
  })
}

// 获取产线分组
export function getPlineSpecs(data) {
  return request({
    method: "GET",
    url: '/admin/pline/pline-specs',
    params: data
  })
}

export function getSelectPlineList(data) {
  return request({
    method: "GET",
    url: '/admin/pline/' + data
  })
}