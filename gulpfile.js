const browserSync = require('browser-sync');
const gulp = require('gulp');
const fs = require('fs');
var ncp = require('ncp').ncp;

gulp.task('build', function(){
    const folders = [
        'release',
        'release/',
        'release/static',
        'release/libs',
    ]

    folders.forEach(dir=>{
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log('📁  folder created:', dir);    
        }
    })

    gulp.src("src/**").pipe(gulp.dest('release/'))    
    gulp.src("resources/**").pipe(gulp.dest('release/static'))
   
    ncp("node_modules/pixi.js", "release/libs/pixi.js", {clobber:true}, function(err){})
    ncp("node_modules/howler", "release/libs/howler", {clobber:true}, function(err){})
})

gulp.task('serve', function(){
    initBrowserSync('src');
    gulp.watch("src/**", function(evt){
        browserSync.reload(evt.path);
    });
})

function initBrowserSync(baseDir){
    browserSync.init({
        server:{
            baseDir:baseDir,
            routes:{
                '/libs':"node_modules",
                '/static':'resources'
            }
        },
        single:true,
        startPath:"/",
        browser:"chrome"
    })
}