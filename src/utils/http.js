import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// 创建axios实例
const http = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        const authStore = useAuthStore();
        const token = authStore.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 未授权，清除token并跳转到登录页
                    const authStore = useAuthStore();
                    authStore.logout();
                    window.location.href = '/login';
                    break;
                case 403:
                    // 权限不足
                    console.error('权限不足');
                    break;
                case 404:
                    // 资源不存在
                    console.error('请求的资源不存在');
                    break;
                case 500:
                    // 服务器错误
                    console.error('服务器错误');
                    break;
                default:
                    console.error('请求错误:', error.message);
            }
        }
        return Promise.reject(error);
    }
);

export default http; 