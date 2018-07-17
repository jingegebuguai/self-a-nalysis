import axios from 'axios'

axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.put['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.delete['X-Requested-With'] = 'XMLHttpRequest'
/*
let pending = [] //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = axios.CancelToken

let removePending = (config) => {
    for (let p in pending) {
        if (pending[p].url === config.url) {
            pending[p].cancel() //执行取消操作
            pending.splice(p, 1) //把这条记录从数组中移除
        }
    }
}

axios.interceptors.request.use(
    config => {
        removePending(config) //在一个ajax发送前执行一下取消操作
        config.cancelToken = new CancelToken((c) => {
            if (config.method === 'get') {
                pending.push({url: config.url, cancel: c})
            }
        })
        return config
    }, error => {
        return Promise.reject(error)
    }
)
*/

axios.interceptors.response.use(
    response => {
        // removePending(response.config)
        return response
    },
    error => {
        console.warn(JSON.stringify(error))
        if (error.response) {
            switch (error.response.status) {
                case 408:
                    console.warn("会话超时，即将刷新页面重新登录！", JSON.stringify(error))
                    // window.document.location.reload()
            }
        }
        return Promise.reject(error.response.data)
    }
)

export default axios