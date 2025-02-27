import axios from "axios";
import { Toast } from "vant";
import { userRouter } from "vue-router"
axios.defaults.baseURL = import.meta.env.MODE === 'development'
  ? '//localhost:7001'
  : '//47.99.134.126:7008';
axios.defaults.withCredentials = true; 
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["token"] = localStorage.getItem("token") || "";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.response.use((res)=>{
    const router = userRouter()
    if(typeof res.data !== "object"){
        return Promise.reject(res);
    }
    if(res.data.code!==200){
        if(res.data.msg) Toast.fail(res.data.msg);
        if(res.data.code == 401){
            router.push('/login')
        }
        return Promise.reject(res.data.data)
    }
    return res.data
})
export default axios