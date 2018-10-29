console.log("main init")

requirejs.config({
    paths:{
        "PIXI":"libs/pixi.js/dist/pixi",
        "jquery":"libs/jquery/dist/jquery",
        "game":"game",
        "keyState" : "key-state",
        "firebase":"//www.gstatic.com/firebasejs/5.5.5/firebase"
    },
    shim : {
        "firebase":{
            exports:"firebase"
        }
    }
})

requirejs(["game", "firebase"], function(game, firebase){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDMG3KijFdax5-FHaOQ4hZVRBXAi8KYO-c",
        authDomain: "h5games-c799c.firebaseapp.com",
        databaseURL: "https://h5games-c799c.firebaseio.com",
        projectId: "h5games-c799c",
        storageBucket: "h5games-c799c.appspot.com",
        messagingSenderId: "692524715842"
    };
    firebase.initializeApp(config);

    game.init()
})
