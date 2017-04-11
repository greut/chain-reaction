import $ from 'jquery'
import fabric from 'fabric'

var gameGridSize = 8, boxSize = 60,  player = 0, turns = 0;
var playerColors = [["red", "lightred"], ["green", "lightgreen"]];
var rectProperties = {left: 1, top: 1, fill: "#e5e5e5", width: boxSize-1, height: boxSize-1, hoverCursor: "pointer", selectable: true, lockMovementX: true,
lockMovementY: true, lockRotation: true, hasControls: false};
var circleProperties = {radius: boxSize/5, fill: "#e5e5e5", left: 4, top: 4, hoverCursor: "pointer", selectable: true, lockMovementX: true,
lockMovementY: true, lockRotation: true, hasControls: false, hasBorders:false};

//This 2d array contains all the squares and the circles within them
var gridSquares = [];
var circleSkipper = boxSize/2;

var canvas;
var num;
var tick = 0;

var moves = [{x:-1,y:0}, {x:0,y:-1}, {x:0,y:1}, {x:1,y:0}];

function showScore(score) {
    var title = $("h2"),
        bs = title.find('b')

    bs[0].innerText = score[0]
    bs[1].innerText = score[1]
}

function showStatus() {
    var status = $("#status")

    if (player != num) {
        status.addClass('alert-info')
            .removeClass('alert-success')
            .text("Attente de l'autre joueur...")
    } else {
        status.addClass('alert-success')
            .removeClass('alert-info')
            .text('À vous de jouer!')
    }
}

function score() {
    var scores = [0, 0]
    gridSquares.forEach(function(row) {
        row.forEach(function(cell) {
            if (typeof cell.player !== "undefined")
                scores[cell.player] += cell.selectedCircles
        })
    })
    return scores
}

