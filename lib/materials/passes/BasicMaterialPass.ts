import {AssetEvent, Matrix3D, ProjectionBase} from "@awayjs/core";

import {IMaterial} from "@awayjs/graphics";

import {GL_RenderableBase} from "../../renderables/GL_RenderableBase";
import {ShaderBase} from "../../shaders/ShaderBase";
import {ShaderRegisterCache} from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterData} from "../../shaders/ShaderRegisterData";
import {ShaderRegisterElement} from "../../shaders/ShaderRegisterElement";
import {IElementsClassGL} from "../../elements/IElementsClassGL";
import {GL_TextureBase} from "../../textures/GL_TextureBase";
import {Stage} from "../../Stage";

import {GL_MaterialBase} from "../GL_MaterialBase";
import {MaterialPool} from "../MaterialPool";

import {PassBase} from "./PassBase";

/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class BasicMaterialPass extends PassBase
{
	private _textureVO:GL_TextureBase;
	private _diffuseR:number = 1;
	private _diffuseG:number = 1;
	private _diffuseB:number = 1;
	private _diffuseA:number = 1;

	private _fragmentConstantsIndex:number;

	constructor(render:GL_MaterialBase, material:IMaterial, materialPool:MaterialPool)
	{
		super(render, material, materialPool);

		this._shader = new ShaderBase(materialPool.elementsClass, this, this._stage);

		this.invalidate();
	}

	public _iIncludeDependencies(shader:ShaderBase):void
	{
		super._iIncludeDependencies(shader);

		if (this._textureVO != null)
			shader.uvDependencies++;
    }

	public invalidate():void
	{
		super.invalidate();

		this._textureVO = this._material.getTextureAt(0)? <GL_TextureBase> this._shader.getAbstraction(this._material.getTextureAt(0)) : null;
	}

	public dispose():void
	{
		if (this._textureVO) {
			this._textureVO.onClear(new AssetEvent(AssetEvent.CLEAR, this._material.getTextureAt(0)));
			this._textureVO = null;
		}

		super.dispose();
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";

        var alphaReg:ShaderRegisterElement;

        if (this.preserveAlpha) {
            alphaReg = regCache.getFreeFragmentSingleTemp();
            regCache.addFragmentTempUsages(alphaReg, 1);
            code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
        }

		var targetReg:ShaderRegisterElement = sharedReg.shadedTarget;

		if (this._textureVO != null) {

			code += this._textureVO._iGetFragmentCode(targetReg, regCache, sharedReg, sharedReg.uvVarying);

			if (shader.alphaThreshold > 0) {
				var cutOffReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
				this._fragmentConstantsIndex = cutOffReg.index*4;

				code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
			}
		} else if (shader.colorBufferIndex != -1) {

			code += "mov " + targetReg + ", " + sharedReg.colorVarying + "\n";
		} else {
			var diffuseInputReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();

			this._fragmentConstantsIndex = diffuseInputReg.index*4;

			code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
		}

        if (this.preserveAlpha) {
            code += "mul " + sharedReg.shadedTarget + ".w, " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
            regCache.removeFragmentTempUsage(alphaReg);
        }

		return code;
	}

	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderable, projection);

		if (this._textureVO != null)
			this._textureVO._setRenderState(renderable);
	}
	/**
	 * @inheritDoc
	 */
	public _iActivate(projection:ProjectionBase):void
	{
		super._iActivate(projection);

		if (this._textureVO != null) {
			this._textureVO.activate(this._render);

			if (this._shader.alphaThreshold > 0)
				this._shader.fragmentConstantData[this._fragmentConstantsIndex] = this._shader.alphaThreshold;
		} else if (this._shader.colorBufferIndex == -1) {
			var index:number = this._fragmentConstantsIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			data[index] = this._diffuseR;
			data[index + 1] = this._diffuseG;
			data[index + 2] = this._diffuseB;
			data[index + 3] = this._diffuseA;
		}
	}
}