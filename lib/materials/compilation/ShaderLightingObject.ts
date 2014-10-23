import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");

import Camera						= require("awayjs-display/lib/entities/Camera");
import DirectionalLight				= require("awayjs-display/lib/entities/DirectionalLight");
import LightProbe					= require("awayjs-display/lib/entities/LightProbe");
import PointLight					= require("awayjs-display/lib/entities/PointLight");
import LightPickerBase				= require("awayjs-display/lib/materials/lightpickers/LightPickerBase");

import Stage						= require("awayjs-stagegl/lib/core/base/Stage");
import RenderableBase				= require("awayjs-stagegl/lib/core/pool/RenderableBase");
import IContextStageGL				= require("awayjs-stagegl/lib/core/stagegl/IContextStageGL");
import StageGLMaterialBase			= require("awayjs-stagegl/lib/materials/StageGLMaterialBase");
import ShaderCompilerBase			= require("awayjs-stagegl/lib/materials/compilation/ShaderCompilerBase");
import ShaderLightingCompiler		= require("awayjs-stagegl/lib/materials/compilation/ShaderLightingCompiler");
import ShaderObjectBase				= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");
import ILightingPassStageGL			= require("awayjs-stagegl/lib/materials/passes/ILightingPassStageGL");

/**
 * ShaderObjectBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
class ShaderLightingObject extends ShaderObjectBase
{
	/**
	 * The first index for the fragment constants containing the light data.
	 */
	public lightFragmentConstantIndex:number;

	/**
	 * The starting index if the vertex constant to which light data needs to be uploaded.
	 */
	public lightVertexConstantIndex:number;

	/**
	 * Indices for the light probe diffuse textures.
	 */
	public lightProbeDiffuseIndices:Array<number> /*uint*/;

	/**
	 * Indices for the light probe specular textures.
	 */
	public lightProbeSpecularIndices:Array<number> /*uint*/;

	/**
	 * The index of the fragment constant containing the weights for the light probes.
	 */
	public probeWeightsIndex:number;

	public numLights:number;
	public usesLightFallOff:boolean;

	public usesShadows:boolean;

	public numPointLights:number;
	public numDirectionalLights:number;
	public numLightProbes:number;
	public pointLightsOffset:number;
	public directionalLightsOffset:number;
	public lightProbesOffset:number;
	public lightPicker:LightPickerBase;

	/**
	 * Indicates whether the shader uses any lights.
	 */
	public usesLights:boolean;

	/**
	 * Indicates whether the shader uses any light probes.
	 */
	public usesProbes:boolean;

	/**
	 * Indicates whether the lights uses any specular components.
	 */
	public usesLightsForSpecular:boolean;

	/**
	 * Indicates whether the probes uses any specular components.
	 */
	public usesProbesForSpecular:boolean;

	/**
	 * Indicates whether the lights uses any diffuse components.
	 */
	public usesLightsForDiffuse:boolean;

	/**
	 * Indicates whether the probes uses any diffuse components.
	 */
	public usesProbesForDiffuse:boolean;

	/**
	 * Creates a new MethodCompilerVO object.
	 */
	constructor(profile)
	{
		super(profile);
	}

	/**
	 * Factory method to create a concrete compiler object for this object
	 *
	 * @param materialPassVO
	 * @returns {away.materials.ShaderLightingCompiler}
	 */
	public createCompiler(material:StageGLMaterialBase, materialPass:ILightingPassStageGL):ShaderCompilerBase
	{
		return new ShaderLightingCompiler(material, materialPass, this);
	}

	/**
	 * Clears dependency counts for all registers. Called when recompiling a pass.
	 */
	public reset()
	{
		super.reset();

		this.numLights = 0;
		this.usesLightFallOff = true;
	}

	/**
	 * Adds any external world space dependencies, used to force world space calculations.
	 */
	public addWorldSpaceDependencies(fragmentLights:boolean)
	{
		super.addWorldSpaceDependencies(fragmentLights);

		if (this.numPointLights > 0 && this.usesLights) {
			++this.globalPosDependencies;

			if (fragmentLights)
				this.usesGlobalPosFragment = true;
		}
	}

	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public setRenderState(renderable:RenderableBase, stage:Stage, camera:Camera, viewProjection:Matrix3D)
	{
		super.setRenderState(renderable, stage, camera, viewProjection);

		if (this.usesLights)
			this.updateLights();

		if (this.usesProbes)
			this.updateProbes(stage);
	}

	/**
	 * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
	 */
	private updateLights()
	{
		var dirLight:DirectionalLight;
		var pointLight:PointLight;
		var i:number = 0;
		var k:number = 0;
		var len:number;
		var dirPos:Vector3D;
		var total:number = 0;
		var numLightTypes:number = this.usesShadows? 2 : 1;
		var l:number;
		var offset:number;

		this.ambientR = this.ambientG = this.ambientB = 0;

		l = this.lightVertexConstantIndex;
		k = this.lightFragmentConstantIndex;

		var cast:number = 0;
		var dirLights:Array<DirectionalLight> = this.lightPicker.directionalLights;
		offset = this.directionalLightsOffset;
		len = this.lightPicker.directionalLights.length;

		if (offset > len) {
			cast = 1;
			offset -= len;
		}

		for (; cast < numLightTypes; ++cast) {
			if (cast)
				dirLights = this.lightPicker.castingDirectionalLights;

			len = dirLights.length;

			if (len > this.numDirectionalLights)
				len = this.numDirectionalLights;

			for (i = 0; i < len; ++i) {
				dirLight = dirLights[offset + i];
				dirPos = dirLight.sceneDirection;

				this.ambientR += dirLight._iAmbientR;
				this.ambientG += dirLight._iAmbientG;
				this.ambientB += dirLight._iAmbientB;

				if (this.usesTangentSpace) {
					var x:number = -dirPos.x;
					var y:number = -dirPos.y;
					var z:number = -dirPos.z;

					this.vertexConstantData[l++] = this._pInverseSceneMatrix[0]*x + this._pInverseSceneMatrix[4]*y + this._pInverseSceneMatrix[8]*z;
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[1]*x + this._pInverseSceneMatrix[5]*y + this._pInverseSceneMatrix[9]*z;
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[2]*x + this._pInverseSceneMatrix[6]*y + this._pInverseSceneMatrix[10]*z;
					this.vertexConstantData[l++] = 1;
				} else {
					this.fragmentConstantData[k++] = -dirPos.x;
					this.fragmentConstantData[k++] = -dirPos.y;
					this.fragmentConstantData[k++] = -dirPos.z;
					this.fragmentConstantData[k++] = 1;
				}

				this.fragmentConstantData[k++] = dirLight._iDiffuseR;
				this.fragmentConstantData[k++] = dirLight._iDiffuseG;
				this.fragmentConstantData[k++] = dirLight._iDiffuseB;
				this.fragmentConstantData[k++] = 1;

				this.fragmentConstantData[k++] = dirLight._iSpecularR;
				this.fragmentConstantData[k++] = dirLight._iSpecularG;
				this.fragmentConstantData[k++] = dirLight._iSpecularB;
				this.fragmentConstantData[k++] = 1;

				if (++total == this.numDirectionalLights) {
					// break loop
					i = len;
					cast = numLightTypes;
				}
			}
		}

		// more directional supported than currently picked, need to clamp all to 0
		if (this.numDirectionalLights > total) {
			i = k + (this.numDirectionalLights - total)*12;

			while (k < i)
				this.fragmentConstantData[k++] = 0;
		}

		total = 0;

		var pointLights:Array<PointLight> = this.lightPicker.pointLights;
		offset = this.pointLightsOffset;
		len = this.lightPicker.pointLights.length;

		if (offset > len) {
			cast = 1;
			offset -= len;
		} else {
			cast = 0;
		}

		for (; cast < numLightTypes; ++cast) {
			if (cast)
				pointLights = this.lightPicker.castingPointLights;

			len = pointLights.length;

			for (i = 0; i < len; ++i) {
				pointLight = pointLights[offset + i];
				dirPos = pointLight.scenePosition;

				this.ambientR += pointLight._iAmbientR;
				this.ambientG += pointLight._iAmbientG;
				this.ambientB += pointLight._iAmbientB;

				if (this.usesTangentSpace) {
					x = dirPos.x;
					y = dirPos.y;
					z = dirPos.z;

					this.vertexConstantData[l++] = this._pInverseSceneMatrix[0]*x + this._pInverseSceneMatrix[4]*y + this._pInverseSceneMatrix[8]*z + this._pInverseSceneMatrix[12];
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[1]*x + this._pInverseSceneMatrix[5]*y + this._pInverseSceneMatrix[9]*z + this._pInverseSceneMatrix[13];
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[2]*x + this._pInverseSceneMatrix[6]*y + this._pInverseSceneMatrix[10]*z + this._pInverseSceneMatrix[14];
					this.vertexConstantData[l++] = 1;
				} else if (!this.usesGlobalPosFragment) {
					this.vertexConstantData[l++] = dirPos.x;
					this.vertexConstantData[l++] = dirPos.y;
					this.vertexConstantData[l++] = dirPos.z;
					this.vertexConstantData[l++] = 1;
				} else {
					this.fragmentConstantData[k++] = dirPos.x;
					this.fragmentConstantData[k++] = dirPos.y;
					this.fragmentConstantData[k++] = dirPos.z;
					this.fragmentConstantData[k++] = 1;
				}

				this.fragmentConstantData[k++] = pointLight._iDiffuseR;
				this.fragmentConstantData[k++] = pointLight._iDiffuseG;
				this.fragmentConstantData[k++] = pointLight._iDiffuseB;

				var radius:number = pointLight._pRadius;
				this.fragmentConstantData[k++] = radius*radius;

				this.fragmentConstantData[k++] = pointLight._iSpecularR;
				this.fragmentConstantData[k++] = pointLight._iSpecularG;
				this.fragmentConstantData[k++] = pointLight._iSpecularB;
				this.fragmentConstantData[k++] = pointLight._pFallOffFactor;

				if (++total == this.numPointLights) {
					// break loop
					i = len;
					cast = numLightTypes;
				}
			}
		}

		// more directional supported than currently picked, need to clamp all to 0
		if (this.numPointLights > total) {
			i = k + (total - this.numPointLights)*12;

			for (; k < i; ++k)
				this.fragmentConstantData[k] = 0;
		}
	}

	/**
	 * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
	 */
	private updateProbes(stage:Stage)
	{
		var probe:LightProbe;
		var lightProbes:Array<LightProbe> = this.lightPicker.lightProbes;
		var weights:Array<number> = this.lightPicker.lightProbeWeights;
		var len:number = lightProbes.length - this.lightProbesOffset;
		var addDiff:boolean = this.usesProbesForDiffuse;
		var addSpec:boolean = this.usesProbesForSpecular;

		if (!(addDiff || addSpec))
			return;

		if (len > this.numLightProbes)
			len = this.numLightProbes;

		for (var i:number = 0; i < len; ++i) {
			probe = lightProbes[ this.lightProbesOffset + i];

			if (addDiff)
				(<IContextStageGL> stage.context).activateCubeTexture(this.lightProbeDiffuseIndices[i], probe.diffuseMap);

			if (addSpec)
				(<IContextStageGL> stage.context).activateCubeTexture(this.lightProbeSpecularIndices[i], probe.specularMap);
		}

		for (i = 0; i < len; ++i)
			this.fragmentConstantData[this.probeWeightsIndex + i] = weights[this.lightProbesOffset + i];
	}
}

export = ShaderLightingObject;