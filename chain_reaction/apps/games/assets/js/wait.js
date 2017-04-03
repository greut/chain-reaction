function wait(ws) {
    ws.listen((action, stream) => {
        console.log('*', action, stream)
    })

    ws.demultiplex('control', (action, stream) => {
        console.log('control', action, stream)
        if ("url" in action) {
            window.location = action.url
        }
        if ("action" in action) {
            if (action['action'] == 'joined') {
                ws.stream('control').send({action: 'join'})
            }
        }
    })
}

module.exports = wait
