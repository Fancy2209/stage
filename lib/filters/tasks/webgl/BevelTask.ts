import { ProjectionBase } from '@awayjs/core';
import { Image2D, _Stage_Image2D } from '../../../image/Image2D';
import { Stage } from '../../../Stage';
import { FilterUtils } from '../../../utils/FilterUtils';
import { TextureWebGL } from '../../../webgl/TextureWebGL';
import { TaskBaseWebGL } from './TaskBaseWebgGL';

const VERTEX = `
precision highp float;
uniform vec4 uTexMatrix[2];
uniform vec4 uTexMatrixSource;

/* AGAL legacy atrib resolver require this names */
attribute vec4 va0; // position

varying vec2 vUv[2];

void main() {
	vec4 pos = va0;

	pos.xy = pos.xy * uTexMatrix[0].zw + uTexMatrix[0].xy;
	pos.z = pos.z * 2.0 - pos.w;

    gl_Position = pos;

	vUv[0] = clamp((va0.xy * uTexMatrix[1].zw) + uTexMatrix[1].xy, 0., 1.);
	vUv[1] = clamp((va0.xy * uTexMatrixSource.zw) + uTexMatrixSource.xy , 0., 1.);
}

`;

const FRAG = `
precision highp float;
uniform float uStrength;
uniform vec3 uType;
uniform vec2 uDir;

varying vec2 vUv[2];

/* AGAL legacy attrib resolver require this names */
// blur
uniform sampler2D fs0;
/* AGAL legacy attrib resolver require this names */
// source
uniform sampler2D fs1;
// gradient
uniform sampler2D fs2;

void main() {
	vec4 color = texture2D(fs1, vUv[1]);
	
	float a = color.a;

	// LOOL.. there are a bug - we PMA it twice, devide to compense
	if (a > 0.) color.a /= a;

	float high = texture2D(fs0, vUv[0] - uDir).a;
	float shadow = texture2D(fs0, vUv[0] + uDir).a;
	float factor = high - shadow;

	vec4 bevel = texture2D(fs2, vec2(clamp(0.5 * (factor + 1.), 0., 1.), 0.));

	//shadow = min(1., max(0., factor) * uStrength) * uSColor.a;
	//high = min(1., max(0., -factor) * uStrength) * uHColor.a;

	float cut = color.a * uType[1] + (1.0 - color.a) * uType[2];
	vec4 outColor = bevel * cut;

	gl_FragColor = color * (1. - outColor.a) * uType[0] + outColor;
	gl_FragColor *= a;
}`;

export class BevelTask extends TaskBaseWebGL {
	readonly activateInternaly = false;

	public sourceImage: Image2D;

	private _uGradColor: Uint8Array = new Uint8Array(4 * 256);
	private _uGradImage: Image2D;
	private _simpleMode: boolean = true;
	private _colorMapInvalid: boolean = false;

	private _shadowColor: number = 0x0;
	public get shadowColor(): number {
		return this._shadowColor;
	}

	public set shadowColor(value: number) {
		if (this.shadowColor === value) return;

		this._shadowColor = value;
		this._simpleMode = true;
		this._colorMapInvalid = true;
	}

	private _shadowAlpha: number = 1;
	public get shadowAlpha(): number {
		return this._shadowAlpha;
	}

	public set shadowAlpha(value: number) {
		if (value === this._shadowAlpha) return;

		this._shadowAlpha = value;
		this._simpleMode = true;
		this._colorMapInvalid = true;

	}

	private _highlightColor: number = 0xfffff;
	public get highlightColor(): number {
		return this._highlightColor;
	}

	public set highlightColor(value: number) {
		if (this._highlightColor !== value) return;

		this._highlightColor = value;
		this._colorMapInvalid = true;
		this._simpleMode = true;
	}

	private _highlightAlpha: number = 1;
	public get highlightAlpha(): number {
		return this._highlightAlpha;
	}

	public set highlightAlpha(value: number) {
		if (this._highlightAlpha === value) return;

		this._highlightAlpha = value;
		this._colorMapInvalid = true;
		this._simpleMode = true;
	}

	private _dirInvalid: boolean = false;
	private _angle: number = 45;
	public get angle(): number {
		return this._angle;
	}

	public set angle(value: number) {
		if (value === this._angle) return;

		this._angle = value;
		this._dirInvalid = true;
	}

	private _distance: number = 4;
	public get distance(): number {
		return this._distance;
	}

