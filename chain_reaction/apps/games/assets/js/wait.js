function wait(ws) {
    ws.socket.onopen = () => {
        ws.send({action: 'join'})
    }

    ws.listen((action, stream) => {
        console.log(action, stream)
        if ("url" in action) {
            window.location = action.url
        }
    })
}

module.exports = wait
