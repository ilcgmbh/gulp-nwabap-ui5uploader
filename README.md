# gulp-nwabap-ui5uploader [![npm](https://img.shields.io/npm/v/gulp-nwabap-ui5uploader.svg)](https://www.npmjs.com/package/gulp-nwabap-ui5uploader)

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
        root: 'build/webapp',
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
    }));
});
```


### Upload to a transport tracked package

```js
var gulp = require('gulp');
var ui5uploader = require('gulp-nwabap-ui5uploader');

gulp.task('deploy', function() {
  return gulp.src('build/**')
    .pipe(ui5uploader({
        root: 'build/webapp',
        conn: {
            server: 'http://myserver:8000'
        },
        auth: {
            user: 'username',
            pwd: 'password'
        },
        ui5: {
            package: 'ZZ_UI5_REPO',
            bspcontainer: 'ZZ_UI5_TRACKED',
            bspcontainer_text: 'UI5 upload',
            transportno: 'DEVK900000'
        },
    }));
});
```

## API

### `ui5uploader(options)`

#### `options`

##### `root`
Type: `String`

Defines the (relative) root of the UI5 web app. This relative path will be stripped in deployment.

##### `conn`

###### `server`
Type: `String`

Defines SAP NetWeaver ABAP server (for instance `http://myserver:8000`).

#### `client`
Type: `String`

Optional parameter to specify the client (transferred as sap-client URL parameter). In case the option is not specified the default client is used if specified.

###### `useStrictSSL`
Type: `Boolean`
Default: `true`

SSL mode handling. In case of self signed certificates the useStrictSSL mode option can be set to false to allow an upload of files.


##### `auth`

###### `user`
Type: `String`

Defines the user which is used for access to the SAP NetWeaver ABAP server. It is not recommended to store the user in the Gulp file. It should be passed as argument.

###### `pwd`
Type: `String`

Defines the users password for access to the SAP NetWeaver ABAP server. It is not recommended to store the password in the Gulp file. It should be passed as argument. Do also not store the password as not masked value in a CI server environment. Use plugins to create masked variables (for instance the `Mask Passwords Plugin` for Jenkins).

##### `ui5`

###### `package`
Type: `String`

Defines the development package in which the BSP container for the UI5 sources is available or should be created.

###### `bspcontainer`
Type: `String`

Defines the name of the BSP container used for the storage of the UI5 sources. Length is restricted to 15 characters (exclusive customer specific namespaces, e.g. /YYY/).

###### `bspcontainer_text`
Type: `String`

Defines the description of the BSP container.

###### `transportno`
Type: `String`
Optional in case options.ui5.package is set to `$TMP`.

Defines the transport number which logs the changes. For the transport number it would also make sense to pass it via an argument.

###### `language`
Type: `String`
Default: `EN`

Defines the objects original language.

#### `calc_appindex`
Type: `Boolean`
Default: `false`

Specify if you require the application index (program /UI5/APP_INDEX_CALCULATE) for the application to be recalculated after the BSP application is uploaded.
Note: This only works with team repository provider version 1.30.x or higher and User Interface Add-On 2.0 for SAP NetWeaver.

## Release History

[CHANGELOG.md](CHANGELOG.md)

## License

> The MIT License (MIT)
>
> Copyright © 2016 ILC GmbH, opensource@ilc-solutions.de
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

Parts of this work (filestore.js, filestoreutils.js) are derived from
[grunt-nwabap-ui5uploader](https://github.com/pfefferf/grunt-nwabap-ui5uploader).
These parts are originally licensed under the Apache-2.0 license by Florian Pfeffer.
