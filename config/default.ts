
import * as del from 'del';
import * as gulp from 'gulp';
import * as bump from 'gulp-bump';
import * as tsc from 'gulp-typescript';
import * as jsonModify from 'gulp-json-modify';
import * as replace from 'gulp-string-replace';
import * as merge from 'merge';
import * as moment from 'moment';
import * as runSequence from 'run-sequence';
import * as yargs from 'yargs';

const tsProject = tsc.createProject('./tsconfig.json');

const npmconfig = require('../package.json');
const tscConfig = require('../tsconfig.json');
const angularConfig = require('../.angular-cli.json');

const paths = {
    src: tscConfig.compilerOptions.baseUrl,
    build: tscConfig.compilerOptions.outDir,
    content: 'docs/',
    public: 'dist/',    // packaged assets ready for deploy
};

/**
 * Pipe a collection of streams to and arbitrart destination and merge the
 * results.
 */
const pipeTo = (dest: NodeJS.ReadWriteStream) =>
    (...src: NodeJS.ReadableStream[]) =>
        merge(src.map((s) => s.pipe(dest)));

/**
 * Nuke old build assetts.
 */
gulp.task('clean', () => ((...globs: string[]) => del(globs))('dist/', 'compiled/', '_package'));

gulp.task('default', ['build']);

gulp.task('prebuild', () => runSequence('version'));

gulp.task('sw-base', () => {
    return gulp.src(['./dist/main.*.bundle.js']) // Any file globs are supported
        .pipe(replace(new RegExp('"__base__', 'g'), `"${angularConfig.apps[0].baseHref}`, { logs: { enabled: true } }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('postbuild', () => runSequence(
    'unversion',
    'sw-base',
    // 'fix:service-worker'
));

gulp.task('bump', () => {
    const argv = yargs.argv;
    const type = argv.major ? 'major' : (argv.minor ? 'minor' : 'patch');
    gulp.src('./package.json')
        .pipe(bump({ type }))
        .pipe(gulp.dest('./'));
});

gulp.task('version', () => {
    gulp.src('./src/assets/settings.json')
        .pipe(jsonModify({
            key: 'version',
            value: npmconfig.version,
        }))
        .pipe(jsonModify({
            key: 'build',
            value: moment().format('YYYY-MM-DD HH:mm:ss'),
        }))
        .pipe(gulp.dest('./src/assets'));
});

gulp.task('unversion', () => {
    gulp.src('./src/assets/settings.json')
        .pipe(jsonModify({
            key: 'version',
            value: npmconfig.version,
        }))
        .pipe(jsonModify({
            key: 'build',
            value: 'local-dev',
        }))
        .pipe(gulp.dest('./src/assets'));
});

gulp.task('fix:service-worker', () => runSequence(
    // 'fix:service-worker:config',
    'fix:service-worker:runtime'
));

gulp.task('fix:service-worker:config', () => {
    return gulp.src(['./dist/ngsw.json']) // Any file globs are supported
        .pipe(replace(new RegExp('"/', 'g'), `"${angularConfig.apps[0].baseHref}/`, { logs: { enabled: false } }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('fix:service-worker:runtime', () => {
    const parts = npmconfig.name.split('-');
    return gulp.src(['./dist/ngsw-worker.js']) // Any file globs are supported
        .pipe(replace(new RegExp('ngsw:db:', 'g'), `ngsw:db:${parts.length > 1 ? parts[1] : parts[0]}:`, { logs: { enabled: false } }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('usage', () => {
    console.log(`Commands:`);
    console.log(`    build - Build project`);
    console.log(`    bump  - Update project version`);
    console.log(`    clean - Nuke old build assets`);
    console.log(`    lint  - Lint Typescript and Sass files`);
    console.log(`    test  - Run tests`);
    console.log(`    usage - List available gulp tasks`);
});
