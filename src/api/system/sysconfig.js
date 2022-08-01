import request from '../../http/request'

// 获取配置配置列表
export function getConfigList() {
  return request({
    method: "GET",
    url: '/admin/config/list'
  })
}

// 读取指定配置的详情
export function getConfigData(data) {
  return request({
    method: "GET",
    url: '/admin/config/data',
    params: data
  })
}

// 页面加载时获取的配置信息
export function sys_config() {
  return request({
    method: "GET",
    url: '/admin/config/sys_config',
  })
}

// 修改配置信息 传输list
export function updateConfigData(data) {
  return request({
    method: "PUT",
    url: '/admin/config/update',
    data
  })
}

// 添加一个配置信息
export function insertConfigData(data) {
  return request({
    method: "POST",
    url: '/admin/config/insert',
    data
  })
}

// 根据id删除配置信息
export function deleteConfigData(data) {
  return request({
    method: "DELETE",
    url: '/admin/config/delete',
    data
  })
}