	public set distance(value: number) {
		if (value === this._distance) return;

		this._distance = value;
		this._dirInvalid = true;
	}

	private _colors: ui32[];
	public get colors(): ui32[] {
		return this._colors;
	}

	public set colors(value: ui32[]) {
		this._colors = value;
		this._colorMapInvalid = true;
		this._simpleMode = false;
	}

	private _alphas: ui32[];
	public get alphas(): ui32[] {
		return this._alphas;
	}

	public set alphas(value: ui32[]) {
		this._alphas = value;
		this._colorMapInvalid = true;
		this._simpleMode = false;
	}

	private _ratios: ui32[];
	public get ratios(): ui32[] {
		return this._ratios;
	}

	public set ratios(value: ui32[]) {
		this._ratios = value;
		this._colorMapInvalid = true;
		this._simpleMode = false;
	}

	public strength: number = 1;
	public knockout: boolean = false;
	public type: 'inner' | 'outer' | 'both' = 'inner';

	public _focusId = -1;

	constructor() {
		super();
	}

	public getVertexCode(): string {
		return VERTEX;
	}

	public getFragmentCode(): string {
		return FRAG;
	}

	private _regenColorMap(): void {
		if (!this._colorMapInvalid) {
			return;
		}

		const colorA = [0,0,0,0];
		const colorB = [0,0,0,0];
		const buff = this._uGradColor;

		// have 2 colors: shadow and highlight
		if (this._simpleMode) {
			// generate a ratio/shadow/colors
			this._alphas = [this._highlightAlpha, 0, this._shadowAlpha];
			this._colors = [this._highlightColor, 0, this._shadowColor];
			this._ratios = [0, 128, 255];
		}

		// reset to 0
		this._uGradColor.fill(0);

		for (let i = 0; i < this._ratios.length - 1; i++) {
			FilterUtils.colorToU8(this._colors[i + 0], this._alphas[i + 0], colorA);
			FilterUtils.colorToU8(this._colors[i + 1], this._alphas[i + 1], colorB);

			const from = this._ratios[i + 0];
			const to   = this._ratios[i + 1];

			for (let j = from; j < to; j++) {
				const factor = (j - from) / (to - from);
				// interpolate each color
				buff[j * 4 + 0] = colorA[0] + (colorB[0] - colorA[0]) * factor | 0;
				buff[j * 4 + 1] = colorA[1] + (colorB[1] - colorA[1]) * factor | 0;
				buff[j * 4 + 2] = colorA[2] + (colorB[2] - colorA[2]) * factor | 0;
				buff[j * 4 + 3] = colorA[3] + (colorB[3] - colorA[3]) * factor | 0;
			}
		}

		this._colorMapInvalid = true;
	}

	public preActivate(_stage: Stage) {
		if (this._uGradImage && !this._colorMapInvalid) {
			return;
		}

		if (!this._uGradImage) {
			this._uGradImage = new Image2D(256, 1, false);
		}

		this._regenColorMap();

		const tex = <TextureWebGL> this._uGradImage.getAbstraction<_Stage_Image2D>(_stage).getTexture();
		tex.uploadFromArray(this._uGradColor, 0, false);
	}

	public activate(_stage: Stage, _projection: ProjectionBase, _depthTexture: Image2D): void {
		super.computeVertexData();

		const tex = this._source;
		const prog = this._program3D;
		const needUpload = prog.focusId !== this._focusId;

		prog.uploadUniform('uTexMatrix', this._vertexConstantData);

		if (needUpload || this._dirInvalid) {
			const rad = this.angle * Math.PI / 180;
			prog.uploadUniform('uDir', [
				Math.cos(rad) * this.distance / tex.width,
				Math.sin(rad) * this.distance / tex.height
			]);
		}

		prog.uploadUniform('uStrength', this.strength);
		prog.uploadUniform('uType', [
			this.knockout ? 0 : 1,
			this.type !== 'outer' ? 1 : 0,
			this.type !== 'inner' ? 1 : 0
		]);

		prog.uploadUniform('uTexMatrixSource', [
			0, 0,
			this.inputRect.width / this.sourceImage.width,
			this.inputRect.height / this.sourceImage.height,
		]);

		this.sourceImage.getAbstraction<_Stage_Image2D>(_stage).activate(1);
		this._uGradImage.getAbstraction<_Stage_Image2D>(_stage).activate(2);

		this._focusId = prog.focusId;
		this._dirInvalid = false;
	}
}