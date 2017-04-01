function wait(ws) {
    ws.listen((action, stream) => {
        console.log(action, stream)
        if ("url" in action) {
            ws.close()
            window.location = action.url
        }
    })

    ws.socket.addEventListener('open', () => {
        console.log('joining')
        ws.send({action: 'join'})
    })
}

module.exports = wait
