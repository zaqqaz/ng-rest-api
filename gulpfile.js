'use strict';
let path = require('path');
let gulp = require('gulp');
let rename = require("gulp-rename");
let $ = require('gulp-load-plugins')();

let conf = {
    moduleName: 'ng-rest-api',
    paths: {
        initModule: './dev/index.js',
        src: 'src',
        dist: '/'
    }
};



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
        output: {filename: `./${conf.moduleName}.js`}
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
        .pipe(gulp.dest('./'));
}

gulp.task('build', () => {
    return webpack();
});

gulp.task('minify', () => {
    return gulp.src(`./${conf.moduleName}.js`)
        .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
        .pipe(rename(`./${conf.moduleName}.min.js`))
        .pipe(gulp.dest('./'));
});