function wait(ws) {
    ws.onopen = e => {
        ws.send(JSON.stringify({action: 'join'}))
    }

    ws.onmessage = e => {
        const data = JSON.parse(e.data)
        if ("url" in data) {
            window.location = data.url
        }
    }
}

module.exports = wait
