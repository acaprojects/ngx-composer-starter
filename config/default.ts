
import * as del from 'del';
import * as gulp from 'gulp';
import * as bump from 'gulp-bump';
import * as replace from 'gulp-string-replace';
import * as moment from 'moment';
import * as runSequence from 'run-sequence';
import * as yargs from 'yargs';
import * as fs from 'fs-extra';

const npmconfig = require('../package.json');
const settings = require('../src/assets/settings.json');

const baseHref = '/staff';

const prod_settings = {
    composer: {
        domain: '',
        route: baseHref,
        protocol: 'https:'
    },
    mock: false
};

const mergeJSON = (a, b) => {
    for (const f in b) {
        if (b.hasOwnProperty(f)) {
            if (!a[f]) {
                a[f] = b[f];
            } else if (typeof b[f] === 'object' && typeof a[f] === 'object') {
                mergeJSON(a[f], b[f]);
            } else {
                a[f] = b[f];
            }
        }
    }
};

/**
 * Nuke old build assetts.
 */
gulp.task('clean', () => ((...globs: string[]) => del(globs))('dist/', 'compiled/', '_package'));

gulp.task('default', ['build']);

gulp.task('pre-build', (next) => runSequence(
    'sw:base',
    'settings:update',
    next
));

gulp.task('pre-serve', (next) => runSequence(
    'check:flags',
    next
));

gulp.task('post-build', (next) => runSequence(
    'build:manifest',
    'settings:reset',
    'sw:unbase',
    'fix:service-worker',
    next
));

gulp.task('build:manifest', (next) => {
    const app = settings.app || {};
    const manifest: any = {
        short_name: app.short_name || 'ACA Staff Application',
        name: app.name || 'ACA Staff Application',
        icons: [
            {
                src: 'assets/icon/launch.png',
                sizes: '196x196',
                type: 'png'
            }
        ],
        start_url: 'index.html',
        display: 'standalone'
    };
    fs.outputJson('./dist/manifest.json', manifest, { spaces: 4 })
        .then(() => next());
});

gulp.task('sw:base', () => {
    return gulp.src(['./src/app/app.module.ts', './src/app/app.component.ts']) // Any file globs are supported
        .pipe(replace(new RegExp('\'__base__', 'g'), `'${baseHref}/`, { logs: { enabled: false } }))
        .pipe(gulp.dest('./src/app'));
});

gulp.task('sw:unbase', () => {
    return gulp.src(['./src/app/app.module.ts', './src/app/app.component.ts']) // Any file globs are supported
        .pipe(replace(new RegExp(`'${baseHref}/`, 'g'), '\'__base__', { logs: { enabled: false } }))
        .pipe(gulp.dest('./src/app'));
});

gulp.task('bump', () => {
    const argv = yargs.argv;
    const type = argv.major ? 'major' : (argv.minor ? 'minor' : 'patch');
    gulp.src('./package.json')
        .pipe(bump({ type }))
        .pipe(gulp.dest('./'));
});

gulp.task('check:flags', (next) => {
    const argv = yargs.argv;
    const s = JSON.parse(JSON.stringify(settings));
    s.mock = !!argv.mock;
    fs.outputJson('./src/assets/settings.json', s, { spaces: 4 })
        .then(() => next());
});

gulp.task('settings:update', (next) => {
    const argv = yargs.argv;
    const s = JSON.parse(JSON.stringify(settings));
    s.version = npmconfig.version;
    s.build = moment().seconds(0).milliseconds(0).valueOf();
    mergeJSON(s, prod_settings);
    s.mock = !!argv.mock;
    s.env = !!argv.prod ? 'prod' : 'dev';
    fs.outputJson('./src/assets/settings.json', s, { spaces: 4 })
        .then(() => next());
});

gulp.task('settings:reset', (next) => {
    const s = JSON.parse(JSON.stringify(settings));
    s.build = 'local-dev';
    s.env = 'dev';
    s.mock = false;
    fs.outputJson('./src/assets/settings.json', s, { spaces: 4 })
        .then(() => next());
});

gulp.task('fix:service-worker', (next) => runSequence(
    'fix:service-worker:config',
    'fix:service-worker:runtime',
    next
));

gulp.task('fix:service-worker:config', () => {
    return gulp.src(['./dist/ngsw.json']) // Any file globs are supported
    .pipe(replace(new RegExp('"/', 'g'), `"${baseHref}/`, { logs: { enabled: false } }))
    .pipe(replace(/"\\\\\/assets\\\\\//g, `"\\\\${baseHref}\\\\/assets\\\\/`, { logs: { enabled: true } }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('fix:service-worker:runtime', () => {
    const parts = npmconfig.name.split('-');
    return gulp.src(['./dist/ngsw-worker.js']) // Any file globs are supported
        .pipe(replace(new RegExp('ngsw:', 'g'), `ngsw:${parts.length > 1 ? parts[1] : parts[0]}:`, { logs: { enabled: false } }))
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
