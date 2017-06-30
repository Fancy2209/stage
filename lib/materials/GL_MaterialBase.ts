import {AssetEvent, AbstractionBase} from "@awayjs/core";

import {ImageBase, SamplerBase, IMaterial, MaterialEvent, IEntity, MaterialBase, DefaultMaterialManager, TextureBase, Style} from "@awayjs/graphics";

import {AnimatorBase} from "../animators/AnimatorBase";
import {IElementsClassGL} from "../elements/IElementsClassGL";
import {PassEvent} from "../events/PassEvent";
import {GL_ImageBase} from "../image/GL_ImageBase";
import {GL_SamplerBase} from "../image/GL_SamplerBase";
import {ShaderBase} from "../shaders/ShaderBase";
import {Stage} from "../Stage";

import {IPass} from "./passes/IPass";

import {MaterialPool} from "./MaterialPool";

/**
 *
 * @class away.pool.Passes
 */
export class GL_MaterialBase extends AbstractionBase
{
	private _onInvalidateAnimationDelegate:(event:MaterialEvent) => void;
	private _onInvalidatePassesDelegate:(event:MaterialEvent) => void;

	public usages:number = 0;
	public _forceSeparateMVP:boolean = false;

	public _material:IMaterial;
	public _elementsClass:IElementsClassGL;
	public _stage:Stage;

	private _renderOrderId:number;
	private _usesAnimation:boolean = true;
	private _invalidAnimation:boolean = true;
	private _invalidRender:boolean = true;
	private _invalidImages:boolean = true;
	private _passes:Array<IPass> = new Array<IPass>();
	private _imageIndices:Object = new Object();
	private _numImages:number;




	public _pRequiresBlending:boolean = false;

	private _onPassInvalidateDelegate:(event:PassEvent) => void;

	public materialID:number;

	public images:Array<GL_ImageBase> = new Array<GL_ImageBase>();

	public samplers:Array<GL_SamplerBase> = new Array<GL_SamplerBase>();

	public get style():Style
	{
		return this._material.style;
	}

	/**
	 * Indicates whether or not the renderable requires alpha blending during rendering.
	 */
	public get requiresBlending():boolean
	{
		return this._pRequiresBlending;
	}

	public get renderOrderId():number
	{
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._renderOrderId;
	}

	public get passes():Array<IPass>
	{
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._passes;
	}

	public get material():IMaterial
	{
		return this._material;
	}

	public get numImages():number
	{
		if (this._invalidImages)
			this._updateImages();

		return this._numImages;
	}

	constructor(material:IMaterial, materialPool:MaterialPool)
	{
		super(material, materialPool);

		this._onInvalidateAnimationDelegate = (event:MaterialEvent) => this.onInvalidateAnimation(event);
		this._onInvalidatePassesDelegate = (event:MaterialEvent) => this.onInvalidatePasses(event);

		this.materialID = material.id;
		this._material = material;
		this._elementsClass = materialPool.elementsClass;
		this._stage = materialPool.materialGroup.stage;

		this._material.addEventListener(MaterialEvent.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
		this._material.addEventListener(MaterialEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);

		this._onPassInvalidateDelegate = (event:PassEvent) => this.onPassInvalidate(event);
	}

	public _includeDependencies(shader:ShaderBase):void
	{
		this._elementsClass._includeDependencies(shader);

		shader.alphaThreshold = this._material.alphaThreshold;
		shader.useImageRect = this._material.imageRect;
		shader.usesCurves = this._material.curves;

		if (this._material instanceof MaterialBase) {
			var material:MaterialBase = <MaterialBase> this._material;
			shader.useAlphaPremultiplied = material.alphaPremultiplied;
			shader.useBothSides = material.bothSides;
			shader.usesUVTransform = material.animateUVs;
			shader.usesColorTransform = material.useColorTransform;
		}
	}

	public getImageIndex(texture:TextureBase, index:number = 0):number
	{
		if (this._invalidImages)
			this._updateImages();

		return this._imageIndices[texture.id][index];
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._material.removeEventListener(MaterialEvent.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
		this._material.removeEventListener(MaterialEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);

		this._material = null;
		this._elementsClass = null;
		this._stage = null;

		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++) {
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
			this._passes[i].dispose();
		}

		this._passes = null;
	}

	/**
	 *
	 */
	public onInvalidate(event:AssetEvent):void
	{
		super.onInvalidate(event);

		this._invalidRender = true;
		this._invalidAnimation = true;
	}

	/**
	 *
	 */
	public onInvalidatePasses(event:MaterialEvent):void
	{
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++)
			this._passes[i].invalidate();

		this._invalidAnimation = true;
		this._invalidImages = true;
	}

