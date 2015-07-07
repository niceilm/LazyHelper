(function(window) {
  'use strict';
  var LazyHelper = window.LazyHelper || (window.LazyHelper = {});

  LazyHelper.makeBundle = makeBundle;
  LazyHelper.normalizeModules = normalizeModules;
  LazyHelper.normalizeFileUrl = normalizeFileUrl;

  /**
   * @name LazyHelper.makeBundle
   * @param {Object} config
   * @param {String} [config.templateUrl]
   * @param {(Array|Object|String)} [config.lazyModules]
   * @param {String} dummyValue
   * @param {String} [prefixFilePath=/]
   * @returns {Object}
   */
  function makeBundle(config, dummyValue, prefixFilePath) {
    if(config.lazyModules) {
      var modules = normalizeModules(config.lazyModules);

      config.resolve = config.resolve || {};
      config.resolve.$lazyLoader = ['$ocLazyLoad', function($ocLazyLoad) {
        angular.forEach(modules, function(module, key) {
          if(angular.isArray(module.files)) {
            angular.forEach(module.files, function(file, key) {
              module.files[key] = normalizeFileUrl(file, dummyValue, prefixFilePath);
            });
          }
          modules[key] = module;
        });

        return $ocLazyLoad.load(modules, {});
      }];
    }

    if(config.templateUrl) {
      config.templateUrl = normalizeFileUrl(config.templateUrl, dummyValue, prefixFilePath);
    }

    return config;
  }

  /**
   * normalize modules
   * @name LazyHelper.normalizeModules
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
   * @name LazyHelper.normalizeFileUrl
   * @param {String} filename
   * @returns {String}
   * @param {String} [dummyValue=new Date().getTime()]
   * @param {String} [prefixFilePath=/]
   */
  function normalizeFileUrl(filename, dummyValue, prefixFilePath) {
    prefixFilePath = prefixFilePath || "/";
    var urlArgs = 'v=' + (dummyValue || new Date().getTime());
    var rxFileMatch = /^\/|^http/;

    if(rxFileMatch.test(filename)) {
      return filename + "?" + urlArgs;
    }
    return prefixFilePath + filename + "?" + urlArgs;
  }
})(window);
