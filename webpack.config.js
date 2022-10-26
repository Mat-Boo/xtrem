const Encore = require('@symfony/webpack-encore');
require("dotenv").config();
var dotenv = require('dotenv');
var fs = require('fs');
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    .enableReactPreset()
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/js/app.js')

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
    .enableStimulusBridge('./assets/controllers.json')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-proposal-class-properties');
    })

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

    // enables Sass/SCSS support
    .enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you use React
    //.enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()

    .addPlugin(new BrowserSyncPlugin(
        {
            host: "127.0.0.1",
            port: 3000,
            proxy: process.env.PROXY,
            files: [
                {
                    match: ["src/*.php"],
                },
                {
                    match: ["templates/*.twig"],
                },
                {
                    match: ["assets/*.js"],
                },
                {
                    match: ["assets/*.css"],
                },
            ],
            notify: false,
        },

        {

            reload: true,
        }
    ))

    .configureDefinePlugin(options => {
        
        fs.exists('./.env.local', (exists) => {
            if (exists) {
                var env = dotenv.config({path: './.env.local'});
            } else {
                var env = dotenv.config({path: './.env'});
            }
            console.log(env)
            if (env.error) {
                throw env.error;
            }
            
            options['process.env.APP_ENV'] = JSON.stringify(env.parsed.APP_ENV );
        });
    })


module.exports = Encore.getWebpackConfig();
