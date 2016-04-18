import serverTask from './server.task.js'
import clientTask from './client.task.js'
import clientDev from './client.dev.js'
import clientPro from './client.pro.js'
import serverDev from './server.dev.js'
import serverPro from './server.pro.js'

export default (_opt) => {
    const gulp = _opt.gulp

    // 注册任务
    serverTask(_opt)
    clientTask(_opt)
    return {
        clientDev: clientDev(gulp),
        clientPro: clientPro(gulp),
        serverDev: serverDev(gulp),
        serverPro: serverPro(gulp)
    }
}
