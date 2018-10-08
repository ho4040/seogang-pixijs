const app = new PIXI.Application({width:640, height:480});
document.body.appendChild(app.view);

let g = new PIXI.Graphics;
g.beginFill(0xFF0000, 1);
g.drawCircle(0, 0, 30);
g.endFill();

app.stage.addChild(g);

let g_t = 0;
app.ticker.add(delta=>{
    g_t += delta;
    g.x = Math.sin(g_t * 0.05)*100 + app.renderer.width/2;
    g.y = app.renderer.height/2;
})