'use strict';

var Filestore   = require('./lib/filestore'),
    gutil       = require('gulp-util'),
    path        = require('path'),
    through     = require('through2'),
    PluginError = require('gulp-util').PluginError;

// Constants
var PLUGIN_NAME = 'gulp-nwabap-ui5uploader';

module.exports = function (options) {
    if (typeof options !== 'object') {
        // this.emit(
        //     'error',
            throw new PluginError(PLUGIN_NAME, 'options must be an object');
        // );
    }

//   if (typeof options.destination !== 'string') {
//     throw new PluginError(PLUGIN_NAME, 'destination must be a string to a desired path');
//   }

    if (!options.auth || !options.auth.user || !options.auth.pwd) {
        throw new PluginError(PLUGIN_NAME, '"auth" option not (fully) specified (check user name and password).');
    }

    if (!options.conn || !options.conn.server) {
        throw new PluginError(PLUGIN_NAME, '"conn" option not (fully) specified (check server).');
    }

    if (!options.ui5 || !options.ui5.package || !options.ui5.bspcontainer || !options.ui5.bspcontainer_text) {
        throw new PluginError(PLUGIN_NAME, '"ui5" option not (fully) specified (check package, BSP container, BSP container text information).');
    }

    if (options.ui5.package !== '$TMP' && !options.ui5.transportno) {
        throw new PluginError(PLUGIN_NAME, 'For packages <> "$TMP" a transport number is necessary.');
    }

    if (options.ui5.bspcontainer.length > 15) {
        throw new PluginError(PLUGIN_NAME, '"ui5.bspcontainer" option must not be longer than 15 characters.');
    }

    if (!options.ui5.language) {
        options.ui5.language = 'EN';
    }

    var sources = [];

    var cwd = options.root ? path.resolve(options.root) : process.cwd();

    return through.obj(
        // Transform
        function (file, enc, cb) {
            if (file.isStream()) {
                this.emit(
                    'error',
                    new PluginError(PLUGIN_NAME, 'Streams are not supported!')
                );
            }

            if (path.relative(cwd, file.path).indexOf('..') === 0) {
                this.emit(
                    'error',
                    new PluginError(PLUGIN_NAME, 'Source contains paths outside of root')
                );
            }

            sources.push(file);
            cb(null, file);
        },

        // Flush
        function (cb) {
            var store = new Filestore(options);

            sources = sources.filter(function(source) {
                return !source.isNull();
            });

            var s = sources.map(function(source) {
                return path.relative(cwd, source.path).replace(/\\/g, '/') || '.';
            });

            var me = this;
            store.syncFiles(s, cwd, function (error, syncedfiles) {
                if (error) {
                    me.emit('error', new PluginError(PLUGIN_NAME, error));
                }

                if (syncedfiles) {
                    syncedfiles.forEach(function (oItem) {
                        gutil.log(PLUGIN_NAME, 'Uploaded:', oItem.type, oItem.id, oItem.modif + 'd.');
                    });
                }

                cb();
            });
        }
    );
};
