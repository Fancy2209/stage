import AssetType					= require("awayjs-core/lib/library/AssetType");
import IAsset						= require("awayjs-core/lib/library/IAsset");
import NamedAssetBase				= require("awayjs-core/lib/library/NamedAssetBase");
import AbstractMethodError			= require("awayjs-core/lib/errors/AbstractMethodError");

import AnimationNodeBase			= require("awayjs-display/lib/animators/nodes/AnimationNodeBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ShaderObjectBase				= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterElement		= require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
import AnimationSetError			= require("awayjs-stagegl/lib/errors/AnimationSetError");

/**
 * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
 *
 * @see away.animators.AnimatorBase
 */
class AnimationSetBase extends NamedAssetBase implements IAsset
{
	private _usesCPU:boolean;
	private _animations:Array<AnimationNodeBase> = new Array<AnimationNodeBase>();
	private _animationNames:Array<string> = new Array<string>();
	private _animationDictionary:Object = new Object();

	constructor()
	{
		super();
	}

	/**
	 * Retrieves a temporary GPU register that's still free.
	 *
	 * @param exclude An array of non-free temporary registers.
	 * @param excludeAnother An additional register that's not free.
	 * @return A temporary register that can be used.
	 */
	public _pFindTempReg(exclude:Array<string>, excludeAnother:string = null):string
	{
		var i:number /*uint*/ = 0;
		var reg:string;

		while (true) {
			reg = "vt" + i;
			if (exclude.indexOf(reg) == -1 && excludeAnother != reg)
				return reg;
			++i;
		}

		// can't be reached
		return null;
	}

	/**
	 * Indicates whether the properties of the animation data contained within the set combined with
	 * the vertex registers already in use on shading materials allows the animation data to utilise
	 * GPU calls.
	 */
	public get usesCPU():boolean
	{
		return this._usesCPU;
	}

	/**
	 * Called by the material to reset the GPU indicator before testing whether register space in the shader
	 * is available for running GPU-based animation code.
	 *
	 * @private
	 */
	public resetGPUCompatibility()
	{
		this._usesCPU = false;
	}

	public cancelGPUCompatibility()
	{
		this._usesCPU = true;
	}


	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shaderObject:ShaderObjectBase):string
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public activate(shaderObject:ShaderObjectBase, stage:Stage)
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public deactivate(shaderObject:ShaderObjectBase, stage:Stage)
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALFragmentCode(shaderObject:ShaderObjectBase, shadedTarget:string):string
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALUVCode(shaderObject:ShaderObjectBase):string
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public doneAGALCode(shaderObject:ShaderObjectBase)
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return AssetType.ANIMATION_SET;
	}

	/**
	 * Returns a vector of animation state objects that make up the contents of the animation data set.
	 */
	public get animations():Array<AnimationNodeBase>
	{
		return this._animations;
	}

	/**
	 * Returns a vector of animation state objects that make up the contents of the animation data set.
	 */
	public get animationNames():Array<string>
	{
		return this._animationNames;
	}

	/**
	 * Check to determine whether a state is registered in the animation set under the given name.
	 *
	 * @param stateName The name of the animation state object to be checked.
	 */
	public hasAnimation(name:string):boolean
	{
		return this._animationDictionary[name] != null;
	}

	/**
	 * Retrieves the animation state object registered in the animation data set under the given name.
	 *
	 * @param stateName The name of the animation state object to be retrieved.
	 */
	public getAnimation(name:string):AnimationNodeBase
	{
		return this._animationDictionary[name];
	}

	/**
	 * Adds an animation state object to the aniamtion data set under the given name.
	 *
	 * @param stateName The name under which the animation state object will be stored.
	 * @param animationState The animation state object to be staored in the set.
	 */
	public addAnimation(node:AnimationNodeBase)
	{
		if (this._animationDictionary[node.name])
			throw new AnimationSetError("root node name '" + node.name + "' already exists in the set");

		this._animationDictionary[node.name] = node;

		this._animations.push(node);

		this._animationNames.push(node.name);
	}

	/**
	 * Cleans up any resources used by the current object.
	 */
	public dispose()
	{
	}
}

export = AnimationSetBase;