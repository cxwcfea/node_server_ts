const gulp = require('gulp');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('test', () => {
  process.env.NODE_ENV = 'test';
  return gulp
    .src(['test/**/*.js', '!test/data/*.js'], { read: false })
    .pipe(mocha({
      compilers: ['ts:ts-node/register'],
      reporter: 'spec',
    }));
});

gulp.task('compile', () => {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['compile'], () => {
  return gulp.watch('server/**/*.ts', ['compile']);
});

gulp.task('nodemon', ['watch'], () => {
  nodemon({
    script: 'dist/index.js',
    ext: 'js',
    env: {
      NODE_ENV: 'development',
    },
  });
});

gulp.task('default', ['watch', 'nodemon']);
