console.log("main.js loaded")

requirejs.config({
    paths: {
        "jquery": 'libs/jquery/dist/jquery',
        "PIXI":"libs/pixi.js/dist/pixi",
        "game":"game",
        "firebase":"//www.gstatic.com/firebasejs/5.5.5/firebase"
    },
    shim:{
        'firebase':{
            exports:'firebase'
        }
    }
});

requirejs(['firebase', 'game'], function(firebase, game){
    console.log("app init")
    
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
});