function chain(ws, elem)
{
    canvas = new fabric.Canvas(elem[0]);
    num = elem.data('num')
    let started = false;

    ws.listen((action, stream) => {
        console.log('*', action, stream)
    })

    ws.demultiplex('control', (action, stream) => {
        console.log('control', action, stream)
        if (action.action === 'done') {
            if ("url" in action) {
                window.location = action.url
            }
        } else if (action.action === 'start') {
            tick = action.plays.length ? action.plays[action.plays.length - 1].turn : 0
            if (!started) {
                started = true
                start(action.plays.slice())
            }
        } else if (action.action === 'joined') {
            ws.stream('control').send({action: 'start'})
        } else if (action.action === 'info') {
            console.info(action.message)
        }
    })

    ws.demultiplex('play', (action, stream) => {
        console.log('play', action, stream)
        tick = action.tick
        if (action.player != num) {
            play(action.x, action.y)
        }
    })

    function play(x, y) {
        chainReact(gridSquares[x][y])
            .then(() => {
                var counts = score()
                showScore(counts)
                showStatus()

                // Update the score.
                if (player !== num) {
                    console.log('score', counts)
                    ws.stream('score').send({
                        tick: tick,
                        player: num,
                        score: counts
                    })
                }

                done(counts);
            })
    }

    function done(counts) {
        if (turns >= 2 && counts.indexOf(0) > -1) {
            if (player !== num) {
                alert("You win!")
            } else {
                alert("You lose!")
            }

            ws.stream('control').send({
                action: 'close',
                tick: tick
            })

            canvas.off("mouse.down", startReaction)
            return true
        }

        return false
    }

    var flipPlayers = function() {
        turns++;
        if(player === 0){
            player = 1;
        }
        else{
            player = 0;
        }
        canvas.backgroundColor = playerColors[player][0];
        canvas.renderAll(true);
    };

    var opponent = function() {
        return player === 0 ? 1 : 0;
    }

    var startReaction = function(options) {
        canvas.deactivateAll()
        if((num === 0 && player === 0) || (num === 1 && player === 1))
        {
            var targetRect;

            if(typeof options.target !== "undefined"){
                if(options.target.type === "rect"){
                    targetRect = options.target;
                }
                else if(options.target.type === "circle"){
                    targetRect = options.target.square;
                }

                play(targetRect.xposition, targetRect.yposition)
                ws.stream('play').send({
                    tick: ++tick,
                    player: num,
                    x: targetRect.xposition,
                    y: targetRect.yposition
                })
            }
        }
    };

    var fillColors = function(rect, color) {
        var max = rect.selectedCircles;
        if(rect.selectedCircles === 0 && color === "#e5e5e5"){
            max = rect.maxCircles;
        }
        for(var circCounter = 0; circCounter < max; circCounter++){
            rect.circles[circCounter].set('fill', color)
        }
        canvas.renderAll(true);
    }

    var chainReact = function(rect) {
        return new Promise((resolve, reject) => {
            if (rect.initialState) {
                rect.initialState = false;
                rect.player = player;
            }
            if (rect.player === player){
                rect.selectedCircles += 1
                if (rect.selectedCircles < rect.maxCircles) {
                    rect.player = player;
                    fillColors(rect, playerColors[player][0]);
                    flipPlayers();
                }
                if (rect.selectedCircles === rect.maxCircles) {
                    var explosions = [rect]

                    var f = function() {
                        var r = explosions.shift();
                        if (typeof r !== "undefined") {
                            explode(r, explosions)
                            window.setTimeout(f)
                        } else {
                            flipPlayers()
                            resolve()
                        }
                    }

                    window.setTimeout(f, 0)
                } else {
                    resolve();
                }
            }
        })
    }

    var explode = function(r, explosions) {
        r.selectedCircles = 0;
        fillColors(r, "#e5e5e5");
        r.initialState = true;

        for(var i=0; i < moves.length; i++){
            var x = r.xposition + moves[i].x;
            var y = r.yposition + moves[i].y;
            if(!(x<0) && !(y<0) && !(x > gameGridSize-1) && !(y > gameGridSize-1)){
                var rect = gridSquares[x][y];
                rect.selectedCircles += 1;
                if(rect.selectedCircles === rect.maxCircles){
                    explosions.push(rect);
                }
                else if(rect.selectedCircles < rect.maxCircles){
                    if(rect.initialState){
                        rect.initialState = false;
                    }
                    rect.player = player;
                    fillColors(rect, playerColors[player][0]);
                }
            }
        }
    };
    var buildGameCanvas = function() {
        //Properties for the Canvas
        canvas.backgroundColor = playerColors[0][0];
        canvas.setDimensions({width: gameGridSize*boxSize+1, height: gameGridSize*boxSize+1});
        //Adding the squares to the grid
        for(var walker = 0; walker < gameGridSize; walker++) {
            var gridRow = [];
            for(var runner = 0; runner < gameGridSize; runner++) {
                var rect = new fabric.Rect(rectProperties);
                rect.xposition = walker;
                rect.yposition = runner;
                rect.initialState = true;
                if((walker === 0 || walker === gameGridSize - 1)&&(runner === 0 || runner === gameGridSize -1)){
                    rect.maxCircles = 2;
                }
                else if((walker === 0) || (runner === 0) || (walker === gameGridSize -1) || (runner === gameGridSize-1)){
                    rect.maxCircles = 3;
                }
                else{
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
        for(var walker = 0; walker < gameGridSize * 2; walker++) {
            var currentSquare;
            for(var runner = 0; runner < gameGridSize * 2; runner++) {
                if(runner % 2 === 0){
                    var gridChooser = (walker%2 === 0) ? walker/2 : (walker-1)/2;
                    currentSquare = gridSquares[gridChooser][runner/2];
                    if(currentSquare.circles === undefined){
                        currentSquare.circles = [];
                        currentSquare.selectedCircles = 0;
                    }
                }
                var circle = new fabric.Circle(circleProperties);
                circle.square = currentSquare;
                circleProperties.left += circleSkipper;
                currentSquare.circles.push(circle);
                canvas.add(circle);
            }
            circleProperties.left = 3;
            circleProperties.top += circleSkipper;
        }
    };

    var reset = function(){
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
    }

    var start = function(plays) {
        reset()

        ;(function x() {
            if (plays.length) {
                chainReact(gridSquares[plays[0].x][plays[0].y])
                    .then(() => {
                        var counts = score()
                        showScore(counts)

                        if (!done(counts)) {
                            plays.shift()
                            window.setTimeout(x, 200)
                        }
                    })
            } else {
                showStatus()
                canvas.on('mouse:down', startReaction);
            }
        })()
    }
}

module.exports = chain
