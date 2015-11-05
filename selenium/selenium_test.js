'use strict';
var config = require('./saucelabs.config');
var assert = require('assert');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var async = require('async');

var isSauceLabsTest = false;
var sauceLabsCaps = config.saucelabs.browserCaps;

var isJenkinsTest = process.env.JENKINS_TESTING || false; // eslint-disable-line

var SAUCE_URL = 'http://ondemand.saucelabs.com:80/wd/hub';
var DBC_URLS = ['http://uxwin81-01:4444/wd/hub', 'http://uxwin10-01:5432/wd/hub'];
var BASE_URL = isSauceLabsTest ? 'https://pg.demo.dbc.dk' : process.env.SELENIUM_URL || 'http://localhost:8080'; // eslint-disable-line


function runAllTests(driverCaps) {
  test.describe('Express endpoint', function () {
    test.it('/profile/login can be reached', function () {
      var endpoint = '/profile/login';
      var driver = driverCaps.build();
      driver.get(BASE_URL + endpoint);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'body'})), 12000);
      var body = driver.findElement({tagName: 'body'});
      var header = body.findElement({id: 'header'});

      header.getId()
        .then(function (id) {
          assert.notEqual(typeof id, 'undefined');
        });

      driver.quit();
    });

    test.it('/profile/signup can be reached', function () {
      var endpoint = '/profile/signup';
      var driver = driverCaps.build();
      driver.get(BASE_URL + endpoint);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'body'})), 12000);
      var body = driver.findElement({tagName: 'body'});
      var header = body.findElement({id: 'header'});

      header.getId()
        .then(function (id) {
          assert.notEqual(typeof id, 'undefined');
        });

      driver.quit();
    });
  });

  test.describe('Login page', function () {
    test.it('is rendered', function () {
      var endpoint = '/profile/login';
      var driver = driverCaps.build();
      driver.get(BASE_URL + endpoint);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'input', name: 'username'})), 5000);
      var emailInput = driver.findElement({tagName: 'input', name: 'username'});
      emailInput.sendKeys('rasmussen.matias@gmail.com');
      driver.quit();
    });
  });


  test.describe('Signup page', function () {
    test.it('is rendered', function () {
      var endpoint = '/profile/signup';
      var driver = driverCaps.build();
      driver.get(BASE_URL + endpoint);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'input', name: 'username'})), 5000);
      driver.quit();
    });
  });

  test.describe('Library Suggest - Autocomplete', function () {
    test.it('returns suggestions', function () {
      var driver = driverCaps.build();

      driver.get(BASE_URL + '/library/suggest');

      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'input'})), 5000);

      var searchField = driver.findElement({tagName: 'input'});

      searchField.sendKeys('køb');

      driver.wait(webdriver.until.elementLocated(webdriver.By.className('autocomplete--row-text')), 5000);

      var acRow = driver.findElement(webdriver.By.className('autocomplete--row-text'));

      acRow.getInnerHtml().then(function(html) {
        assert.notEqual(typeof html, 'undefined');
      });

      acRow.click();

      driver.quit();
    });
  });

  test.describe('Library', function () {
    test.it('SSR rendering of library', function () {
      var driver = driverCaps.build();
      var libraryId = '710100';
      var branchName = 'Hovedbiblioteket, Krystalgade';

      // ssrTimeout url param sets how many milliseconds to wait for data
      // Test times out before the ssrTimeout to ensure whats sent is rendered server side
      // If this test functions it SSR must work
      driver.get(BASE_URL + '/library?id=' + libraryId + '&ssrTimeout=900000');
      driver.wait(webdriver.until.elementLocated(webdriver.By.className('library--branch-name')), 5000);

      var libraryTitle = driver.findElement(webdriver.By.className('library--branch-name'));
      libraryTitle.getInnerHtml().then(function (html) {
        assert.equal(html, branchName);
      });

      driver.quit();
    });
  });
}


if (isSauceLabsTest) {
  for (var k in sauceLabsCaps) {
    if (sauceLabsCaps.hasOwnProperty(k)) {
      var caps = sauceLabsCaps[k];
      caps.username = config.saucelabs.username;
      caps.accessKey = config.saucelabs.accessKey;
      var sauceDriverCaps = new webdriver.Builder().
        usingServer(SAUCE_URL).
        withCapabilities(caps);

      runAllTests(sauceDriverCaps);
    }
  }
}
else {
  console.log('Testing on chrome!'); // eslint-disable-line

  var chromeCaps = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome());

  runAllTests(chromeCaps);

  if (isJenkinsTest) {
    async.parallel([
      function() {
        console.log('Testing on IE, win 8.1!'); // eslint-disable-line

        var driver = new webdriver.Builder()
          .forBrowser('internet explorer')
          .usingServer(DBC_URLS[0]);

        runAllTests(driver);
      },
      function() {
        console.log('Testing on IE, win 10!'); // eslint-disable-line

        var driver = new webdriver.Builder()
          .forBrowser('internet explorer')
          .usingServer(DBC_URLS[1]);

        runAllTests(driver);
      }
    ], function() {
      console.log('Done running remote tests!'); // eslint-disable-line
    });
  }
}