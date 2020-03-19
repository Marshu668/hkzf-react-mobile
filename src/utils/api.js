import axios from 'axios'
import {BASE_URL} from './url'

// 创建axios实例  设置环境变量，再想发送请求，直接调用封 的API对象
const API = axios.create({
    baseURL: BASE_URL
})

// 导出 创建的对象
export {API}