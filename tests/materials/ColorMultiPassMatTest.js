var View = require("awayjs-core/lib/containers/View");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var PointLight = require("awayjs-core/lib/entities/PointLight");
var StaticLightPicker = require("awayjs-core/lib/materials/lightpickers/StaticLightPicker");
var PrimitiveTorusPrefab = require("awayjs-core/lib/prefabs/PrimitiveTorusPrefab");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var DefaultRenderer = require("awayjs-stagegl/lib/core/render/DefaultRenderer");
var TriangleMethodMaterial = require("awayjs-stagegl/lib/materials/TriangleMethodMaterial");
var ColorMultiPassMatTest = (function () {
    function ColorMultiPassMatTest() {
        var _this = this;
        this.counter = 0;
        this.center = new Vector3D();
        Debug.THROW_ERRORS = false;
        Debug.LOG_PI_ERRORS = false;
        this.light = new PointLight();
        this.view = new View(new DefaultRenderer());
        this.view.camera.z = -1000;
        this.view.backgroundColor = 0x000000;
        this.torus = new PrimitiveTorusPrefab(50, 10, 32, 32, false);
        var l = 20;
        var radius = 500;
        var mat = new TriangleMethodMaterial(0xff0000);
        mat.lightPicker = new StaticLightPicker([this.light]);
        this.torus.material = mat;
        for (var c = 0; c < l; c++) {
            var t = Math.PI * 2 * c / l;
            var m = this.torus.getNewObject();
            m.x = Math.cos(t) * radius;
            m.y = 0;
            m.z = Math.sin(t) * radius;
            this.view.scene.addChild(m);
        }
        this.view.scene.addChild(this.light);
        this.view.y = this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
        console.log("renderer ", this.view.renderer);
        console.log("scene ", this.view.scene);
        console.log("view ", this.view);
        this.view.render();
        window.onresize = function (event) { return _this.onResize(event); };
        this.raf = new RequestAnimationFrame(this.tick, this);
        this.raf.start();
    }
    ColorMultiPassMatTest.prototype.tick = function (dt) {
        this.counter += 0.005;
        this.view.camera.lookAt(this.center);
        this.view.camera.x = Math.cos(this.counter) * 800;
        this.view.camera.z = Math.sin(this.counter) * 800;
        this.view.render();
    };
    ColorMultiPassMatTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return ColorMultiPassMatTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9jb2xvcm11bHRpcGFzc21hdHRlc3QudHMiXSwibmFtZXMiOlsiQ29sb3JNdWx0aVBhc3NNYXRUZXN0IiwiQ29sb3JNdWx0aVBhc3NNYXRUZXN0LmNvbnN0cnVjdG9yIiwiQ29sb3JNdWx0aVBhc3NNYXRUZXN0LnRpY2siLCJDb2xvck11bHRpUGFzc01hdFRlc3Qub25SZXNpemUiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sSUFBSSxXQUFpQixpQ0FBaUMsQ0FBQyxDQUFDO0FBQy9ELElBQU8sUUFBUSxXQUFnQixvQ0FBb0MsQ0FBQyxDQUFDO0FBSXJFLElBQU8sVUFBVSxXQUFlLHFDQUFxQyxDQUFDLENBQUM7QUFFdkUsSUFBTyxpQkFBaUIsV0FBYSwwREFBMEQsQ0FBQyxDQUFDO0FBQ2pHLElBQU8sb0JBQW9CLFdBQWEsOENBQThDLENBQUMsQ0FBQztBQUN4RixJQUFPLHFCQUFxQixXQUFZLDZDQUE2QyxDQUFDLENBQUM7QUFDdkYsSUFBTyxLQUFLLFdBQWdCLDZCQUE2QixDQUFDLENBQUM7QUFFM0QsSUFBTyxlQUFlLFdBQWMsZ0RBQWdELENBQUMsQ0FBQztBQUN0RixJQUFPLHNCQUFzQixXQUFZLHFEQUFxRCxDQUFDLENBQUM7QUFFaEcsSUFBTSxxQkFBcUI7SUFTMUJBLFNBVEtBLHFCQUFxQkE7UUFBM0JDLGlCQTRFQ0E7UUF0RVFBLFlBQU9BLEdBQVVBLENBQUNBLENBQUNBO1FBQ25CQSxXQUFNQSxHQUFZQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUl4Q0EsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDM0JBLEtBQUtBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO1FBRTVCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxVQUFVQSxFQUFFQSxDQUFDQTtRQUM5QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsZUFBZUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBO1FBQzNCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsb0JBQW9CQSxDQUFDQSxFQUFFQSxFQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFHQSxFQUFFQSxFQUFHQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUVoRUEsSUFBSUEsQ0FBQ0EsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFDbEJBLElBQUlBLE1BQU1BLEdBQVVBLEdBQUdBLENBQUNBO1FBRXhCQSxJQUFJQSxHQUFHQSxHQUEwQkEsSUFBSUEsc0JBQXNCQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUV0RUEsR0FBR0EsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsaUJBQWlCQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUV0REEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFFMUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUdBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3BDQSxJQUFJQSxDQUFDQSxHQUFVQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxDQUFDQTtZQUM3QkEsSUFBSUEsQ0FBQ0EsR0FBZUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7WUFFOUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUNBLE1BQU1BLENBQUNBO1lBQ3pCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNSQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxNQUFNQSxDQUFDQTtZQUV6QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDN0JBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBRXJDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUM5QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDcENBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO1FBRXRDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxXQUFXQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUM3Q0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDdkNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBRWhDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUVuQkEsTUFBTUEsQ0FBQ0EsUUFBUUEsR0FBR0EsVUFBQ0EsS0FBYUEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBcEJBLENBQW9CQSxDQUFDQTtRQUUxREEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEscUJBQXFCQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUN0REEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBR09ELG9DQUFJQSxHQUFaQSxVQUFhQSxFQUFTQTtRQUVyQkUsSUFBSUEsQ0FBQ0EsT0FBT0EsSUFBSUEsS0FBS0EsQ0FBQ0E7UUFDdEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3JDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFDQSxHQUFHQSxDQUFDQTtRQUNoREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7UUFFaERBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO0lBQ3BCQSxDQUFDQTtJQUVNRix3Q0FBUUEsR0FBZkEsVUFBZ0JBLEtBQW9CQTtRQUFwQkcscUJBQW9CQSxHQUFwQkEsWUFBb0JBO1FBRW5DQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNoQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDaEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO1FBQ3BDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUFDRkgsNEJBQUNBO0FBQURBLENBNUVBLEFBNEVDQSxJQUFBIiwiZmlsZSI6Im1hdGVyaWFscy9Db2xvck11bHRpUGFzc01hdFRlc3QuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtc3RhZ2VnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlld1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvbnRhaW5lcnMvVmlld1wiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgVVJMTG9hZGVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL25ldC9VUkxMb2FkZXJcIik7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBQb2ludExpZ2h0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lbnRpdGllcy9Qb2ludExpZ2h0XCIpO1xuaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcbmltcG9ydCBTdGF0aWNMaWdodFBpY2tlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL1N0YXRpY0xpZ2h0UGlja2VyXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVRvcnVzUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3ByZWZhYnMvUHJpbWl0aXZlVG9ydXNQcmVmYWJcIik7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIik7XG5pbXBvcnQgRGVidWdcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvRGVidWdcIik7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3JlbmRlci9EZWZhdWx0UmVuZGVyZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL1RyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5cbmNsYXNzIENvbG9yTXVsdGlQYXNzTWF0VGVzdFxue1xuXHRwcml2YXRlIHZpZXc6Vmlldztcblx0cHJpdmF0ZSB0b3J1czpQcmltaXRpdmVUb3J1c1ByZWZhYjtcblx0cHJpdmF0ZSBsaWdodDpQb2ludExpZ2h0O1xuXHRwcml2YXRlIHJhZjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgY291bnRlcjpudW1iZXIgPSAwO1xuXHRwcml2YXRlIGNlbnRlcjpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCgpO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdERlYnVnLlRIUk9XX0VSUk9SUyA9IGZhbHNlO1xuXHRcdERlYnVnLkxPR19QSV9FUlJPUlMgPSBmYWxzZTtcblxuXHRcdHRoaXMubGlnaHQgPSBuZXcgUG9pbnRMaWdodCgpO1xuXHRcdHRoaXMudmlldyA9IG5ldyBWaWV3KG5ldyBEZWZhdWx0UmVuZGVyZXIoKSk7XG5cdFx0dGhpcy52aWV3LmNhbWVyYS56ID0gLTEwMDA7XG5cdFx0dGhpcy52aWV3LmJhY2tncm91bmRDb2xvciA9IDB4MDAwMDAwO1xuXHRcdHRoaXMudG9ydXMgPSBuZXcgUHJpbWl0aXZlVG9ydXNQcmVmYWIoNTAgLCAxMCwgMzIgLCAzMiAsIGZhbHNlKTtcblxuXHRcdHZhciBsOm51bWJlciA9IDIwO1xuXHRcdHZhciByYWRpdXM6bnVtYmVyID0gNTAwO1xuXG5cdFx0dmFyIG1hdDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoMHhmZjAwMDApO1xuXG5cdFx0bWF0LmxpZ2h0UGlja2VyID0gbmV3IFN0YXRpY0xpZ2h0UGlja2VyKFt0aGlzLmxpZ2h0XSk7XG5cblx0XHR0aGlzLnRvcnVzLm1hdGVyaWFsID0gbWF0O1xuXG5cdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgbCA7IGMrKykge1xuXHRcdFx0dmFyIHQ6bnVtYmVyID0gTWF0aC5QSSoyKmMvbDtcblx0XHRcdHZhciBtOk1lc2ggPSA8TWVzaD4gdGhpcy50b3J1cy5nZXROZXdPYmplY3QoKTtcblxuXHRcdFx0bS54ID0gTWF0aC5jb3ModCkqcmFkaXVzO1xuXHRcdFx0bS55ID0gMDtcblx0XHRcdG0ueiA9IE1hdGguc2luKHQpKnJhZGl1cztcblxuXHRcdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKG0pO1xuXHRcdH1cblxuXHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLmxpZ2h0KTtcblxuXHRcdHRoaXMudmlldy55ID0gdGhpcy52aWV3LnggPSAwO1xuXHRcdHRoaXMudmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMudmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHRjb25zb2xlLmxvZyhcInJlbmRlcmVyIFwiLCB0aGlzLnZpZXcucmVuZGVyZXIpO1xuXHRcdGNvbnNvbGUubG9nKFwic2NlbmUgXCIsIHRoaXMudmlldy5zY2VuZSk7XG5cdFx0Y29uc29sZS5sb2coXCJ2aWV3IFwiLCB0aGlzLnZpZXcpO1xuXG5cdFx0dGhpcy52aWV3LnJlbmRlcigpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5yYWYgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljaywgdGhpcyk7XG5cdFx0dGhpcy5yYWYuc3RhcnQoKTtcblx0fVxuXG5cblx0cHJpdmF0ZSB0aWNrKGR0Om51bWJlcilcblx0e1xuXHRcdHRoaXMuY291bnRlciArPSAwLjAwNTtcblx0XHR0aGlzLnZpZXcuY2FtZXJhLmxvb2tBdCh0aGlzLmNlbnRlcik7XG5cdFx0dGhpcy52aWV3LmNhbWVyYS54ID0gTWF0aC5jb3ModGhpcy5jb3VudGVyKSo4MDA7XG5cdFx0dGhpcy52aWV3LmNhbWVyYS56ID0gTWF0aC5zaW4odGhpcy5jb3VudGVyKSo4MDA7XG5cblx0XHR0aGlzLnZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgb25SZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpXG5cdHtcblx0XHR0aGlzLnZpZXcueSA9IDA7XG5cdFx0dGhpcy52aWV3LnggPSAwO1xuXHRcdHRoaXMudmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMudmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cbn0iXX0=