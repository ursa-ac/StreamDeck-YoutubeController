
var websocket = null;
var pluginUUID = null;

var DestinationEnum = Object.freeze({"HARDWARE_AND_SOFTWARE": 0, "HARDWARE_ONLY": 1, "SOFTWARE_ONLY": 2});

const updateCWS = async function () {
    var chromeWebSockets = await getChromeWebSockets();
    for (let cws of chromeWebSockets) {
        if (cws["url"].startsWith("https://www.youtube.com/watch?v=")) {
            connectChromeDevToolsWebSocket(cws["webSocketDebuggerUrl"]);
        } else {
            disconnectChromeWS(cws["webSocketDebuggerUrl"]);
        }
    }
    for (let cws of chromeWS) {
        sendMessage(cws,JSON.stringify(sendCommand.hasActive()));
    }
    setTimeout(()=>{
        // console.log(activeWS);
    },100);
};

setInterval(updateCWS, 500);

var counterAction = {
    prev: "com.alsacreate.youtubecontroller.prev",
    back: "com.alsacreate.youtubecontroller.back",
    play: "com.alsacreate.youtubecontroller.play",
    skip: "com.alsacreate.youtubecontroller.skip",
    next: "com.alsacreate.youtubecontroller.next",
    volumemin2: "com.alsacreate.youtubecontroller.volumemin2",
    volumemin: "com.alsacreate.youtubecontroller.volumemin",
    mute: "com.alsacreate.youtubecontroller.mute",
    volumeplus: "com.alsacreate.youtubecontroller.volumeplus",
    volumeplus2: "com.alsacreate.youtubecontroller.volumeplus2",
    onKeyDown: function (action,context, settings, coordinates, userDesiredState) {
        // console.log(context);
        if (action == this.prev) {
            youtube.pressPrev();
        }
        else if (action == this.back) {
            youtube.timeBack();
        }
        else if (action == this.play) {
            // var json = {
            //   "event": "setImage",
            //   "context": context,
            //   "payload": {
            //     // "image": "data:image/svg+xml;charset=utf8,"+data[key],
            //     "image": "data:image/svg+xml;charset=utf8,<svg fill=\"white\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 36 36\" width=\"100%\"><use class=\"ytp-svg-shadow\" xlink:href=\"#ytp-id-145\"></use><path class=\"ytp-svg-fill\" d=\"M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z\" id=\"ytp-id-145\"></path></svg>",
            //     // "image": "data:image/svg+xml;charset=utf8,<svg height=\"100\" width=\"100\"><circle cx=\"50\" cy=\"50\" r=\"40\" stroke=\"black\" stroke-width=\"3\" fill=\"red\" /></svg>",
            //     "target": DestinationEnum.HARDWARE_AND_SOFTWARE
            //   }
            // }
            // websocket.send(JSON.stringify(json));
            youtube.playToggle();
            youtube.getPlayIcon();
        }
        else if (action == this.skip) {
            youtube.timeSkip();
        }
        else if (action == this.next) {
            youtube.pressNext();
        }

        else if (action == this.volumemin2) {
            youtube.volumeMin10();
        }
        else if (action == this.volumemin) {
            youtube.volumeMin1();
        }
        else if (action == this.mute) {
            youtube.muteToggle();
        }
        else if (action == this.volumeplus) {
            youtube.volumePlus1();
        }
        else if (action == this.volumeplus2) {
            youtube.volumePlus10();
        }
    },

    onKeyUp: function (action,context, settings, coordinates, userDesiredState) {

    },

    onWillAppear: function (action,context, settings, coordinates) {
        if(action == this.play){
            playContext = context;
        }
        if(action == this.mute){
            muteContext = context;
        }
    },
};

var playContext = null;
var muteContext = null;

