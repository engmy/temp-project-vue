import request from '../../http/request'

// 产品信息列表
export function getMaterialList(data) {
  return request({
    method: "GET",
    url: '/admin/material',
    params: data
  })
}

// 删除选中
export function deleteMaterial(data) {
  return request({
    method: "DELETE",
    url: '/admin/material',
    data
  })
}

export function addMaterial(data) {
  return request({
    method: "POST",
    url: '/admin/material',
    data
  })
}

export function editMaterial(data) {
  return request({
    method: "PUT",
    url: '/admin/material',
    data
  })
}

// 上传文件
export function uploadData(data) {
  return request({
    method: "POST",
    url: '/admin/material/excel',
    data,
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryMjtaRlvIest4AE9P'
    }
  })
}

// 模板下载
export function dowload(data) {
  return request({
    method: "POST",
    url: '/admin/material/template',
    responseType: 'blob',
    data
  })
}

// 产线查询物料
export function getMaterialByPlineId(pline_id)
{
  return request({
    method: "GET",
    url: '/admin/material/pline/' + pline_id,
  })
}

// 品牌查询物料
export function getMaterialListByBrandNo(brand_no)
{
  return request({
    method: "GET",
    url: '/admin/material/brand/' + brand_no,
  })
}

// 获取包装层级的信息
export function getRelationType(data) {
  return request({
    method: "GET",
    url: '/admin/material/relation-type',
    params: data
  })
}
