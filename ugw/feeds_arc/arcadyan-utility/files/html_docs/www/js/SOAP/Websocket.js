/*
 * Websocket core v1.0.0
 *
 * Copyright 2015 jumi
 * Released under the GPL license
 */
var currentWS=null;
define("Websocket",function(){function c(){this.socket=null;this.delegateList={};this.errorHandler=null;currentWS=this;this.keepAliveTimer=null;this.alive=!0}var d=500;c.prototype.connect=function(){var a=$.Deferred(),b=this,c=!1;if(null!=this.socket)return a.resolve(this);var f="ws://"+location.host;""!=location.port&&(f+=":"+location.port);this.socket=new WebSocket(f+"/WebSocketService","WebSocketService");b.socket.onopen=function(){var a=sessionStorage.getItem("Cookie"),c=sessionStorage.getItem("PrivateKey"),e=
(new Date).getTime(),e=Math.floor(e/1E3)%2E9,e=e.toString(),c=hex_hmac_md5(c,e+"http://dlinkrouter.local./WebSocketService"),c=c.toUpperCase()+" "+e;b.socket.send(JSON.stringify({Command:"AUTH",HNAP_AUTH:c,Cookie:a}));d=500;null!=b.keepAliveTimer&&clearInterval(b.keepAliveTimer);b.keepAliveTimer=setInterval(function(){b.sendKeepAlive()},6E4)};b.socket.onmessage=function(d){try{var f=JSON.parse(d.data);if("AUTH"==f.Command.toUpperCase()&&"OK"==f.Result.toUpperCase())c=!0,a.resolve(b);else switch(f.Command.toUpperCase()){case "PONG":b.alive=
!0;break;default:c&&b.parseMsg(d.data)}}catch(e){}};b.socket.onclose=function(){b.defaultErrorHandler().done(function(){null!=b.errorHandler&&b.errorHandler(b)});a.reject()};b.socket.onerror=function(){b.defaultErrorHandler().done(function(){null!=b.errorHandler&&b.errorHandler(b)});a.reject()};return a.promise()};c.prototype.register=function(a,b,c){this.delegateList[a.Command]=[b,c];this.socket.send(JSON.stringify(a))};c.prototype.parseMsg=function(a){a=JSON.parse(a);try{var b=this.delegateList[a.Command][0],
c=this.delegateList[a.Command][1];"undefined"!=typeof b&&b(a,c)}catch(d){}};c.prototype.defaultErrorHandler=function(){var a=$.Deferred(),b=this;clearInterval(this.keepAliveTimer);this.keepAliveTimer=!1;this.socket.close();this.socket=null;d*=2;setTimeout(function(){b.connect().done(function(){a.resolve(this)})},d);this.delegateList={};return a.promise()};c.prototype.sendKeepAlive=function(){var a=this;this.alive=!1;a.socket.send(JSON.stringify({Command:"PING"}));setTimeout(function(){0==a.alive&&
a.defaultErrorHandler().done(function(){null!=a.errorHandler&&a.errorHandler(a)})},5E3)};return c});function initWebsocket(c){var d=$.Deferred();(null==currentWS?new c:currentWS).connect().done(function(a){d.resolve(a)});return d.promise()};