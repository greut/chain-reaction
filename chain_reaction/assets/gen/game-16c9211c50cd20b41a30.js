/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _fabric = __webpack_require__(5);

var _fabric2 = _interopRequireDefault(_fabric);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gameGridSize = 8,
    boxSize = 60,
    player = 0,
    turns = 0;
var playerColors = ["red", "green"];
var rectProperties = { left: 1, top: 1, fill: "#e5e5e5", width: boxSize - 1, height: boxSize - 1, hoverCursor: "pointer", selectable: true, lockMovementX: true,
    lockMovementY: true, lockRotation: true, hasControls: false };
var circleProperties = { radius: boxSize / 5, fill: "#e5e5e5", left: 4, top: 4, hoverCursor: "pointer", selectable: true, lockMovementX: true,
    lockMovementY: true, lockRotation: true, hasControls: false, hasBorders: false };

//This 2d array contains all the squares and the circles within them
var gridSquares = [];
var circleSkipper = boxSize / 2;

var canvas;
var num;
var tick = 0;

var moves = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }];

function showScore(score) {
    var title = (0, _jquery2.default)("h1"),
        bs = title.find('b');

    bs[0].innerText = score[0];
    bs[1].innerText = score[1];
}

function showStatus() {
    var status = (0, _jquery2.default)("h2");

    if (player != num) {
        status.text("Attente de l'autre joueur...");
    } else {
        status.text('À vous de jouer!');
    }
}

function score() {
    var scores = [0, 0];
    gridSquares.forEach(function (row) {
        row.forEach(function (cell) {
            if (typeof cell.player !== "undefined") scores[cell.player] += cell.selectedCircles;
        });
    });
    return scores;
}