var sendCommand = {
    hasActive: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "\"{\\\"hasActive\\\": \"+document.hidden+\"}\""
            }
        }
    },
    pressPrev: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "document.querySelectorAll(\".ytp-prev-button\").forEach(element=>element.click());"
            }
        }
    },
    pressNext: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "document.querySelectorAll(\".ytp-next-button\").forEach(element=>element.click());"
            }
        }
    },
    timeBack: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "document.dispatchEvent(new KeyboardEvent(\"keydown\",{keyCode:74}));"
            }
        }
    },
    timeSkip: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "document.dispatchEvent(new KeyboardEvent(\"keydown\",{keyCode:76}));"
            }
        }
    },
    volumeMin10: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "\"{\\\"getVolume\\\": \"+"+getVolumeControl(false,10)+"+\"}\""
            }
        }
    },
    volumeMin1: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "\"{\\\"getVolume\\\": \"+"+getVolumeControl(false,1)+"+\"}\""
            }
        }
    },
    volumePlus10: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "\"{\\\"getVolume\\\": \"+"+getVolumeControl(true,10)+"+\"}\""
            }
        }
    },
    volumePlus1: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "\"{\\\"getVolume\\\": \"+"+getVolumeControl(true,1)+"+\"}\""
            }
        }
    },
    muteToggle: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "document.querySelectorAll(\".ytp-mute-button\").forEach(element=>element.click());"
            }
        }
    },
    playToggle: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "document.querySelectorAll(\".ytp-play-button\").forEach(element=>element.click());"
            }
        }
    },
    getPlayIcon: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "\"{\\\"getPlayIcon\\\": \"+document.querySelector(\".ytp-play-button\").children[0].outerHTML+\"}\""
            }
        }
    },
    getVolumeIcon: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "\"{\\\"getVolumeIcon\\\": \"+document.querySelector(\".ytp-mute-button\").children[0].outerHTML+\"}\""
            }
        }
    },
    getVolume: function () {
        return {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": "\"{\\\"getVolume\\\": \"+document.querySelector(\"#movie_player\").getVolume()+\"}\""
            }
        }
    },
}

function getVolumeControl(plus,i) {
    // var cmd = "document.querySelector(\"#movie_player\").getVolume() "+(plus ? ">":"<")+"= "+(plus ? (100-i)+"":i+"")+" ? document.querySelector(\"#movie_player\").setVolume("+(plus ? "100":"0")+") : document.querySelector(\"#movie_player\").setVolume(document.querySelector(\"#movie_player\").getVolume() "+(plus ? "+":"-")+" "+i+")";
    var cmd = "(document.querySelector(\"#movie_player\").getVolume() "+(plus ? ">":"<")+"= "+(plus ? (100-i)+"":i+"")+" ? document.querySelector(\"#movie_player\").setVolume("+(plus ? "100":"0")+") == \"\"?\"\":\"\" : document.querySelector(\"#movie_player\").setVolume(document.querySelector(\"#movie_player\").getVolume() "+(plus ? "+":"-")+" "+i+") == \"\"?\"\":\"\") + document.querySelector(\"#movie_player\").getVolume()";
    // console.log(cmd);
    return cmd;
}

var youtube = {
    pressPrev: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.pressPrev()));
    },
    pressNext: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.pressNext()));
    },
    timeBack: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.timeBack()));
    },
    timeSkip: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.timeSkip()));
    },
    getVolume: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.getVolume()));
    },
    getPlayIcon: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.getPlayIcon()));
    },
    getVolumeIcon: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.getVolumeIcon()));
    },
    playToggle: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.playToggle()));
    },
    muteToggle: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.muteToggle()));
    },
    volumeMin10: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.volumeMin10()));
    },
    volumeMin1: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.volumeMin1()));
    },
    volumePlus10: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.volumePlus10()));
    },
    volumePlus1: function () {
        var ws = getSelectWebSocket();
        sendMessage(ws,JSON.stringify(sendCommand.volumePlus1()));
    },
}



function setSettings(context, settings) {
    var json = {
        "event": "setSettings",
        "context": context,
        "payload": settings
    };

    websocket.send(JSON.stringify(json));
}

