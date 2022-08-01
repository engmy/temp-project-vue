import request from '../../http/request'

// 获取计划任务列表
export function getTaskList(data) {
  return request({
    method: "GET",
    url: "/admin/task/list",
    params: data
  })
}

// 更新计划任务状态
export function changeTaskStatus(data) {
	return request({
		method: "PUT",
		url: "/admin/task/change",
		data
	})
}

// 更新计划任务状态
export function createTask(data) {
	return request({
		method: "POST",
		url: "/admin/task/insert",
		data
	})
}

// 修改任务
export function updateTask(data){
  return request({
		method: "PUT",
		url: "/admin/task/update",
		data
	})
}

// 删除任务
export function deleteTask(data){
  return request({
		method: "DELETE",
		url: "/admin/task/delete",
		data
	})
}