'use strict';
let path = require('path');
let gulp = require('gulp');
let conf = {
    moduleName: 'ng-rest-api',
    paths: {
        initModule: './dev/index.js',
        src: 'src',
        dist: '/'
    }
};

let $ = require('gulp-load-plugins')();

function webpack() {
    let webpackOptions = {
        watch: false,
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        },
        entry: './src/index.js',
        output: {filename: './' + conf.moduleName + '.min.js'}
    };


    let webpackChangeHandler = function (err, stats) {
        if (err) {
            conf.errorHandler('Webpack')(err);
        }
        $.util.log(stats.toString({
            colors: $.util.colors.supportsColor,
            chunks: false,
            hash: false,
            version: false
        }));
    };

    return gulp.src(path.join(conf.paths.src, conf.paths.initModule))
        .pipe($.webpack(webpackOptions, null, webpackChangeHandler))
        .pipe($.ngAnnotate())
        .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
        .pipe(gulp.dest('./'));
}

gulp.task('build', function () {
    return webpack();
});