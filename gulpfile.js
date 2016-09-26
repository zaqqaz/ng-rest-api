'use strict';
let path = require('path');
let gulp = require('gulp');
let rename = require("gulp-rename");
let $ = require('gulp-load-plugins')();

let conf = {
    moduleName: 'ng-rest-api',
    watch: false,
    paths: {
        entry: './src/index.js',
        src: 'src',
        dist: './'
    }
};

function webpack() {
    let webpackOptions = {
        watch: conf.watch,
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015'],
                        plugins: ["transform-object-assign"]
                    }
                }
            ]
        },
        entry: conf.paths.entry,
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

    return gulp.src(conf.paths.src)
        .pipe($.webpack(webpackOptions, null, webpackChangeHandler))
        .pipe($.ngAnnotate())
        .pipe(gulp.dest(conf.paths.dist));
}


function minify() {
    return gulp.src(`./${conf.moduleName}.js`)
        .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
        .pipe(rename(`./${conf.moduleName}.min.js`))
        .pipe(gulp.dest('./'));
}

gulp.task('demo', () => {
    conf = {
        moduleName: 'demo.dist',
        watch: true,
        paths: {
            entry: './demo/demo.js',
            src: 'src',
            dist: './demo'
        }
    };

    webpack();
});

gulp.task('build', () => {
    webpack();
});

gulp.task('default', ['build'], () => {
    minify();
});