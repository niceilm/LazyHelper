# LazyHelper
https://oclazyload.readme.io/ helper

## with ui-router
```
angular.module('someApp', [
  'ui.router',
  'fl.lazyLoadHelper'
]).config(['$stateProvider', '$lazyLoadHelperProvider', function($stateProvider, $lazyLoadHelperProvider){
  $lazyLoadHelperProvider.setOptions({
    urlArg : new Date().getTime()
  });
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'views/home.tpl',
      controller: 'HomeController',
      lazyModules: ['controllers/HomeController.js', modules.carousel]
    })

    .state('login', {
      url: '/login',
      templateUrl: 'views/login.tpl',
      controller: 'LoginController',
      lazyModules: 'controllers/LoginController.js'
    })
}]);
```

## with filter
```
    <md-dialog-content layout="column">
      <ng-include src="'views/form.tpl'|normalizeFileUrl"></ng-include>
    </md-dialog-content>

```
# Test

## install karma
```
npm install -g karma-cli karma-jasmine karma-chrome-launcher
bower install
```

## test
```
karma start karma.conf.js
```