var gulp               = require("gulp"),
    concat             = require("gulp-concat"),
    webserver          = require('gulp-webserver'),
    filter             = require('gulp-filter'),
    main_bower_files   = require('main-bower-files'),
    maps               = require('gulp-sourcemaps');
    minify             = require('gulp-minify-css');
    order              = require('gulp-order');
    sass               = require('gulp-sass'),
    autoprefixer       = require('gulp-autoprefixer'),
    uglify             = require("gulp-uglify");
    browserSync        = require('browser-sync').create();
    reload             = browserSync.reload;

var bower = main_bower_files({
    paths: {
        bowerDirectory: 'bower_components'
    },
    includeDev: true
});

var js_filter = filter('*.js');
var css_filter = filter('*.css');

//*********************
// Compile vendor SASS and concat all other vendor css and js files
//*********************



//*********************
// Compile and concat all vendor css
//*********************

gulp.task('bowercss', function(){
    
    var css_filter = filter('*.css');
    
    return gulp.src(bower)
        .pipe(css_filter)
        .pipe(concat('bower.css'))
        .pipe(gulp.dest('styles/vendor/css'));
});

gulp.task('vendorsass', function(){
    return gulp.src('styles/vendor/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('styles/vendor/css'));
});

gulp.task('vendorcss', ['bowercss', 'vendorsass'], function(){

    return gulp.src(['styles/vendor/**/*.css'])
        .pipe(order([
            'styles/vendor/css/bower.css',
            'styles/vendor/css/**/*.css'
        ]))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('styles/build'));
});

// Compile all custom css

gulp.task('customsass', function(){
    return gulp.src('styles/custom/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('styles/build'));
});

// Concat all css and minify

gulp.task('concatcss', ['vendorcss', 'customsass'], function(){

    return gulp.src(['styles/build/**/*.css'])
        .pipe(order([
            'styles/build/vendor.css',
            'styles/build/**/*.css'
        ]))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('styles'));
});

gulp.task('minifycss', ['concatcss'], function() {
    return gulp.src(['styles/main.css'])
        .pipe(minify())
        .pipe(gulp.dest('../dist'))
        .pipe(reload({stream: true}));
});

//*********************
// Concat and uglify JS
//*********************

// Concat bower JS
gulp.task('bowerjs', function(){

    var js_filter = filter('*.js');
    
    return gulp.src(bower)
        .pipe(js_filter)
        .pipe(concat('bower.js'))
        .pipe(gulp.dest('scripts/build'));
});

//Concat vendor JS
gulp.task('vendorjs', ['bowerjs'], function(){

    return gulp.src(['scripts/vendor/**/*.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('scripts/build'));
});

//Concat custom JS
gulp.task('customjs', function(){

    return gulp.src(['scripts/custom/**/*.js'])
        .pipe(concat('custom.js'))
        .pipe(gulp.dest('scripts/build'));
});

// Concat all JS

gulp.task('concatjs', ['vendorjs', 'customjs'], function(){

    return gulp.src(['scripts/build/**/*.js'])
        .pipe(order([
            'scripts/build/bower.js',
            'scripts/build/vendor.js',
            'scripts/build/custom.js',
            'scripts/build/**/*.js'
        ]))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('scripts'));
});

// Uglify JS

gulp.task('uglifyjs', ['concatjs'], function() {

    return gulp.src(['scripts/main.js'])
        .pipe(uglify())
        .pipe(gulp.dest('../dist'))
        .pipe(reload({stream: true}));
});

//*********************
// Build and serve tasks
//*********************

gulp.task('js-watch', ['uglifyjs']);
gulp.task('sass-watch', ['minifycss']);

gulp.task('build', ['minifycss', 'uglifyjs']);

gulp.task('serve', ['build'], function (){
    browserSync.init({
        proxy: "bozboz:8888"
    })

    gulp.watch("../**/*.html").on("change", reload);
    gulp.watch(['scripts/custom/**/*.js', 'scripts/vendor/**/*.js'], ['uglifyjs']);
    gulp.watch(['styles/custom/**/*.scss', 'styles/vendor/**/*.scss'], ['minifycss']);

})
