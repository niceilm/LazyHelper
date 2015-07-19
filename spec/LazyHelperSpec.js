describe('fl.lazyLoadHelper', function() {
  describe('basic api test', function() {
    var $lazyLoadHelper = {};
    beforeEach(module('fl.lazyLoadHelper'));
    beforeEach(inject(function(_$lazyLoadHelper_) {
      $lazyLoadHelper = _$lazyLoadHelper_;
    }));

    describe('makeBundle', function() {
      it('no lazyModules', function() {
        var results = $lazyLoadHelper.makeBundle({controller: 'SomeController'});
        expect(results.resolve).toBeUndefined();
      });
      it('has lazyModules', function() {
        var results = $lazyLoadHelper.makeBundle({lazyModules: 'someFile.js'});
        expect(results.resolve.$lazyLoader).toBeDefined();
      });
    });

    describe('normalizeModules', function() {
      it('문자열 처리', function() {
        var modules = $lazyLoadHelper._normalizeModules("test.js");
        expect(modules).toEqual([{files: ["test.js"]}]);
      });
      it('객체 처리', function() {
        var modules = $lazyLoadHelper._normalizeModules({files: "test.js"});
        expect(modules).toEqual([{files: ["test.js"]}]);
      });
      it('객체 처리내의 배열처리', function() {
        var modules = $lazyLoadHelper._normalizeModules({files: ["test.js", "test2.js"]});
        expect(modules).toEqual([{files: ["test.js", "test2.js"]}]);
      });
      it('배열 처리 - 문자열만 있는 경우', function() {
        var modules = $lazyLoadHelper._normalizeModules(["test.js", "test2.js"]);
        expect(modules).toEqual([{files: ["test.js", "test2.js"]}]);
      });
      it('배열 처리 - 문자열 객체가 함께 있는 경우', function() {
        var modules = $lazyLoadHelper._normalizeModules(["test.js", "test2.js", {files: "test3.js"}]);
        expect(modules).toEqual([{files: ["test3.js"]}, {files: ["test.js", "test2.js"]}]);
      });
      it('배열 처리 - 객체만 있는 경우', function() {
        var modules = $lazyLoadHelper._normalizeModules([{files: "test.js"}, {files: "test2.js"}]);
        expect(modules).toEqual([{files: ["test.js"]}, {files: ["test2.js"]}]);
      });
      it('배열 처리 - 다중 파일', function() {
        var modules = $lazyLoadHelper._normalizeModules([{files: ["test.js", "test2.js"]}]);
        expect(modules).toEqual([{files: ["test.js", "test2.js"]}]);
      });

      it('배열 처리 - 다중 배열', function() {
        var modules = $lazyLoadHelper._normalizeModules(["test.js", [{name: "test1.module", files: ["test2.js"]}, {name: "test2.module", files: "test3.js"}]]);
        expect(modules).toEqual([{name: "test1.module", files: ["test2.js"]}, {name: "test2.module", files: ["test3.js"]}, {files: ["test.js"]}]);
      });
    });

    describe('normalizeFileUrl', function() {
      it('파일명만 넘기는 경우', function() {
        var filename = $lazyLoadHelper._normalizeFileUrl("test.js", "dummy", "/");
        expect(filename).toEqual("/test.js?v=dummy");
      });

      it('파일 패스와 함께 파일명만 넘기는 경우', function() {
        var filename = $lazyLoadHelper._normalizeFileUrl("/test/test.js", "dummy", "/");
        expect(filename).toEqual("/test/test.js?v=dummy");
      });

      it('절대 주소인 경우 - http', function() {
        var filename = $lazyLoadHelper._normalizeFileUrl("http://test/test.js", "dummy", "/");
        expect(filename).toEqual("http://test/test.js?v=dummy");
      });

      it('절대 주소인 경우 - https', function() {
        var filename = $lazyLoadHelper._normalizeFileUrl("https://test/test.js", "dummy", "/");
        expect(filename).toEqual("https://test/test.js?v=dummy");
      });

      it('절대 주소인 경우 - //', function() {
        var filename = $lazyLoadHelper._normalizeFileUrl("//test/test.js", "dummy", "/");
        expect(filename).toEqual("//test/test.js?v=dummy");
      });

      it('이미 version값이 붙은 경우', function() {
        var filename = $lazyLoadHelper._normalizeFileUrl("test.js?v=dummy2", "dummy", "/");
        expect(filename).toEqual("/test.js?v=dummy2");
      });
    });
  });

  describe('apply setDefaultOptions', function() {
    var $lazyLoadHelper = {};
    var lazyLoadHelperProvider;
    beforeEach(module('fl.lazyLoadHelper', function($lazyLoadHelperProvider) {
      lazyLoadHelperProvider = $lazyLoadHelperProvider;
      $lazyLoadHelperProvider.setDefaultOptions({
        filePath: "/prefixFilePath/",
        urlArg: 'dummy2'
      });
    }));

    beforeEach(inject(function(_$lazyLoadHelper_) {
      $lazyLoadHelper = _$lazyLoadHelper_;
    }));

    describe('makeBundle', function() {
      it('no lazyModules', function() {
        var results = lazyLoadHelperProvider.makeBundle({controller: 'SomeController'});
        expect(results.resolve).toBeUndefined();
      });
      it('has lazyModules', function() {
        var results = lazyLoadHelperProvider.makeBundle({lazyModules: 'someFile.js'});
        expect(results.resolve.$lazyLoader).toBeDefined();
      });
    });

    describe('normalizeFileUrl', function() {
      it('파라미터로 강제한 경우', function() {
        var filename = $lazyLoadHelper._normalizeFileUrl("test.js", "dummy", "/");
        expect(filename).toEqual("/test.js?v=dummy");
      });
      it('기본옵션을 사용한 경우', function() {
        var filename = $lazyLoadHelper._normalizeFileUrl("test.js");
        expect(filename).toEqual("/prefixFilePath/test.js?v=dummy2");
      });
    });
  });

  describe('filePath가 / 로 끝나지 않는 경우 확인', function() {
    var $lazyLoadHelper = {};
    beforeEach(module('fl.lazyLoadHelper', function($lazyLoadHelperProvider) {
      $lazyLoadHelperProvider.setDefaultOptions({filePath: "/prefixFilePath", urlArg: 'dummy2'});
    }));
    beforeEach(inject(function(_$lazyLoadHelper_) {
      $lazyLoadHelper = _$lazyLoadHelper_;
    }));

    it('파라미터로 강제한 경우', function() {
      var filename = $lazyLoadHelper._normalizeFileUrl("test.js", "dummy", "/");
      expect(filename).toEqual("/test.js?v=dummy");
    });
    it('옵션을 사용한 경우', function() {
      var filename = $lazyLoadHelper._normalizeFileUrl("test.js");
      expect(filename).toEqual("/prefixFilePath/test.js?v=dummy2");
    });
  });
});