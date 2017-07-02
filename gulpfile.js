const gulp = require('gulp'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      debug = require('gulp-debug'),
      browserSync = require('browser-sync').create(),
      csso = require('gulp-csso'),
      clean = require('gulp-clean'),
      rigger = require('gulp-rigger');


var input = 'src/sass/**/*.sass';
var otput = 'build/css'
var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};
// HTML
gulp.task('html:templates', function() {
    gulp.src('src/templates/*.html')
    .pipe(debug({title: 'html rigger taking...'}))
    .pipe(rigger())
    .pipe(gulp.dest('build'))
    .pipe(debug({title: 'html rigger done...'}))
    
})
gulp.task('html', function() {
    gulp.src('src/*.html')
    .pipe(debug({title: 'html rigger taking...'}))
    .pipe(rigger())
    .pipe(gulp.dest('build'))
    .pipe(debug({title: 'html rigger done...'}))
    
})
// CSS/SASS
gulp.task('sass', function() {
    return gulp.src(input)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
    }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(otput))
    .pipe(browserSync.reload({stream: true}));
})
//clean tasks
gulp.task('clean', function() {
    gulp.src('build/css', {read: false})
    .pipe(clean())
})
// BS tasks
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false,
        browser: 'chrome'
    })
})
gulp.task('default', ['sass', 'watch', 'browser-sync']);


gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.sass', ['sass'])
    gulp.watch('src/*.html', ['html'])
    gulp.watch('src/templates/*.html', ['html'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch('build/*.html').on('change', browserSync.reload)
    gulp.watch('build/css/*.css').on('change', browserSync.reload)
})