	/**
	 *
	 */
	public onInvalidateAnimation(event:MaterialEvent):void
	{
		this._invalidAnimation = true;
	}

	/**
	 *
	 * @param surface
	 */
	private _updateAnimation():void
	{
		if (this._invalidRender)
			this._pUpdateRender();

		this._invalidAnimation = false;

		var usesAnimation:boolean = this._getEnabledGPUAnimation();

		var renderOrderId = 0;
		var mult:number = 1;
		var shader:ShaderBase;
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++) {
			shader = this._passes[i].shader;
			shader.usesAnimation = usesAnimation;

			renderOrderId += shader.programData.id*mult;
			mult *= 1000;
		}
		
		if (this._usesAnimation != usesAnimation) {
			this._usesAnimation = usesAnimation;

			var renderables:Array<IEntity> = this._material.iOwners;
			var numOwners:number = renderables.length;
			for (var j:number = 0; j < numOwners; j++)
				renderables[j].invalidateElements();
		}

		this._renderOrderId = renderOrderId;
	}

	private _updateImages():void
	{
		this._invalidImages = false;

		var numTextures:number = this._material.getNumTextures();
		var texture:TextureBase;
		var numImages:number;
		var images:Array<number>;
		var image:ImageBase;
		var sampler:SamplerBase;
		var index:number = 0;

		for (var i:number = 0; i < numTextures; i++) {
			texture = this._material.getTextureAt(i);
			numImages = texture.getNumImages();
			images = this._imageIndices[texture.id] = new Array<number>();
			for (var j:number = 0; j < numImages; j++) {
				image = texture.getImageAt(j) || (this._material.style? this._material.style.getImageAt(texture, j) : null) || DefaultMaterialManager.getDefaultImage2D();
				this.images[index] = <GL_ImageBase> this._stage.getAbstraction(image);

				sampler = texture.getSamplerAt(j) || (this._material.style? this._material.style.getSamplerAt(texture, j) : null) || DefaultMaterialManager.getDefaultSampler();
				this.samplers[index] = <GL_SamplerBase> this._stage.getAbstraction(sampler);

				images[j] = index++;
			}
		}

		this._numImages = index;
	}

	/**
	 * Performs any processing that needs to occur before any of its passes are used.
	 *
	 * @private
	 */
	public _pUpdateRender():void
	{
		this._invalidRender = false;

		//overrride to update shader object properties
	}

	/**
	 * Removes a pass from the surface.
	 * @param pass The pass to be removed.
	 */
	public _pRemovePass(pass:IPass):void
	{
		pass.removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
		this._passes.splice(this._passes.indexOf(pass), 1);
	}

	/**
	 * Removes all passes from the surface
	 */
	public _pClearPasses():void
	{
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; ++i)
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);

		this._passes.length = 0;
	}

	/**
	 * Adds a pass to the surface
	 * @param pass
	 */
	public _pAddPass(pass:IPass):void
	{
		this._passes.push(pass);
		pass.addEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
	}

	/**
	 * Listener for when a pass's shader code changes. It recalculates the render order id.
	 */
	private onPassInvalidate(event:PassEvent):void
	{
		this._invalidAnimation = true;
	}


	/**
	 * test if animation will be able to run on gpu BEFORE compiling materials
	 * test if the shader objects supports animating the animation set in the vertex shader
	 * if any object using this material fails to support accelerated animations for any of the shader objects,
	 * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
	 */
	private _getEnabledGPUAnimation():boolean
	{
		if (this._material.animationSet) {
			this._material.animationSet.resetGPUCompatibility();

			var entities:Array<IEntity> = this._material.iOwners;
			var numOwners:number = entities.length;

			var len:number = this._passes.length;
			var shader:ShaderBase;
			for (var i:number = 0; i < len; i++) {
				shader = this._passes[i].shader;
				shader.usesAnimation = false;
				for (var j:number = 0; j < numOwners; j++)
					if (entities[j].animator)
						(<AnimatorBase> entities[j].animator).testGPUCompatibility(shader);
			}


			return !this._material.animationSet.usesCPU;
		}

		return false;
	}
}