define(['jquery', 'PIXI', 'firebase'], function ($, PIXI, firebase) {
    
    let _m = {};

    let gameObj = {}
    let gameState = {}

    let keyState = {};


    
    let sub = function (v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y }
    }

    let len = function (vec) {
        return Math.sqrt((Math.pow(vec.x, 2) + Math.pow(vec.y, 2)))
    }

    let dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    }

    _m.init = function () {

        console.log("game init")

        let firestore = firebase.firestore()
    
        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);

        const app = new PIXI.Application({ width: 640, height: 480 });
        document.getElementById("gameArea").appendChild(app.view);
        let loader = new PIXI.loaders.Loader()
        _m.app = app;
        
        loader.add('ship', "static/player.png")
            .add('meteor', "static/meteorSmall.png")
            .add('crushSnd', "static/crush.wav")


        loader.load(function (loader, res) {

            gameObj.crushSnd = res.crushSnd.data;

            var ship = new PIXI.Sprite(res.ship.texture);
            ship.scale.set(0.5, 0.5)
            _m.app.stage.addChild(ship)
            gameObj.player = ship
            gameObj.meteors = []
            for (let i = 0; i < 30; i++) {
                var meteor = new PIXI.Sprite(res.meteor.texture);
                gameObj.meteors.push(meteor)
                meteor.init = function () {

                    this.rotation = Math.random() * 3.14 * 2
                    let theta = Math.random() * Math.PI * 2
                    let initD = Math.random() * 400 + 400
                    this.x = _m.app.renderer.width * 0.5 + Math.cos(theta) * initD
                    this.y = _m.app.renderer.height * 0.5 + Math.sin(theta) * initD

                    //Set direction Normalized
                    let v = sub(gameObj.player, this)
                    let d = len(v)
                    this.dirVec = { x: v.x / d, y: v.y / d }
                }
                gameObj.meteors.push(meteor)
                meteor.anchor.set(0.5, 0.5)
                meteor.scale.set(0.8, 0.8)
                _m.app.stage.addChild(meteor)
            }



            var scoreText = new PIXI.Text('00', { fontFamily: 'Arial', fontSize: 24, fill: 0xffFFFF, align: 'center' });
            _m.app.stage.addChild(scoreText)
            gameObj.scoreText = scoreText

        }) // End of loader

        $("#scoreAddBtn").on("click", function () {
            let score = gameState.elapsedTime / 100
            let name = $("#playerNameInput").val()
            // console.log(name);
            firebase.firestore().collection("leaderboard").add({ score: score, name: name }).then(() => {

                _m.showLeaderBoard();
            })
        })

        

        $("#gameStartBtn").on("click", function () {
            $("#gameArea").show()
            _m.resetGame();
        })

        document.addEventListener('keydown', function (evt) {
            keyState[evt.code] = true;
        })

        document.addEventListener('keyup', function (evt) {
            keyState[evt.code] = false;
        })

        _m.showLeaderBoard()



    } //End of init method

    _m.enterFrame = function (delta) {
        
        
        
        if (!gameState.paused) {

            gameState.elapsedTime += delta

            gameState.speed = gameState.elapsedTime / 1000 + 1

            gameObj.scoreText.text = (gameState.elapsedTime / 100).toFixed(2)

            for (let meteor of gameObj.meteors) {
                meteor.x += meteor.dirVec.x * gameState.speed * delta
                meteor.y += meteor.dirVec.y * gameState.speed * delta
                let v1 = sub(gameObj.player, meteor)
                let v2 = meteor.dirVec
                let dist = len(v1);
                meteor.rotation += Math.PI * 0.005
                if (dot(v1, v2) < 0 && dist > 640)
                    meteor.init()

                if (dist < 20) { //Game Over
                    gameState.paused = true;
                    gameObj.crushSnd.play()
                    _m.gameOver()
                }
            }

            if (!!keyState['ArrowUp'])
                gameObj.player.y -= gameState.speed * delta * 2;
            if (!!keyState['ArrowDown'])
                gameObj.player.y += gameState.speed * delta * 2;
            if (!!keyState['ArrowLeft'])
                gameObj.player.x -= gameState.speed * delta * 2;
            if (!!keyState['ArrowRight'])
                gameObj.player.x += gameState.speed * delta * 2;
        }
    }

    _m.resetGame = function () {

        gameObj.player.x = _m.app.renderer.width / 2
        gameObj.player.y = _m.app.renderer.height / 2
        gameObj.player.anchor.x = 0.5
        gameObj.player.anchor.y = 0.5

        for (let meteor of gameObj.meteors) {
            meteor.init()
        }

        gameState.elapsedTime = 0;
        gameState.paused = false;
        gameState.speed = 1;

        _m.app.ticker.add(_m.enterFrame)

    }


    _m.showLeaderBoard = function () {
        $("#gameArea").hide()
        $("#gameOver").hide()
        $("#leaderBoard").show()
        firebase.firestore().collection("leaderboard").orderBy("score", "desc").limit(10).get().then(qss => {
            let leaderBoardContent = qss.docs.map(doc => {
                let data = doc.data()
                return "<li>" + data['name'] + " : " + data['score'] + "</li>"
            }).join("")
            $("#rankContent").html(`<ol>${leaderBoardContent}</ol>`)
        })
    }

    _m.gameOver = function () {
        _m.app.ticker.remove(_m.enterFrame)
        $("#score").html(gameState.elapsedTime / 100)
        $("#gameArea").hide()
        $("#leaderBoard").hide()
        $("#gameOver").show()
    }

    return _m;
}) //End of define

