var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var StageGLMaterialBase = require("awayjs-stagegl/lib/materials/StageGLMaterialBase");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var TriangleMaterialBase = (function (_super) {
    __extends(TriangleMaterialBase, _super);
    function TriangleMaterialBase() {
        _super.apply(this, arguments);
    }
    TriangleMaterialBase.prototype._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shaderObject.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shaderObject.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shaderObject.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" + "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" + "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    TriangleMaterialBase.prototype._iRenderPass = function (pass, renderable, stage, camera, viewProjection) {
        _super.prototype._iRenderPass.call(this, pass, renderable, stage, camera, viewProjection);
        var shaderObject = pass.shaderObject;
        if (shaderObject.sceneMatrixIndex >= 0) {
            renderable.sourceEntity.getRenderSceneTransform(camera).copyRawDataTo(shaderObject.vertexConstantData, shaderObject.sceneMatrixIndex, true);
            viewProjection.copyRawDataTo(shaderObject.vertexConstantData, shaderObject.viewMatrixIndex, true);
        }
        else {
            var matrix3D = Matrix3DUtils.CALCULATION_MATRIX;
            matrix3D.copyFrom(renderable.sourceEntity.getRenderSceneTransform(camera));
            matrix3D.append(viewProjection);
            matrix3D.copyRawDataTo(shaderObject.vertexConstantData, shaderObject.viewMatrixIndex, true);
        }
        var context = stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 0, shaderObject.vertexConstantData, shaderObject.numUsedVertexConstants);
        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, shaderObject.fragmentConstantData, shaderObject.numUsedFragmentConstants);
        context.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
        context.drawTriangles(context.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
    };
    return TriangleMaterialBase;
})(StageGLMaterialBase);
module.exports = TriangleMaterialBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvdHJpYW5nbGVtYXRlcmlhbGJhc2UudHMiXSwibmFtZXMiOlsiVHJpYW5nbGVNYXRlcmlhbEJhc2UiLCJUcmlhbmdsZU1hdGVyaWFsQmFzZS5jb25zdHJ1Y3RvciIsIlRyaWFuZ2xlTWF0ZXJpYWxCYXNlLl9pR2V0VmVydGV4Q29kZSIsIlRyaWFuZ2xlTWF0ZXJpYWxCYXNlLl9pUmVuZGVyUGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxhQUFhLFdBQWMsb0NBQW9DLENBQUMsQ0FBQztBQUd4RSxJQUFPLG1CQUFtQixXQUFhLDZDQUE2QyxDQUFDLENBQUM7QUFPdEYsSUFBTyxvQkFBb0IsV0FBYSw4Q0FBOEMsQ0FBQyxDQUFDO0FBTXhGLElBQU8sbUJBQW1CLFdBQWEsa0RBQWtELENBQUMsQ0FBQztBQUUzRixBQUlBOzs7R0FERztJQUNHLG9CQUFvQjtJQUFTQSxVQUE3QkEsb0JBQW9CQSxVQUE0QkE7SUFBdERBLFNBQU1BLG9CQUFvQkE7UUFBU0MsOEJBQW1CQTtJQTBEdERBLENBQUNBO0lBeERPRCw4Q0FBZUEsR0FBdEJBLFVBQXVCQSxZQUE2QkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUUxSEUsSUFBSUEsSUFBSUEsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFFckJBLEFBQ0FBLGdDQURnQ0E7WUFDNUJBLFFBQVFBLEdBQXlCQSxDQUFDQSxZQUFZQSxDQUFDQSxxQkFBcUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUVBLGVBQWVBLENBQUNBLG9CQUFvQkEsR0FBR0EsZUFBZUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFFcEpBLEFBQ0FBLGtEQURrREE7WUFDOUNBLGFBQWFBLEdBQXlCQSxhQUFhQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQ2hGQSxhQUFhQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQ3RDQSxhQUFhQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQ3RD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QUFvQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsRUFBRUEsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxZQUFZQSxDQUFDQSx3QkFBd0JBLENBQUNBLENBQUNBO1FBRWpKQSxPQUFPQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQSxFQUFFQSxVQUFVQSxDQUFDQSxhQUFhQSxDQUFDQSxtQkFBbUJBLENBQUNBLGFBQWFBLENBQUNBLEVBQUVBLFVBQVVBLENBQUNBLGVBQWVBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsRUFBRUEsbUJBQW1CQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUMzTEEsT0FBT0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsVUFBVUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7SUFDdEdBLENBQUNBO0lBQ0ZILDJCQUFDQTtBQUFEQSxDQTFEQSxBQTBEQ0EsRUExRGtDLG1CQUFtQixFQTBEckQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL1RyaWFuZ2xlTWF0ZXJpYWxCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbIu+7v2ltcG9ydCBNYXRyaXhcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXhcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBNYXRyaXgzRFV0aWxzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IFRleHR1cmUyREJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL3Bvb2wvTWF0ZXJpYWxQYXNzRGF0YVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgQ29udGV4dEdMQ29tcGFyZU1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xDb21wYXJlTW9kZVwiKTtcbmltcG9ydCBDb250ZXh0R0xQcm9ncmFtVHlwZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTFByb2dyYW1UeXBlXCIpO1xuaW1wb3J0IElDb250ZXh0U3RhZ2VHTFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvSUNvbnRleHRTdGFnZUdMXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBTdGFnZUdMTWF0ZXJpYWxCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9TdGFnZUdMTWF0ZXJpYWxCYXNlXCIpO1xuXG4vKipcbiAqIENvbXBpbGVkUGFzcyBmb3JtcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciB0aGUgZGVmYXVsdCBjb21waWxlZCBwYXNzIG1hdGVyaWFscyBwcm92aWRlZCBieSBBd2F5M0QsXG4gKiB1c2luZyBtYXRlcmlhbCBtZXRob2RzIHRvIGRlZmluZSB0aGVpciBhcHBlYXJhbmNlLlxuICovXG5jbGFzcyBUcmlhbmdsZU1hdGVyaWFsQmFzZSBleHRlbmRzIFN0YWdlR0xNYXRlcmlhbEJhc2Vcbntcblx0cHVibGljIF9pR2V0VmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHQvL2dldCB0aGUgcHJvamVjdGlvbiBjb29yZGluYXRlc1xuXHRcdHZhciBwb3NpdGlvbjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSAoc2hhZGVyT2JqZWN0Lmdsb2JhbFBvc0RlcGVuZGVuY2llcyA+IDApPyBzaGFyZWRSZWdpc3RlcnMuZ2xvYmFsUG9zaXRpb25WZXJ0ZXggOiBzaGFyZWRSZWdpc3RlcnMubG9jYWxQb3NpdGlvbjtcblxuXHRcdC8vcmVzZXJ2aW5nIHZlcnRleCBjb25zdGFudHMgZm9yIHByb2plY3Rpb24gbWF0cml4XG5cdFx0dmFyIHZpZXdNYXRyaXhSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4Q29uc3RhbnQoKTtcblx0XHRyZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhDb25zdGFudCgpO1xuXHRcdHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZlcnRleENvbnN0YW50KCk7XG5cdFx0cmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4Q29uc3RhbnQoKTtcblx0XHRzaGFkZXJPYmplY3Qudmlld01hdHJpeEluZGV4ID0gdmlld01hdHJpeFJlZy5pbmRleCo0O1xuXG5cdFx0aWYgKHNoYWRlck9iamVjdC5wcm9qZWN0aW9uRGVwZW5kZW5jaWVzID4gMCkge1xuXHRcdFx0c2hhcmVkUmVnaXN0ZXJzLnByb2plY3Rpb25GcmFnbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZhcnlpbmcoKTtcblx0XHRcdHZhciB0ZW1wOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZlcnRleFZlY3RvclRlbXAoKTtcblx0XHRcdGNvZGUgKz0gXCJtNDQgXCIgKyB0ZW1wICsgXCIsIFwiICsgcG9zaXRpb24gKyBcIiwgXCIgKyB2aWV3TWF0cml4UmVnICsgXCJcXG5cIiArXG5cdFx0XHRcdFwibW92IFwiICsgc2hhcmVkUmVnaXN0ZXJzLnByb2plY3Rpb25GcmFnbWVudCArIFwiLCBcIiArIHRlbXAgKyBcIlxcblwiICtcblx0XHRcdFx0XCJtb3Ygb3AsIFwiICsgdGVtcCArIFwiXFxuXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvZGUgKz0gXCJtNDQgb3AsIFwiICsgcG9zaXRpb24gKyBcIiwgXCIgKyB2aWV3TWF0cml4UmVnICsgXCJcXG5cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVuZGVyUGFzcyhwYXNzOk1hdGVyaWFsUGFzc0RhdGEsIHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHN0YWdlOlN0YWdlLCBjYW1lcmE6Q2FtZXJhLCB2aWV3UHJvamVjdGlvbjpNYXRyaXgzRClcblx0e1xuXHRcdHN1cGVyLl9pUmVuZGVyUGFzcyhwYXNzLCByZW5kZXJhYmxlLCBzdGFnZSwgY2FtZXJhLCB2aWV3UHJvamVjdGlvbik7XG5cblx0XHR2YXIgc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UgPSBwYXNzLnNoYWRlck9iamVjdDtcblxuXHRcdGlmIChzaGFkZXJPYmplY3Quc2NlbmVNYXRyaXhJbmRleCA+PSAwKSB7XG5cdFx0XHRyZW5kZXJhYmxlLnNvdXJjZUVudGl0eS5nZXRSZW5kZXJTY2VuZVRyYW5zZm9ybShjYW1lcmEpLmNvcHlSYXdEYXRhVG8oc2hhZGVyT2JqZWN0LnZlcnRleENvbnN0YW50RGF0YSwgc2hhZGVyT2JqZWN0LnNjZW5lTWF0cml4SW5kZXgsIHRydWUpO1xuXHRcdFx0dmlld1Byb2plY3Rpb24uY29weVJhd0RhdGFUbyhzaGFkZXJPYmplY3QudmVydGV4Q29uc3RhbnREYXRhLCBzaGFkZXJPYmplY3Qudmlld01hdHJpeEluZGV4LCB0cnVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIG1hdHJpeDNEOk1hdHJpeDNEID0gTWF0cml4M0RVdGlscy5DQUxDVUxBVElPTl9NQVRSSVg7XG5cblx0XHRcdG1hdHJpeDNELmNvcHlGcm9tKHJlbmRlcmFibGUuc291cmNlRW50aXR5LmdldFJlbmRlclNjZW5lVHJhbnNmb3JtKGNhbWVyYSkpO1xuXHRcdFx0bWF0cml4M0QuYXBwZW5kKHZpZXdQcm9qZWN0aW9uKTtcblxuXHRcdFx0bWF0cml4M0QuY29weVJhd0RhdGFUbyhzaGFkZXJPYmplY3QudmVydGV4Q29uc3RhbnREYXRhLCBzaGFkZXJPYmplY3Qudmlld01hdHJpeEluZGV4LCB0cnVlKTtcblx0XHR9XG5cblx0XHR2YXIgY29udGV4dDpJQ29udGV4dFN0YWdlR0wgPSA8SUNvbnRleHRTdGFnZUdMPiBzdGFnZS5jb250ZXh0O1xuXG5cdFx0Y29udGV4dC5zZXRQcm9ncmFtQ29uc3RhbnRzRnJvbUFycmF5KENvbnRleHRHTFByb2dyYW1UeXBlLlZFUlRFWCwgMCwgc2hhZGVyT2JqZWN0LnZlcnRleENvbnN0YW50RGF0YSwgc2hhZGVyT2JqZWN0Lm51bVVzZWRWZXJ0ZXhDb25zdGFudHMpO1xuXHRcdGNvbnRleHQuc2V0UHJvZ3JhbUNvbnN0YW50c0Zyb21BcnJheShDb250ZXh0R0xQcm9ncmFtVHlwZS5GUkFHTUVOVCwgMCwgc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhLCBzaGFkZXJPYmplY3QubnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzKTtcblxuXHRcdGNvbnRleHQuYWN0aXZhdGVCdWZmZXIoMCwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhEYXRhKFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fREFUQSksIHJlbmRlcmFibGUuZ2V0VmVydGV4T2Zmc2V0KFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fREFUQSksIFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fRk9STUFUKTtcblx0XHRjb250ZXh0LmRyYXdUcmlhbmdsZXMoY29udGV4dC5nZXRJbmRleEJ1ZmZlcihyZW5kZXJhYmxlLmdldEluZGV4RGF0YSgpKSwgMCwgcmVuZGVyYWJsZS5udW1UcmlhbmdsZXMpO1xuXHR9XG59XG5cbmV4cG9ydCA9IFRyaWFuZ2xlTWF0ZXJpYWxCYXNlOyJdfQ==