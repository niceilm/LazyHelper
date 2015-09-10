(function() {
  'use strict';
  angular.module('fl.lazyLoadHelper', ['oc.lazyLoad', 'ui.router']).config(config);
  angular.module('fl.lazyLoadHelper').provider('$lazyLoadHelper', function() {
    var options = {
      filePath: "/",
      urlArg: new Date().getTime()
    };

    this.setDefaultOptions = function(newOptions) {
      newOptions = newOptions || {};
      if(newOptions.filePath && !/\/$/.test(newOptions.filePath)) {
        newOptions.filePath = newOptions.filePath + "/";
      }
      options = angular.extend(options, newOptions);
    };

    this.makeBundle = makeBundle;

    this.$get = [function() {
      return {
        makeBundle: makeBundle,
        // for test don't use direct
        _normalizeModules: normalizeModules,
        _normalizeFileUrl: normalizeFileUrl
      };
    }];

    /**
     * @name makeBundle
     * @param {Object} config
     * @param {String} [config.templateUrl]
     * @param {(Array|Object|String)} [config.lazyModules]
     * @param {String} [urlArg]
     * @param {String} [filePath=/]
     * @returns {Object}
     */
    function makeBundle(config, urlArg, filePath) {
      if(config.lazyModules) {
        var modules = normalizeModules(config.lazyModules);

        config.resolve = config.resolve || {};
        config.resolve.$lazyLoader = ['$ocLazyLoad', function($ocLazyLoad) {
          angular.forEach(modules, function(module, key) {
            if(angular.isArray(module.files)) {
              angular.forEach(module.files, function(file, key) {
                module.files[key] = normalizeFileUrl(file, urlArg, filePath);
              });
            }
            modules[key] = module;
          });

          return $ocLazyLoad.load(modules, {});
        }];
      }

      if(config.templateUrl) {
        config.templateUrl = normalizeFileUrl(config.templateUrl, urlArg, filePath);
      }

      return config;
    }

    /**
     * normalize modules
     * @name normalizeModules
     * @param {(String|Object|Array)} modules
     * @param {boolean} [isParentArray=false]
     * @returns {Array}
     */
    function normalizeModules(modules, isParentArray) {
      modules = angular.copy(modules);

      if(angular.isString(modules)) {
        return [{files: [modules]}];
      } else if(angular.isArray(modules)) {
        var newModules = [];
        var modulesForString = [];

        angular.forEach(modules, function(module) {
          if(angular.isString(module)) {
            modulesForString.push(module)
          } else if(angular.isArray(module)) {
            newModules = newModules.concat(normalizeModules(module, true));
          } else if(angular.isObject(module)) {
            newModules.push(normalizeModules(module, true));
          }
        });
        if(modulesForString.length > 0) {
          newModules.push({files: modulesForString});
        }
        return newModules;
      } else if(angular.isObject(modules)) {
        var files = modules.files;
        if(!angular.isArray(files) && angular.isString(files)) {
          modules.files = [files];
        }
        if(isParentArray) {
          return modules;
        }
        return [modules];
      } else {
        throw new Error("invalid parameters");
      }
    }

    /**
     * normalize file url
     * @name normalizeFileUrl
     * @param {String} filename
     * @returns {String}
     */
    function normalizeFileUrl(filename, urlArg, filePath) {
      var urlArgs = filename.indexOf('?') === -1 ? '?v=' + (urlArg || options.urlArg) : "";
      var rxFileMatch = /^\/|^http/;
      if(rxFileMatch.test(filename)) {
        return filename + urlArgs;
      }
      return (filePath || options.filePath) + filename + urlArgs;
    }
  });

  angular.module('fl.lazyLoadHelper').filter('normalizeFileUrl', ['$lazyLoadHelper', function($lazyLoadHelper) {
    return function(value) {
      return $lazyLoadHelper._normalizeFileUrl(value);
    }
  }]);

  config.$inject = ["$stateProvider", "$lazyLoadHelperProvider"];

  function config($stateProvider, $lazyLoadHelperProvider) {
    $stateProvider.decorator('views', function($state, parent) {
      console.log("decorator : views", arguments);
      var result = {},
        views = parent($state);

      angular.forEach(views, function(config, name) {
        result[name] = $lazyLoadHelperProvider.makeBundle(config);
      });
      return result;
    });
  }
})();