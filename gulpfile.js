const browserSync = require('browser-sync');
const gulp = require('gulp');

gulp.task('serve', function(){
    initBrowserSync('src');
})

function initBrowserSync(baseDir){
    browserSync.init({
        server:{
            baseDir:baseDir,
            routes:{
                '/libs':"node_modules",
            }
        },
        single:true,
        startPath:"/",
        browser:"chrome"
    })
}