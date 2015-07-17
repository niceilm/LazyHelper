# LazyHelper
https://oclazyload.readme.io/ helper

```
  $stateProvider
    .decorator('views', function($state, parent) {
      var result = {},
        views = parent($state);

      angular.forEach(views, function(config, name) {
        var resolver = LazyHelper.makeBundle(config, __meteor_runtime_config__.autoupdateVersion);
        resolver.resolve.waitForUser = ['$meteor', function($meteor) {
          return $meteor.waitForUser();
        }];
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