(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{5:function(t,e,i){"use strict";function n(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}i.r(e);var a=function(){function t(e,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.data=[],e&&i&&(this.data=this.newBlankGrid(e,i))}var e,i,a;return e=t,a=[{key:"loopAndSet",value:function(t,e){for(var i=t[0].length,n=t.length,a=0;a<n;a++)for(var o=0;o<i;o++)t[a][o]=e(t[a][o],o,a)}},{key:"loop",value:function(t,e){for(var i=t[0].length,n=t.length,a=0;a<n;a++)for(var o=0;o<i;o++)e(t[a][o],o,a)}}],(i=[{key:"randomize",value:function(){this.loopAndSetData((function(){return Math.round(Math.random())}))}},{key:"clear",value:function(){this.loopAndSetData((function(){return 0}))}},{key:"toggleCell",value:function(t,e){this.data[e][t]=this.data[e][t]?0:1}},{key:"loopAndSetData",value:function(e){t.loopAndSet(this.data,e)}},{key:"loopData",value:function(e){t.loop(this.data,e)}},{key:"newBlankGrid",value:function(t,e){return new Array(e).fill(0).map((function(){return new Array(t).fill(0)}))}},{key:"insertPrefab",value:function(e,i,n){var a=this;t.loop(n,(function(t,n,o){t&&(a.data[i+o][e+n]=1)}))}},{key:"step",value:function(){var t=this.calculateNeighbours();this.loopAndSetData((function(e,i,n){return e&&(2===t[n][i]||3===t[n][i])||!e&&3===t[n][i]?1:0}))}},{key:"calculateNeighbours",value:function(){var e=this,i=this.newBlankGrid(this.width,this.height);return t.loopAndSet(i,(function(t,i,n){var a=0;try{a+=e.data[n-1][i-1]}catch(o){}try{a+=e.data[n-1][i]}catch(o){}try{a+=e.data[n-1][i+1]}catch(o){}try{a+=e.data[n][i-1]}catch(o){}try{a+=e.data[n][i+1]}catch(o){}try{a+=e.data[n+1][i-1]}catch(o){}try{a+=e.data[n+1][i]}catch(o){}try{a+=e.data[n+1][i+1]}catch(o){}return a})),i}},{key:"normalize",value:function(){this.loopAndSetData((function(t){return t?1:0}))}},{key:"copyAndResize",value:function(e,i){var n=this,a=this.width,o=this.height,r=this.newBlankGrid(e,i);t.loopAndSet(r,(function(t,e,i){return e<a&&i<o?n.data[i][e]:0}));var s=new t;return s.data=r,s}},{key:"width",get:function(){return this.data?this.data[0].length:0}},{key:"height",get:function(){return this.data?this.data.length:0}}])&&n(e.prototype,i),a&&n(e,a),t}();var o=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)};function r(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}o.glider=[[0,1,0],[0,0,1],[1,1,1]],o.gosper=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];var s,l=function(){function t(e){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.canvas=document.getElementById("board"),this.ctx=this.canvas.getContext("2d"),e&&(this.board=e),this.canvas.onmousemove=function(t){return i.onMouseMove(t.clientX,t.clientY)},this.canvas.onclick=function(){return i.onMouseClick()}}var e,i,n;return e=t,(i=[{key:"start",value:function(){var t=this;this.requestID=window.requestAnimationFrame((function(){return t.draw()}))}},{key:"stop",value:function(){this.requestID&&(window.cancelAnimationFrame(this.requestID),this.requestID=void 0)}},{key:"onMouseMove",value:function(t,e){this.scaleFactorX&&this.scaleFactorY&&(this.highlightedCellX=Math.floor(t/this.scaleFactorX),this.highlightedCellY=Math.floor(e/this.scaleFactorY))}},{key:"onMouseClick",value:function(){this.board&&this.highlightedCellX&&this.highlightedCellY&&(this.activePrefab?(this.board.insertPrefab(this.highlightedCellX,this.highlightedCellY,this.activePrefab),this.activePrefab=void 0):this.board.toggleCell(this.highlightedCellX,this.highlightedCellY))}},{key:"draw",value:function(){var t=this;this.board&&(this.scaleToBoardSize(),this.ctx.fillStyle=this.colors.active,this.board.loopData((function(e,i,n){e&&t.ctx.fillRect(i,n,1,1)})),void 0!==this.highlightedCellX&&void 0!==this.highlightedCellY&&(this.activePrefab?(this.ctx.fillStyle=this.colors.prefab,a.loop(this.activePrefab,(function(e,i,n){e&&t.ctx.fillRect(t.highlightedCellX+i,t.highlightedCellY+n,1,1)}))):(this.ctx.fillStyle=this.colors.highlighted,this.ctx.fillRect(this.highlightedCellX,this.highlightedCellY,1,1))),this.requestID=window.requestAnimationFrame((function(){return t.draw()})))}},{key:"scaleToBoardSize",value:function(){this.board&&(this.ctx.restore(),this.canvas.width=this.canvas.clientWidth,this.canvas.height=this.canvas.clientHeight,this.scaleFactorX=this.canvas.width/this.board.width,this.scaleFactorY=this.canvas.height/this.board.height,this.ctx.scale(this.scaleFactorX,this.scaleFactorY))}}])&&r(e.prototype,i),n&&r(e,n),t}();function h(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}!function(t){t[t.NORMAL=1e3]="NORMAL",t[t.FAST=400]="FAST",t[t.FASTER=100]="FASTER",t[t.LUDICROUS=0]="LUDICROUS"}(s||(s={}));var u,c=function(){function t(e,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.speed=s.NORMAL,this.board=e,this.speed=i}var e,i,n;return e=t,(i=[{key:"start",value:function(){var t=this;this.intervalID||(this.intervalID=setInterval((function(){return t.loop()}),this.speed))}},{key:"stop",value:function(){this.intervalID&&(clearInterval(this.intervalID),this.intervalID=void 0)}},{key:"isRunning",value:function(){return void 0!==this.intervalID}},{key:"loop",value:function(){this.board.step()}}])&&h(e.prototype,i),n&&h(e,n),t}();!function(t){t.DARK="1",t.LIGHT="2"}(u||(u={}));var d=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.settings=document.getElementById("settings-btn"),this.prefabs=document.getElementById("prefabs-btn"),this.controlsPanel=document.getElementById("controls-panel"),this.themeDark=document.getElementById("dark-theme-radio"),this.themeLight=document.getElementById("light-theme-radio"),this.startRenderer=document.getElementById("start-renderer-btn"),this.stopRenderer=document.getElementById("stop-renderer-btn"),this.clearBoard=document.getElementById("clear-board-btn"),this.randomizeBoard=document.getElementById("randomize-board-btn"),this.boardWidth=document.getElementById("board-width"),this.boardHeight=document.getElementById("board-height"),this.startSimulation=document.getElementById("start-simulation-btn"),this.stopSimulation=document.getElementById("stop-simulation-btn"),this.stepSimulation=document.getElementById("step-simulation-btn"),this.speed1Simulation=document.getElementById("simulation-speed-1-btn"),this.speed2Simulation=document.getElementById("simulation-speed-2-btn"),this.speed3Simulation=document.getElementById("simulation-speed-3-btn"),this.speed4Simulation=document.getElementById("simulation-speed-4-btn"),this.prefabsPanel=document.getElementById("prefabs-panel"),this.cancelPrefab=document.getElementById("cancel-prefab-btn"),this.prefabGlider=document.getElementById("prefab-glider-btn"),this.prefabGosper=document.getElementById("prefab-gosper-btn")};function f(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}var g=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.ui=new d,this.boardWidth=50,this.boardHeight=50,this.speed=s.FAST,this.board=new a(this.boardWidth,this.boardHeight),this.board.randomize(),this.renderer=new l(this.board),this.renderer.start(),this.theme=u.DARK,this.simulationLoop=new c(this.board,this.speed),this.simulationLoop.start(),this.setUiEvents()}var e,i,n;return e=t,(i=[{key:"setUiEvents",value:function(){var t=this;this.ui.settings.onclick=function(){return t.togglePanelDisplay(t.ui.controlsPanel)},this.ui.prefabs.onclick=function(){return t.togglePanelDisplay(t.ui.prefabsPanel)},this.ui.themeDark.onchange=function(e){return t.theme=e.target.value},this.ui.themeLight.onchange=function(e){return t.theme=e.target.value},this.ui.startRenderer.onclick=function(){return t.renderer.start()},this.ui.stopRenderer.onclick=function(){return t.renderer.stop()},this.ui.clearBoard.onclick=function(){return t.board.clear()},this.ui.randomizeBoard.onclick=function(){return t.board.randomize()},this.ui.boardWidth.onchange=function(){return t.onBoardSizeChange()},this.ui.boardHeight.onchange=function(){return t.onBoardSizeChange()},this.ui.startSimulation.onclick=function(){return t.simulationLoop.start()},this.ui.stopSimulation.onclick=function(){return t.simulationLoop.stop()},this.ui.stepSimulation.onclick=function(){return t.singleStep()},this.ui.speed1Simulation.onclick=function(){return t.speed=s.NORMAL},this.ui.speed2Simulation.onclick=function(){return t.speed=s.FAST},this.ui.speed3Simulation.onclick=function(){return t.speed=s.FASTER},this.ui.speed4Simulation.onclick=function(){return t.speed=s.LUDICROUS},this.ui.cancelPrefab.onclick=function(){return t.renderer.activePrefab=void 0},this.ui.prefabGlider.onclick=function(){return t.renderer.activePrefab=o.glider},this.ui.prefabGosper.onclick=function(){return t.renderer.activePrefab=o.gosper}}},{key:"boardWidth",get:function(){return Number(this.ui.boardWidth.value)},set:function(t){this.ui.boardWidth.value=String(t)}},{key:"boardHeight",get:function(){return Number(this.ui.boardHeight.value)},set:function(t){this.ui.boardHeight.value=String(t)}},{key:"theme",set:function(t){switch(t){case u.DARK:document.body.className="dark-theme";break;case u.LIGHT:document.body.className="light-theme"}var e=getComputedStyle(document.body);this.renderer.colors={active:e.getPropertyValue("--activeCell"),highlighted:e.getPropertyValue("--highlightedCell"),prefab:e.getPropertyValue("--prefabCell")}}},{key:"togglePanelDisplay",value:function(t){t.classList.toggle("hidden")}},{key:"singleStep",value:function(){this.simulationLoop.stop(),this.board.step()}},{key:"speed",get:function(){return this._speed},set:function(t){this._speed=t,this.simulationLoop&&(this.simulationLoop.stop(),this.simulationLoop.speed=t,this.simulationLoop.start())}},{key:"onBoardSizeChange",value:function(){this.replaceBoard(this.board.copyAndResize(this.boardWidth,this.boardHeight))}},{key:"replaceBoard",value:function(t){this.board=t,this.renderer.board=t;var e=this.simulationLoop.isRunning();this.simulationLoop.stop(),this.simulationLoop=new c(t,this.speed),e&&this.simulationLoop.start()}}])&&f(e.prototype,i),n&&f(e,n),t}();window.onload=function(){new g}}}]);