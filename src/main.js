const app = new PIXI.Application({width:640, height:480});
document.body.appendChild(app.view);

let g = new PIXI.Graphics;
g.beginFill(0x0000FF, 1);
g.drawCircle(0, 0, 30);
g.endFill();
g.x = app.renderer.width/2;
g.y = app.renderer.height/2;

app.stage.addChild(g);

let keyState = {};
let speed = 5;
app.ticker.add(delta=>{
    if( !!keyState['ArrowUp'] )
        g.y -= speed;
    if( !!keyState['ArrowDown'] )
        g.y += speed;
    if( !!keyState['ArrowLeft'] )
        g.x -= speed;
    if( !!keyState['ArrowRight'] )
        g.x += speed;
})

document.addEventListener('keydown', function(evt){    
    keyState[evt.code] = true;
})
document.addEventListener('keyup', function(evt){
    keyState[evt.code] = false;
})