function chain(ws, elem) {
    canvas = new _fabric2.default.Canvas(elem[0]);
    num = elem.data('num');
    var started = false;

    ws.onmessage = function (e) {
        var data = JSON.parse(e.data);
        console.log(data);

        if (data.action === 'done') {
            console.log('game is done');

            if ("url" in data) {
                window.location = data.url;
            }
        } else if (data.action === 'start') {
            console.log('game is starting');
            tick = data.plays.length ? data.plays[data.plays.length - 1].turn : 0;
            if (!started) {
                started = true;
                start(data.plays.slice());
            }
        } else if (data.action === 'play') {
            tick = data.tick;
            chainReact(gridSquares[data.x][data.y], function () {
                var counts = score();
                showScore(counts);
                showStatus();

                // Update the score.
                if (player !== num) {
                    ws.send(JSON.stringify({
                        tick: tick,
                        player: num,
                        action: 'score',
                        score: counts
                    }));
                }

                if (turns >= 2) {
                    if (counts.indexOf(0) > -1) {
                        if (player !== num) {
                            alert("You win!");

                            var message = {
                                action: 'close',
                                tick: tick,
                                player: num
                            };
                            ws.send(JSON.stringify(message));
                        } else {
                            alert("You lose!");
                        }
                        canvas.off("mouse.down", startReaction);
                        ws.close();
                    }
                }
            });
        }
    };

    ws.onopen = function () {
        ws.send(JSON.stringify({ action: 'start' }));
    };

    var flipPlayers = function flipPlayers() {
        turns++;
        if (player === 0) {
            player = 1;
        } else {
            player = 0;
        }
        canvas.backgroundColor = playerColors[player];
        canvas.renderAll(true);
    };

    var opponent = function opponent() {
        return player === 0 ? 1 : 0;
    };

    var startReaction = function startReaction(options) {
        canvas.deactivateAll();
        if (num === 0 && player === 0 || num === 1 && player === 1) {
            var targetRect;

            if (typeof options.target !== "undefined") {
                if (options.target.type === "rect") {
                    targetRect = options.target;
                } else if (options.target.type === "circle") {
                    targetRect = options.target.square;
                }

                var message = {
                    tick: ++tick,
                    player: num,
                    action: 'play',
                    x: targetRect.xposition,
                    y: targetRect.yposition
                };

                ws.send(JSON.stringify(message));
            }
        }
    };

    var fillColors = function fillColors(rect, color) {
        var max = rect.selectedCircles;
        if (rect.selectedCircles === 0 && color === "#e5e5e5") {
            max = rect.maxCircles;
        }
        for (var circCounter = 0; circCounter < max; circCounter++) {
            rect.circles[circCounter].set('fill', color);
            canvas.renderAll(true);
        }
    };

    var chainReact = function chainReact(rect, cb) {
        if (rect.initialState) {
            rect.initialState = false;
            rect.player = player;
        }
        if (rect.player === player) {
            rect.selectedCircles += 1;
            if (rect.selectedCircles < rect.maxCircles) {
                rect.player = player;
                fillColors(rect, playerColors[player]);
                flipPlayers();
            }
            if (rect.selectedCircles === rect.maxCircles) {
                var explosions = [rect];

                var f = function f() {
                    var r = explosions.shift();
                    if (typeof r !== "undefined") {
                        explode(r, explosions);
                        window.setTimeout(f);
                    } else {
                        flipPlayers();
                        if (cb) cb();
                    }
                };

                window.setTimeout(f, 0);
            } else {
                if (cb) cb();
            }
        }
    };

    var explode = function explode(r, explosions) {
        r.selectedCircles = 0;
        fillColors(r, "#e5e5e5");
        r.initialState = true;

        for (var i = 0; i < moves.length; i++) {
            var x = r.xposition + moves[i].x;
            var y = r.yposition + moves[i].y;
            if (!(x < 0) && !(y < 0) && !(x > gameGridSize - 1) && !(y > gameGridSize - 1)) {
                var rect = gridSquares[x][y];
                rect.selectedCircles += 1;
                if (rect.selectedCircles === rect.maxCircles) {
                    explosions.push(rect);
                } else if (rect.selectedCircles < rect.maxCircles) {
                    if (rect.initialState) {
                        rect.initialState = false;
                    }
                    rect.player = player;
                    fillColors(rect, playerColors[player]);
                }
            }
        }
    };
    var buildGameCanvas = function buildGameCanvas() {
        //Properties for the Canvas
        canvas.backgroundColor = playerColors[0];
        canvas.setDimensions({ width: gameGridSize * boxSize + 1, height: gameGridSize * boxSize + 1 });
        //Adding the squares to the grid
        for (var walker = 0; walker < gameGridSize; walker++) {
            var gridRow = [];
            for (var runner = 0; runner < gameGridSize; runner++) {
                var rect = new _fabric2.default.Rect(rectProperties);
                rect.xposition = walker;
                rect.yposition = runner;
                rect.initialState = true;
                if ((walker === 0 || walker === gameGridSize - 1) && (runner === 0 || runner === gameGridSize - 1)) {
                    rect.maxCircles = 2;
                } else if (walker === 0 || runner === 0 || walker === gameGridSize - 1 || runner === gameGridSize - 1) {
                    rect.maxCircles = 3;
                } else {
                    rect.maxCircles = 4;
                }
                rectProperties.left += boxSize;
                gridRow.push(rect);
                canvas.add(rect);
            }
            gridSquares.push(gridRow);
            rectProperties.left = 1;
            rectProperties.top += boxSize;
        }

        //Adding the circles to the gridSquares
        for (var walker = 0; walker < gameGridSize * 2; walker++) {
            var currentSquare;
            for (var runner = 0; runner < gameGridSize * 2; runner++) {
                if (runner % 2 === 0) {
                    var gridChooser = walker % 2 === 0 ? walker / 2 : (walker - 1) / 2;
                    currentSquare = gridSquares[gridChooser][runner / 2];
                    if (currentSquare.circles === undefined) {
                        currentSquare.circles = [];
                        currentSquare.selectedCircles = 0;
                    }
                }
                var circle = new _fabric2.default.Circle(circleProperties);
                circle.square = currentSquare;
                circleProperties.left += circleSkipper;
                currentSquare.circles.push(circle);
                canvas.add(circle);
            }
            circleProperties.left = 3;
            circleProperties.top += circleSkipper;
        }
    };

    var reset = function reset() {
        player = 0;
        turns = 0;
        gridSquares = [];
        canvas.clear();
        rectProperties.left = 1;
        rectProperties.top = 1;
        circleProperties.left = 4;
        circleProperties.top = 4;
        buildGameCanvas();
        canvas.renderAll(true);
    };

    var start = function start(plays) {
        reset();

        function x() {
            if (plays.length) {
                chainReact(gridSquares[plays[0].x][plays[0].y], function () {
                    showScore(score());

                    plays.shift();
                    window.setTimeout(x, 200);
                });
            } else {
                showStatus();
                canvas.on('mouse:down', startReaction);
            }
        }
        window.setTimeout(x, 200);
    };
}

module.exports = chain;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function wait(ws) {
    ws.onopen = function (e) {
        ws.send(JSON.stringify({ action: 'join' }));
    };

    ws.onmessage = function (e) {
        var data = JSON.parse(e.data);
        if ("url" in data) {
            window.location = data.url;
        }
    };
}

module.exports = wait;

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

module.exports = fabric;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _wait = __webpack_require__(2);

var _wait2 = _interopRequireDefault(_wait);

var _chain = __webpack_require__(1);

var _chain2 = _interopRequireDefault(_chain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPEN = 'O';
var RUNNING = 'R';

(0, _jquery2.default)(function () {
    // WebSocket can also be running through HTTPS
    var proto = document.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Development setup uses 8000 for http and 8001 for ws
    // while production shares the same port thanks to nginx.
    var port = document.location.port === '8000' ? 8001 : document.location.port;

    var game = (0, _jquery2.default)('#game');
    var wsUrl = game.data('ws');

    if (!wsUrl) {
        console.error('no game found.');
        return;
    }

    var ws = new WebSocket(proto + '//' + location.hostname + ':' + port + '/ws' + wsUrl);

    if (game.data('type') == OPEN) {
        (0, _wait2.default)(ws);
    } else {
        (0, _chain2.default)(ws, game);
    }

    if (ws.readyState == WebSocket.OPEN) {
        ws.onopen();
    }
});

/***/ })
/******/ ]);