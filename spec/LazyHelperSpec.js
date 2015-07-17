describe('LazyHelper', function() {
  beforeEach(function() {
  });

  describe('makeBundle', function() {
    it('단순 객체를 받은 경우', function() {
      var results = LazyHelper.makeBundle({});
      expect(results).toEqual({});
    });

    describe('normalizeModules', function() {
      it('문자열 처리', function() {
        var modules = LazyHelper.normalizeModules("test.js");
        expect(modules).toEqual([{files: ["test.js"]}]);
      });
      it('객체 처리', function() {
        var modules = LazyHelper.normalizeModules({files: "test.js"});
        expect(modules).toEqual([{files: ["test.js"]}]);
      });
      it('객체 처리내의 배열처리', function() {
        var modules = LazyHelper.normalizeModules({files: ["test.js", "test2.js"]});
        expect(modules).toEqual([{files: ["test.js", "test2.js"]}]);
      });
      it('배열 처리 - 문자열만 있는 경우', function() {
        var modules = LazyHelper.normalizeModules(["test.js", "test2.js"]);
        expect(modules).toEqual([{files: ["test.js", "test2.js"]}]);
      });
      it('배열 처리 - 문자열 객체가 함께 있는 경우', function() {
        var modules = LazyHelper.normalizeModules(["test.js", "test2.js", {files: "test3.js"}]);
        expect(modules).toEqual([{files: ["test3.js"]}, {files: ["test.js", "test2.js"]}]);
      });
      it('배열 처리 - 객체만 있는 경우', function() {
        var modules = LazyHelper.normalizeModules([{files: "test.js"}, {files: "test2.js"}]);
        expect(modules).toEqual([{files: ["test.js"]}, {files: ["test2.js"]}]);
      });
      it('배열 처리 - 다중 파일', function() {
        var modules = LazyHelper.normalizeModules([{files: ["test.js", "test2.js"]}]);
        expect(modules).toEqual([{files: ["test.js", "test2.js"]}]);
      });

      it('배열 처리 - 다중 배열', function() {
        var modules = LazyHelper.normalizeModules(["test.js", [{name: "test1.module", files: ["test2.js"]}, {name: "test2.module", files: "test3.js"}]]);
        expect(modules).toEqual([{name: "test1.module", files: ["test2.js"]}, {name: "test2.module", files: ["test3.js"]}, {files: ["test.js"]}]);
      });
    });

    describe('normalizeFileUrl', function() {
      it('파일명만 넘기는 경우', function() {
        var filename = LazyHelper.normalizeFileUrl("test.js", "dummy", "/");
        expect(filename).toEqual("/test.js?v=dummy");
      });

      it('파일 패스와 함께 파일명만 넘기는 경우', function() {
        var filename = LazyHelper.normalizeFileUrl("/test/test.js", "dummy", "/");
        expect(filename).toEqual("/test/test.js?v=dummy");
      });

      it('절대 주소인 경우 - http', function() {
        var filename = LazyHelper.normalizeFileUrl("http://test/test.js", "dummy", "/");
        expect(filename).toEqual("http://test/test.js?v=dummy");
      });

      it('절대 주소인 경우 - https', function() {
        var filename = LazyHelper.normalizeFileUrl("https://test/test.js", "dummy", "/");
        expect(filename).toEqual("https://test/test.js?v=dummy");
      });

      it('절대 주소인 경우 - //', function() {
        var filename = LazyHelper.normalizeFileUrl("//test/test.js", "dummy", "/");
        expect(filename).toEqual("//test/test.js?v=dummy");
      });

      it('이미 version값이 붙은 경우', function() {
        var filename = LazyHelper.normalizeFileUrl("test.js?v=dummy2", "dummy", "/");
        expect(filename).toEqual("/test.js?v=dummy2");
      });
    });
  });
});

