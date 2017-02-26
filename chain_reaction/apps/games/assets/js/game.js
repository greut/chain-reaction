"use strict";

import $ from 'jquery'

import wait from './wait'
import chain from './chain'

const OPEN = 'O'
const RUNNING = 'R'

$(() => {
    // WebSocket can also be running through HTTPS
    const proto = document.location.protocol === 'https:' ? 'wss:' : 'ws:'
    // Development setup uses 8000 for http and 8001 for ws
    // while production shares the same port thanks to nginx.
    const port = document.location.port === '8000' ? 8001 : document.location.port

    const game = $('#game')
    const wsUrl = game.data('ws')

    if (!wsUrl) {
        console.error('no game found.')
        return
    }

    const ws = new WebSocket(proto + '//' + location.hostname + ':' + port + '/ws' + wsUrl)

    if (game.data('type') == OPEN) {
        wait(ws)
    } else {
        chain(ws, game)
    }

    if (ws.readyState == WebSocket.OPEN) {
        ws.onopen()
    }
})