function setTitle(context, title) {
    setSettings(context,null);
    if(muteContext == null){
        return;
    }
    var json = {
        "event": "setTitle",
        "context": context,
        "payload": {
            "title": title,
            "target": DestinationEnum.HARDWARE_AND_SOFTWARE
        }
    };

    websocket.send(JSON.stringify(json));
}



function getSelectWebSocket(){
    if(activeWS == null||activeWS.length == 0){
        return null;
    }
    var ws = latestWS;
    if(latestWS == null||!activeWS.includes(latestWS)) {
        latestWS = activeWS[0];
        ws = activeWS[0];
    }
    return ws;
}

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    pluginUUID = inPluginUUID;

    websocket = new WebSocket("ws://127.0.0.1:" + inPort);

    function registerPlugin(inPluginUUID) {
        var json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };

        websocket.send(JSON.stringify(json));
    }

    websocket.onopen = function () {
        registerPlugin(pluginUUID);
    };

    websocket.onmessage = function (evt) {
        // console.log(evt.data);
        var jsonObj = JSON.parse(evt.data);
        var event = jsonObj["event"];
        var action = jsonObj["action"];
        var context = jsonObj["context"];

        if (event == "keyDown") {
            var jsonPayload = jsonObj["payload"];
            var settings = jsonPayload["settings"];
            var coordinates = jsonPayload["coordinates"];
            var userDesiredState = jsonPayload["userDesiredState"];
            counterAction.onKeyDown(action,context, settings, coordinates, userDesiredState);
        } else if (event == "keyUp") {
            var jsonPayload = jsonObj["payload"];
            var settings = jsonPayload["settings"];
            var coordinates = jsonPayload["coordinates"];
            var userDesiredState = jsonPayload["userDesiredState"];
            counterAction.onKeyUp(action,context, settings, coordinates, userDesiredState);
        } else if (event == "willAppear") {
            var jsonPayload = jsonObj["payload"];
            var settings = jsonPayload["settings"];
            var coordinates = jsonPayload["coordinates"];
            counterAction.onWillAppear(action,context, settings, coordinates);
        }
    };

    websocket.onclose = function () {
    };
}

var latestWS = null;
var activeWS = [];

var chromePort = 9222;
var chromeWS = [];

function sendMessage(ws,msg) {
    try {
        if (ws.readyState != WebSocket.CLOSED&&ws.readyState != WebSocket.CLOSING) {
            ws.send(msg);
        }
    } catch (e){
    }
}

async function getChromeWebSockets() {
    try {
        const response = await axios.get("http://localhost:"+chromePort+"/json");
        return response.data;
    } catch (e){
        // console.log(e);
    }
}

function connectChromeDevToolsWebSocket(webSocketUrl) {
    if (containsChromeWS(webSocketUrl)) {
        return;
    }
    var ws = connectWebSocket(webSocketUrl);
    chromeWS.push(ws);
}

function containsChromeWS(url){
    for (let i = 0; i < chromeWS.length; i++) {
        if (chromeWS[i].url == url) {
            return true;
        }
    }
    return false;
}

function disconnectChromeWS(url){
    for (let i = 0; i < chromeWS.length; i++) {
        if (chromeWS[i].url == url) {
            chromeWS[i].close(1000,"stop");
        }
    }
}

function connectWebSocket(url) {
    var ws = new WebSocket(url);
    ws.onopen = function () {
    };
    ws.onmessage = function (evt) {
        var data;
        try{
            data = JSON.parse(JSON.parse(evt.data)["result"]["result"]["value"]);
        }catch (e){
            return;
        }
        for (let key in data) {
            if(key == "hasActive"){
                if(data[key] == false){
                    if(!activeWS.includes(ws)){
                        activeWS.push(ws);
                    }
                } else {
                    activeWS = activeWS.filter(item=> item != ws);
                    if (latestWS == ws) {
                        latestWS = null;
                    }
                }
            }
            if(key == "getVolume"){
                setTitle(muteContext,data[key]+"");
            }
        }
    };
    ws.onclose = function () {
        chromeWS = chromeWS.filter(item=> item != ws);
        activeWS = activeWS.filter(item=> item != ws);
    };
    return ws;
}

