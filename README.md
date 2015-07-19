# LazyHelper
https://oclazyload.readme.io/ helper

```
angular.module('someApp', [
  'ui.router',
  'fl.lazyLoadHelper'
]).config(['$stateProvider', '$lazyLoadHelperProvider', function($stateProvider, $lazyLoadHelperProvider){
  $lazyLoadHelperProvider.setOptions({
    urlArg : __meteor_runtime_config__.autoupdateVersion
  });
  $stateProvider
    .decorator('views', function($state, parent) {
      var result = {},
        views = parent($state);

      angular.forEach(views, function(config, name) {
        var resolver = $lazyLoadHelperProvider.makeBundle(config);
        result[name] = resolver;
      });
      return result;
    })
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

# Test

## install karma
```
npm install karma -g
```

## test
```
karma start karma.conf.js
```