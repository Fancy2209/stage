var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MaterialPassBase = require("awayjs-stagegl/lib/materials/passes/MaterialPassBase");
/**
 * LineBasicPass is a material pass that draws wireframe segments.
 */
var LineBasicPass = (function (_super) {
    __extends(LineBasicPass, _super);
    /**
     * Creates a new SegmentPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function LineBasicPass() {
        _super.call(this);
    }
    /**
     * @inheritDoc
     */
    LineBasicPass.prototype._iGetFragmentCode = function (shaderObject, regCache, sharedReg) {
        var targetReg = sharedReg.shadedTarget;
        return "mov " + targetReg + ", v0\n";
    };
    return LineBasicPass;
})(MaterialPassBase);
module.exports = LineBasicPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvcGFzc2VzL2xpbmViYXNpY3Bhc3MudHMiXSwibmFtZXMiOlsiTGluZUJhc2ljUGFzcyIsIkxpbmVCYXNpY1Bhc3MuY29uc3RydWN0b3IiLCJMaW5lQmFzaWNQYXNzLl9pR2V0RnJhZ21lbnRDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSxJQUFPLGdCQUFnQixXQUFjLHNEQUFzRCxDQUFDLENBQUM7QUFFN0YsQUFHQTs7R0FERztJQUNHLGFBQWE7SUFBU0EsVUFBdEJBLGFBQWFBLFVBQXlCQTtJQUUzQ0E7Ozs7T0FJR0E7SUFDSEEsU0FQS0EsYUFBYUE7UUFTakJDLGlCQUFPQSxDQUFDQTtJQUNUQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSUEseUNBQWlCQSxHQUF4QkEsVUFBeUJBLFlBQTZCQSxFQUFFQSxRQUE0QkEsRUFBRUEsU0FBNEJBO1FBRWpIRSxJQUFJQSxTQUFTQSxHQUF5QkEsU0FBU0EsQ0FBQ0EsWUFBWUEsQ0FBQ0E7UUFFN0RBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLFFBQVFBLENBQUNBO0lBQ3RDQSxDQUFDQTtJQUNGRixvQkFBQ0E7QUFBREEsQ0FyQkEsQUFxQkNBLEVBckIyQixnQkFBZ0IsRUFxQjNDO0FBRUQsQUFBdUIsaUJBQWQsYUFBYSxDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9wYXNzZXMvTGluZUJhc2ljUGFzcy5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyLvu79pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsUGFzc0Jhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvcGFzc2VzL01hdGVyaWFsUGFzc0Jhc2VcIik7XG5cbi8qKlxuICogTGluZUJhc2ljUGFzcyBpcyBhIG1hdGVyaWFsIHBhc3MgdGhhdCBkcmF3cyB3aXJlZnJhbWUgc2VnbWVudHMuXG4gKi9cbmNsYXNzIExpbmVCYXNpY1Bhc3MgZXh0ZW5kcyBNYXRlcmlhbFBhc3NCYXNlXG57XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IFNlZ21lbnRQYXNzIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIG1hdGVyaWFsIFRoZSBtYXRlcmlhbCB0byB3aGljaCB0aGlzIHBhc3MgYmVsb25ncy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHNoYXJlZFJlZy5zaGFkZWRUYXJnZXQ7XG5cblx0XHRyZXR1cm4gXCJtb3YgXCIgKyB0YXJnZXRSZWcgKyBcIiwgdjBcXG5cIjtcblx0fVxufVxuXG5leHBvcnQgPSBMaW5lQmFzaWNQYXNzOyJdfQ==