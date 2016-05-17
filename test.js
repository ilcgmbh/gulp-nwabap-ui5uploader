'use strict';

var //assert      = require('assert'),
    expect      = require('chai').expect,
//    gutil = require('gulp-util'),
//    PassThrough = require('stream').PassThrough,
    ui5uploader = require('./index');


describe('gulp-nwabap-ui5uploader', function () {
    it('should work', function () {
//        assert.equal(1, 1);
//        assert.equal(1, 0);
//        expect(0).to.equal(1);
        expect(1).to.equal(1);
    });
    it('should fail', function () {
//        assert.equal(1, 1); 
//        assert.equal(1, 0);
        expect(0).to.equal(1);
//        expect(1).to.equal(1);
    });
});
