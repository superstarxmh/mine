/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000, // 请求超时时间
    withCredentials: false
});

/*//返回其他状态吗
service.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500; // 默认的
};

//HTTPrequest拦截
service.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
});
//HTTPresponse拦截
service.interceptors.response.use(res => {
    return res.data;
}, error => {
    return Promise.reject(new Error(error));
});*/

export default service
