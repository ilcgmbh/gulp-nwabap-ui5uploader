# gulp-nwabap-ui5uploader

`gulp-nwabap-ui5uploader` is a Gulp plugin which allows a developer to upload SAPUI5/OpenUI5 sources into a SAP NetWeaver ABAP system as part of the Gulp task chain. The behavior is (or should be) the same than it is known from the SAP Web IDE app deployment option "Deploy to SAPUI5 ABAP Repository" or from the "SAPUI5 ABAP Repository Team Provider" available for Eclipse via the "UI Development Toolkit for HTML5".
The plugin allows a developer to deploy the sources to a SAP NetWeaver ABAP system by a Gulp task using a different IDE than Eclipse or SAP Web IDE (for instance WebStorm). The main benefit is to integrate the deployment process into a Continuous Integration environment, in which for instance a Jenkins server executes several build steps and finally deploys the sources to a SAP NetWeaver ABAP system if all previous build steps are ok.  

## Prerequisites

### ABAP Development Tool Services
The ABAP Development Tool Services have to be activated on the SAP NetWeaver ABAP System (transaction SICF, path /sap/bc/adt).
The user used for uploading the sources needs to have the authorization to use the ADT Services and to create/modify BSP applications.
The plugin is tested with NW 7.40 and NW 7.50 systems.

## Install

```
$ npm install gulp-nwabap-ui5uploader --save-dev
```

## Usage

### Upload to `$TMP` package

```js
var gulp = require('gulp');
var ui5uploader = require('gulp-nwabap-ui5uploader');

gulp.task('deploy', function() {
  return gulp.src('build/**')
    .pipe(ui5uploader({
        conn: {
            server: 'http://myserver:8000'
        },
        auth: {
            user: 'username',
            pwd: 'password'
        },
        ui5: {
            package: '$TMP',
            bspcontainer: 'ZZ_UI5_LOCAL',
            bspcontainer_text: 'UI5 upload local objects'
        },
        resources: {
            cwd: 'build-folder',
            src: '**/*.*'
        }        
    }));
});
```

### Upload to `$TMP` package

```js
var sUser = grunt.option('user');
var sPwd = grunt.option('pwd');

grunt.initConfig({
  nwabap_ui5uploader: {
    options: {
      conn: {
        server: 'http://myserver:8000',
      },
      auth: {
        user: sUser,
        pwd: sPwd
      }
    },
    upload_build: {
      options: {
        ui5: {
           package: '$TMP',
           bspcontainer: 'ZZ_UI5_LOCAL',
           bspcontainer_text: 'UI5 upload local objects'
        },
        resources: {
          cwd: 'build-folder',
          src: '**/*.*'
        }
      }
    }
  }
});
```

### Upload to a transport tracked package

```js
var sUser = grunt.option('user');
var sPwd = grunt.option('pwd');

grunt.initConfig({
  nwabap_ui5uploader: {
    options: {
      conn: {
        server: 'http://myserver:8000',
      },
      auth: {
        user: sUser,
        pwd: sPwd
      }
    },
    upload_build: {
      options: {
        ui5: {
           package: 'ZZ_UI5_REPO',
           bspcontainer: 'ZZ_UI5_TRACKED',
           bspcontainer_text: 'UI5 upload',
           transportno: 'DEVK900000'
        },
        resources: {
          cwd: 'build-folder',
          src: '**/*.*'
        }
      }
    }
  }
});
```

### Upload to different servers

```js
var sUser = grunt.option('user');
var sPwd = grunt.option('pwd');

grunt.initConfig({
  nwabap_ui5uploader: {
    upload_build_740: {
      options: {
        conn: {
          server: 'http://myserver740:8000',
        },
        auth: {
          user: sUser,
          pwd: sPwd
        },      
        ui5: {
           package: 'ZZ_UI5_REPO',
           bspcontainer: 'ZZ_UI5_TRACKED',
           bspcontainer_text: 'UI5 upload',
           transportno: 'DEVK900000'
        },
        resources: {
          cwd: 'build-folder',
          src: '**/*.*'
        }
      }
    },
    upload_build_750: {
      options: {
        conn: {
          server: 'http://myserver750:8000',
        },
        auth: {
          user: sUser,
          pwd: sPwd
        },      
        ui5: {
           package: 'ZZ_UI5_REPO',
           bspcontainer: 'ZZ_UI5_TRACKED',
           bspcontainer_text: 'UI5 upload',
           transportno: 'DEVK900000'
        },
        resources: {
          cwd: 'build-folder',
          src: '**/*.*'
        }
      }
    }    
  }
});
```


## API

### `ui5uploader(options)`

#### `options`

##### `conn`

###### `server`
Type: `String`

Defines SAP NetWeaver ABAP server (for instance `http://myserver:8000`).

##### `auth`

###### `user`
Type: `String`

Defines the user which is used for access to the SAP NetWeaver ABAP server. It is not recommended to store the user in the Grunt file. It should be passed as argument.

###### `pwd`
Type: `String`

Defines the users password for access to the SAP NetWeaver ABAP server. It is not recommended to store the password in the Grunt file. It should be passed as argument. Do also not store the password as not masked value in a CI server environment. Use plugins to create masked variables (for instance the `Mask Passwords Plugin` for Jenkins).

##### `ui5`

###### `package`
Type: `String`

Defines the development package in which the BSP container for the UI5 sources is available or should be created.

###### `bspcontainer`
Type: `String`

Defines the name of the BSP container used for the storage of the UI5 sources.

###### `bspcontainer_text`
Type: `String`

Defines the description of the BSP container.

###### `transportno`
Type: `String`
Optional in case options.ui5.package is set to `$TMP`.

Defines the transport number which logs the changes. For the transport number it would also make sense to pass it via an argument.

#### `resources`

##### `cwd`
Type: `String`

Defines the base folder which contains the sources (for instance `build`). It should be avoided to use everything from the ``webapp`` folder, because some directories in it should not be packaged and uploaded into a BSP application. To create a build, use another grunt task to copy the relevant files to the ``build`` folder. In addition for instance you can use the [openui5_preload] (https://github.com/SAP/grunt-openui5#openui5_preload) task from the ``grunt-openui5`` plugin to create a component preload file.

##### `src`
Type: `String` or `array of String` 

Defines files for upload.


## Release History

[CHANGELOG.md](CHANGELOG.md)

## License

> The MIT License (MIT)
>
> Copyright © 2016 ILC GmbH, support@ilc-solutions.de
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the “Software”), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
> the Software, and to permit persons to whom the Software is furnished to do so,
> subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
