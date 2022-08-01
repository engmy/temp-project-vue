// 接口日志列表
import request from "@/http/request";

export function getOperLogList(data) {
    return request({
        method: "GET",
        url: '/admin/operlog',
        params: data
    })
}