class WebSocketService {
    constructor() {
        this.ws = null
        this.connected = false
    }

    connect(messageCallback) {
        this.ws = new WebSocket('ws://localhost:8092/websocket')

        this.ws.onopen = () => {
            this.connected = true
            console.log('WebSocket连接成功')
        }

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            messageCallback(message)
        }

        this.ws.onerror = (error) => {
            console.error('WebSocket错误:', error)
            this.connected = false
        }

        this.ws.onclose = () => {
            console.log('WebSocket连接关闭')
            this.connected = false
        }
    }

    sendMessage(message) {
        console.log(message)
        if (this.ws && this.connected) {
            this.ws.send(JSON.stringify(message))
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close()
            this.connected = false
        }
    }
}

export default new WebSocketService()