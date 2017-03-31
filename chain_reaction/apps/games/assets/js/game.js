"use strict";

import $ from 'jquery'
import { WebSocketBridge } from 'django-channels'

import wait from './wait'
import chain from './chain'

import '../css/game.scss'

const OPEN = 'O'
const RUNNING = 'R'

$(() => {
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

    const ws = new WebSocketBridge()
    ws.connect(proto + '//' + location.hostname + ':' + port + '/ws' + wsUrl)
    // monkeypatch WSB
    if (!ws.socket) { ws.socket = ws._socket }

    if (game.data('type') == OPEN) {
        wait(ws)
    } else {
        chain(ws, game)
    }
})
