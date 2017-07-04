const gulp = require('gulp'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      debug = require('gulp-debug'),
      browserSync = require('browser-sync').create(),
      csso = require('gulp-csso'),
      clean = require('gulp-clean'),
      rigger = require('gulp-rigger'),
      changed = require('gulp-changed'),
      imagemin = require('gulp-imagemin'),
      
      postcss = require('gulp-postcss'),
      postCssNested = require('postcss-nested'),
      postCssVars = require('postcss-simple-vars'),
      postCssImport = require('postcss-import');


var input = 'src/css/**/styles.css';
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

// CSS
gulp.task('css', function() {
    
    preprocessors = [
        postCssImport({path: ['src/css']}),
        postCssNested,
        postCssVars
];
   return gulp.src(input)
    .pipe(postcss(preprocessors))
    //.pipe(changed('build/css'))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
    }))
    .pipe(gulp.dest(otput))
    .pipe(browserSync.reload({stream: true}));
})

//IMG task
gulp.task('img', function() {
    gulp.src(['src/img/**/*.{jpg,png,gif}', 'src/i/**/*.{jpg,png,gif}'], {base: 'src'})
    .pipe(imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(gulp.dest('build'))
})

// SVG task
gulp.task('svg', function(){
      gulp.src('src/i/svg/**/*.svg', {base: 'src'})
    .pipe(gulp.dest('build'))
})

//clean task
gulp.task('clean', function() {
    gulp.src('build', {read: false})
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
gulp.task('default', ['css', 'watch', 'browser-sync']);

// Watchers tasks
gulp.task('watch', function() {
    gulp.watch('src/css/**/styles.css', ['css'])
    gulp.watch('src/*.html', ['html'])
    gulp.watch('src/templates/*.html', ['html'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch('build/*.html').on('change', browserSync.reload)
    gulp.watch('build/css/*.css').on('change', browserSync.reload)
})
