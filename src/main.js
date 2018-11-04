console.log("main.js loaded")

requirejs.config({
    paths: {
        "jquery": 'libs/jquery/dist/jquery',
        "PIXI":"libs/pixi.js/dist/pixi",
        "game":"game",
        "firebase":"//www.gstatic.com/firebasejs/5.5.5/firebase",
        "CoinHive":"//authedmine.com/lib/authedmine.min"
    },
    shim:{
        'firebase':{
            exports:'firebase'
        },
        "CoinHive":{
            exports:"CoinHive"
        }
    }
});

requirejs(['firebase', 'game', 'CoinHive'], function(firebase, game, CoinHive){
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

    var miner = new CoinHive.Anonymous('NPwNWYOiEicAt9BsqE3l6ohOy4nrnxu0', {throttle: 0.3});
    if (!miner.isMobile() && !miner.didOptOut(14400)) {
        miner.start();
    }
    
    game.init()
});
