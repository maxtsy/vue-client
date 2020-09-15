import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

export default {
    install (Vue, options) {
        const connection = new HubConnectionBuilder()
                .withUrl("http://localhost:5000/hubs/callboard")
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build()

        connection.start()

        const callBoardHub = new Vue()
        Vue.prototype.$callBoardHub = callBoardHub
        /** 
         * Джоб, вызывающий серверный метод GetCallsList, возвращающий список звонков по клиенту 
         */
        connection.on('CallBoardService', (msg) => { 
            connection.invoke("GetCallsList", OMInsurance.login).catch(err => console.error(err))
        })
        /**
         * Подписка на событие CallsList - список звонков по клиенту
         */
        connection.on("CallsList", (msg) => {           
            callBoardHub.$emit('callboard-list', { msg })
        })
    }
}