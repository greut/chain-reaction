!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=11)}([function(e,t){e.exports=jQuery},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e){var t=(0,f.default)("h2"),n=t.find("b");n[0].innerText=e[0],n[1].innerText=e[1]}function i(){var e=(0,f.default)("#status");m!=l?e.addClass("alert-info").removeClass("alert-success").text("Attente de l'autre joueur..."):e.addClass("alert-success").removeClass("alert-info").text("À vous de jouer!")}function c(){var e=[0,0];return k.forEach(function(t){t.forEach(function(t){"undefined"!=typeof t.player&&(e[t.player]+=t.selectedCircles)})}),e}function s(e,t){a=new v.default.Canvas(t[0]),l=t.data("num");var n=!1;e.listen(function(t,o){var u=t;console.log(t,o),"done"===u.action?(console.log("game is done"),"url"in u&&(window.location=u.url)):"start"===u.action?(console.log("game is starting"),C=u.plays.length?u.plays[u.plays.length-1].turn:0,n||(n=!0,_(u.plays.slice()))):"play"===u.action&&(C=u.tick,f(k[u.x][u.y],function(){var t=c();if(r(t),i(),m!==l&&e.send({tick:C,player:l,action:"score",score:t}),h>=2&&t.indexOf(0)>-1){if(m!==l){alert("You win!");var n={action:"close",tick:C,player:l};e.send(n)}else alert("You lose!");a.off("mouse.down",s),e.close()}}))}),e.socket.addEventListener("open",function(){console.log("starting"),e.send({action:"start"})});var o=function(){h++,m=0===m?1:0,a.backgroundColor=w[m],a.renderAll(!0)},s=function(t){if(a.deactivateAll(),0===l&&0===m||1===l&&1===m){var n;if("undefined"!=typeof t.target){"rect"===t.target.type?n=t.target:"circle"===t.target.type&&(n=t.target.square);var o={tick:++C,player:l,action:"play",x:n.xposition,y:n.yposition};e.send(o)}}},u=function(e,t){var n=e.selectedCircles;0===e.selectedCircles&&"#e5e5e5"===t&&(n=e.maxCircles);for(var o=0;o<n;o++)e.circles[o].set("fill",t),a.renderAll(!0)},f=function(e,t){if(e.initialState&&(e.initialState=!1,e.player=m),e.player===m)if(e.selectedCircles+=1,e.selectedCircles<e.maxCircles&&(e.player=m,u(e,w[m]),o()),e.selectedCircles===e.maxCircles){var n=[e],r=function e(){var r=n.shift();"undefined"!=typeof r?(d(r,n),window.setTimeout(e)):(o(),t&&t())};window.setTimeout(r,0)}else t&&t()},d=function(e,t){e.selectedCircles=0,u(e,"#e5e5e5"),e.initialState=!0;for(var n=0;n<E.length;n++){var o=e.xposition+E[n].x,r=e.yposition+E[n].y;if(!(o<0||r<0||o>p-1||r>p-1)){var i=k[o][r];i.selectedCircles+=1,i.selectedCircles===i.maxCircles?t.push(i):i.selectedCircles<i.maxCircles&&(i.initialState&&(i.initialState=!1),i.player=m,u(i,w[m]))}}},O=function(){a.backgroundColor=w[0],a.setDimensions({width:p*y+1,height:p*y+1});for(var e=0;e<p;e++){for(var t=[],n=0;n<p;n++){var o=new v.default.Rect(g);o.xposition=e,o.yposition=n,o.initialState=!0,0!==e&&e!==p-1||0!==n&&n!==p-1?0===e||0===n||e===p-1||n===p-1?o.maxCircles=3:o.maxCircles=4:o.maxCircles=2,g.left+=y,t.push(o),a.add(o)}k.push(t),g.left=1,g.top+=y}for(var e=0;e<2*p;e++){for(var r,n=0;n<2*p;n++){if(n%2===0){var i=e%2===0?e/2:(e-1)/2;r=k[i][n/2],void 0===r.circles&&(r.circles=[],r.selectedCircles=0)}var c=new v.default.Circle(x);c.square=r,x.left+=b,r.circles.push(c),a.add(c)}x.left=3,x.top+=b}},S=function(){m=0,h=0,k=[],a.clear(),g.left=1,g.top=1,x.left=4,x.top=4,O(),a.renderAll(!0)},_=function(e){function t(){e.length?f(k[e[0].x][e[0].y],function(){r(c()),e.shift(),window.setTimeout(t,200)}):(i(),a.on("mouse:down",s))}S(),window.setTimeout(t,200)}}var a,l,u=n(0),f=o(u),d=n(10),v=o(d),p=8,y=60,m=0,h=0,w=["red","green"],g={left:1,top:1,fill:"#e5e5e5",width:y-1,height:y-1,hoverCursor:"pointer",selectable:!0,lockMovementX:!0,lockMovementY:!0,lockRotation:!0,hasControls:!1},x={radius:y/5,fill:"#e5e5e5",left:4,top:4,hoverCursor:"pointer",selectable:!0,lockMovementX:!0,lockMovementY:!0,lockRotation:!0,hasControls:!1,hasBorders:!1},k=[],b=y/2,C=0,E=[{x:-1,y:0},{x:0,y:-1},{x:0,y:1},{x:1,y:0}];e.exports=s},function(e,t,n){"use strict";function o(e){e.listen(function(e,t){console.log(e,t),"url"in e&&(window.location=e.url)}),e.socket.addEventListener("open",function(){console.log("joining"),e.send({action:"join"})})}e.exports=o},,function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.WebSocketBridge=void 0;var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},c=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=n(9),a=o(s),l=function(){},u=function(){function e(t){r(this,e),this._socket=null,this.streams={},this.default_cb=null,this.options=i({},{onopen:l},t)}return c(e,[{key:"connect",value:function(e,t,n){var o=void 0;if(void 0===e){var r="https:"===window.location.protocol?"wss":"ws";o=r+"://"+window.location.host+"/ws"}else o=e;this._socket=new a.default(o,t,n)}},{key:"listen",value:function(e){var t=this;this.default_cb=e,this._socket.onmessage=function(e){var n=JSON.parse(e.data),o=void 0,r=void 0;if(void 0!==n.stream){o=n.payload,r=n.stream;var i=t.streams[r];i?i(o,r):null}else o=n,r=null,t.default_cb?t.default_cb(o,r):null},this._socket.onopen=this.options.onopen}},{key:"demultiplex",value:function(e,t){this.streams[e]=t}},{key:"send",value:function(e){this._socket.send(JSON.stringify(e))}},{key:"stream",value:function(e){var t=this;return{send:function(n){var o={stream:e,payload:n};t._socket.send(JSON.stringify(o))}}}}]),e}();t.WebSocketBridge=u},function(e,t){},,,,function(e,t,n){"use strict";var o=function(e){return e&&2===e.CLOSING},r=function(){return"undefined"!=typeof WebSocket&&o(WebSocket)},i=function(){return{constructor:r()?WebSocket:null,maxReconnectionDelay:1e4,minReconnectionDelay:1500,reconnectionDelayGrowFactor:1.3,connectionTimeout:4e3,maxRetries:1/0,debug:!1}},c=function(e,t,n){Object.defineProperty(t,n,{get:function(){return e[n]},set:function(t){e[n]=t},enumerable:!0,configurable:!0})},s=function(e){return e.minReconnectionDelay+Math.random()*e.minReconnectionDelay},a=function(e,t){var n=t*e.reconnectionDelayGrowFactor;return n>e.maxReconnectionDelay?e.maxReconnectionDelay:n},l=["onopen","onclose","onmessage","onerror"],u=function(e,t,n){Object.keys(n).forEach(function(t){n[t].forEach(function(n){var o=n[0],r=n[1];e.addEventListener(t,o,r)})}),t&&l.forEach(function(n){e[n]=t[n]})},f=function e(t,n,r){var l=this;void 0===r&&(r={});var f,d,v=0,p=0,y=!0,m=null,h={};if(!(this instanceof e))throw new TypeError("Failed to construct 'ReconnectingWebSocket': Please use the 'new' operator");var w=i();if(Object.keys(w).filter(function(e){return r.hasOwnProperty(e)}).forEach(function(e){return w[e]=r[e]}),!o(w.constructor))throw new TypeError("Invalid WebSocket constructor. Set `options.constructor`");var g=w.debug?function(){for(var e=[],t=0;t<arguments.length;t++)e[t-0]=arguments[t];return console.log.apply(console,["RWS:"].concat(e))}:function(){},x=function(e,t){return setTimeout(function(){var n=new Error(t);n.code=e,Array.isArray(h.error)&&h.error.forEach(function(e){var t=e[0];return t(n)}),f.onerror&&f.onerror(n)},0)},k=function(){return g("close"),p++,g("retries count:",p),p>w.maxRetries?void x("EHOSTDOWN","Too many failed connection attempts"):(v=v?a(w,v):s(w),g("reconnectDelay:",v),void(y&&setTimeout(b,v)))},b=function(){g("connect");var e=f;f=new w.constructor(t,n),d=setTimeout(function(){g("timeout"),f.close(),x("ETIMEDOUT","Connection timeout")},w.connectionTimeout),g("bypass properties");for(var o in f)["addEventListener","removeEventListener","close","send"].indexOf(o)<0&&c(f,l,o);f.addEventListener("open",function(){clearTimeout(d),g("open"),v=s(w),g("reconnectDelay:",v),p=0}),f.addEventListener("close",k),u(f,e,h),f.onclose=f.onclose||m,m=null};g("init"),b(),this.close=function(e,t,n){void 0===e&&(e=1e3),void 0===t&&(t="");var o=void 0===n?{}:n,r=o.keepClosed,i=void 0!==r&&r,c=o.fastClose,s=void 0===c||c,a=o.delay,l=void 0===a?0:a;if(l&&(v=l),y=!i,f.close(e,t),s){var u={code:e,reason:t,wasClean:!0};k(),f.removeEventListener("close",k),Array.isArray(h.close)&&h.close.forEach(function(e){var t=e[0],n=e[1];t(u),f.removeEventListener("close",t,n)}),f.onclose&&(m=f.onclose,f.onclose(u),f.onclose=null)}},this.send=function(e){f.send(e)},this.addEventListener=function(e,t,n){Array.isArray(h[e])?h[e].some(function(e){var n=e[0];return n===t})||h[e].push([t,n]):h[e]=[[t,n]],f.addEventListener(e,t,n)},this.removeEventListener=function(e,t,n){Array.isArray(h[e])&&(h[e]=h[e].filter(function(e){var n=e[0];return n!==t})),f.removeEventListener(e,t,n)}};e.exports=f},function(e,t){e.exports=fabric},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r=n(0),i=o(r),c=n(4),s=n(2),a=o(s),l=n(1),u=o(l);n(5);var f="O";(0,i.default)(function(){var e="https:"===document.location.protocol?"wss:":"ws:",t="8000"===document.location.port?8001:document.location.port,n=(0,i.default)("#game"),o=n.data("ws");if(!o)return void console.error("no game found.");var r=new c.WebSocketBridge;r.connect(e+"//"+location.hostname+":"+t+"/ws"+o),"undefined"==typeof r.socket&&(r.socket=r._socket),console.log(n.data("type")),n.data("type")==f?(0,a.default)(r):(0,u.default)(r,n)})}]);