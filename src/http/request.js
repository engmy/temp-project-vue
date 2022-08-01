import axios from 'axios'
import qs from 'qs';
import { elMessage } from 'element-plus'
import networkConfig from '../config/http.config'
import { getToken } from '@/utils/auth'
import { useStore } from '@/store'
import { showLoading, hideLoading } from '@/utils/loading'

const service = axios.create(networkConfig)

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

service.interceptors.request.use(
	config => {
		if (config.method.toLocaleUpperCase() === "GET" && config.params !== undefined && config.params.current_page !== undefined)
		{
			showLoading();
		}
		if (useStore().getters.token) {
			config.headers['token'] = getToken()
		}
		if (config.method === "POST") {
			config.data = qs.stringify(config.data)
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(response => {
	hideLoading()
	const res = response.data
	// 正常处理
	if (response.status === 200)
	{
		if (res.code == 400 || res.code == 500)
		{
			elMessage({ message: res.msg || '请求服务器异常', type: 'error', duration: 5 * 1000 })
			return Promise.reject(res);
		} else if (res.code == 403)
		{
			elMessage({
				message: res.msg, type: 'error', duration: 2 * 1000, onClose: function () {
					window.location.href = "#/login";
				}
			})
		} else if (res.code == 302)
		{
			elMessage({ message: res.msg || '', type: 'error', duration: 5 * 1000 })
		}
		return Promise.resolve(res);
	} else {
		elMessage({
			message: res.msg || '请求服务器异常',
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(new Error(res.msg || 'Error'))
	}
},
	error => {
		setTimeout(() => {
			hideLoading()
		}, 200)
		elMessage({ message: error.message || "Error",  type: 'error', duration: 5 * 1000 })
		return Promise.reject(error)
	}
)

export default service