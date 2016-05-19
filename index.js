'use strict';

var filestore   = require('./lib/filestore'),
    gutil       = require('gulp-util'),
    path        = require('path'),
    through     = require('through2'),
    PluginError = require('gulp-util').PluginError;

// Consts
const PLUGIN_NAME = 'gulp-nwabap-ui5uploader';

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
            var store = new filestore(options);
            var s = sources.map(function(source) {
                return path.relative(cwd, source.path) || '.';
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

            // sources = sources.filter(function(source) {
            // return !source.isNull() ||
            //     options.emptyDirectories ||
            //     (source.path === cwd && options.recursive);
            // });

            // if (sources.length === 0) {
            // cb();
            // return;
            // }

            // var shell = options.shell;
            // if (options.port) {
            // shell = 'ssh -p ' + options.port;
            // }

            // var destination = options.destination;
            // if (options.hostname) {
            // destination = options.hostname + ':' + destination;
            // if (options.username) {
            //     destination = options.username + '@' + destination;
            // }
            // } else {
            // destination = path.relative(cwd, path.resolve(process.cwd(), destination));
            // }

            // var config = {
            // options: {
            //     'a': options.archive,
            //     'n': options.dryrun,
            //     'R': options.relative !== false,
            //     'c': options.incremental,
            //     'd': options.emptyDirectories,
            //     'e': shell,
            //     'r': options.recursive && !options.archive,
            //     't': options.times && !options.archive,
            //     'u': options.update,
            //     'v': !options.silent,
            //     'z': options.compress,
            //     'chmod': options.chmod,
            //     'exclude': options.exclude,
            //     'include': options.include,
            //     'progress': options.progress,
            //     'links': options.links
            // },
            // source: sources.map(function(source) {
            //     return path.relative(cwd, source.path) || '.';
            // }),
            // destination: destination,
            // cwd: cwd
            // };

            // if (options.clean) {
            // if (!options.recursive && !options.archive) {
            //     this.emit(
            //     'error',
            //     new PluginError(PLUGIN_NAME, 'clean requires recursive or archive option')
            //     );
            // }
            // config.options['delete'] = true;
            // }

            // if (!options.silent) {
            // var handler = function(data) {
            //     data.toString().split('\r').forEach(function(chunk) {
            //     chunk.split('\n').forEach(function(line, j, lines) {
            //         log('gulp-rsync:', line, (j < lines.length - 1 ? '\n' : ''));
            //     });
            //     });
            // };
            // config.stdoutHandler = handler;
            // config.stderrHandler = handler;

            // gutil.log('gulp-rsync:', 'Starting rsync to ' + destination + '...');
            // }

            // rsync(config).execute(function(error, command) {
            // if (error) {
            //     this.emit('error', new PluginError(PLUGIN_NAME, error.stack));
            // }
            // if (options.command) {
            //     gutil.log(command);
            // }
            // if (!options.silent) {
            //     gutil.log('gulp-rsync:', 'Completed rsync.');
            // }
            // cb();
            // }.bind(this));
        }
    );
};
