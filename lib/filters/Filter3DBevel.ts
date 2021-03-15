import { Rectangle } from '@awayjs/core';
import { Image2D } from '../image/Image2D';
import { FilterManager } from '../managers/FilterManager';
import { FilterUtils } from '../utils/FilterUtils';
import { BlurFilter3D } from './BlurFilter3D';
import { IUniversalFilter } from './IUniversalFilter';
import { Filter3DBevelTask } from './tasks/webgl/Filter3DBevelTask';

function proxyTo(fieldName: string, subFieldName?: string): any {
	return function (
		target: any,
		propertyKey: string,
		_descriptor: TypedPropertyDescriptor<any>
	) {
		subFieldName = propertyKey;

		Object.defineProperty(target, propertyKey, {
			set: function (v: any) {
				this[fieldName][subFieldName] = v;
			},
			get: function () {
				return this[fieldName][subFieldName];
			}
		});
	};
}
export interface IBevelFilterModel {
	distance: number;
	angle: number;
	highlightColor: ui32;
	highlightAlpha: ui32;
	shadowColor: ui32;
	shadowAlpha: number;
	blurX: ui32;
	blurY: ui32;
	strength: number;
	quality: ui8;
	type?: 'inner';
	knockout?: number;
}

export class Filter3DBevel extends BlurFilter3D implements IUniversalFilter<IBevelFilterModel> {
	public readonly filterName = 'bevel';

	protected _bevelTask = new Filter3DBevelTask();

	@proxyTo('_bevelTask')
	distance: number = 1;

	@proxyTo('_bevelTask')
	angle: number = 45;

	@proxyTo('_bevelTask')
	highlightColor: number = 0xffffff;

	@proxyTo('_bevelTask')
	highlightAlpha: number = 1;

	@proxyTo('_bevelTask')
	shadowColor: number = 1;

	@proxyTo('_bevelTask')
	shadowAlpha: number = 0;

	@proxyTo('_bevelTask')
	strength: number = 1;

	quality: number;

	@proxyTo('_bevelTask')
	type: 'inner' | 'outer' = 'inner';

	@proxyTo('_bevelTask')
	knockout: boolean = false;

	protected _source: Image2D;

	constructor(options?: Partial <IBevelFilterModel>) {
		super();

		this.addTask(this._bevelTask);

		this.applyModel(options);
	}

	public applyModel(model: Partial<IBevelFilterModel>): void {
		// run all model field that changed
		for (const key in model) {
			this[key] = model[key];
		}
	}

	public setRenderState (
		source: Image2D,
		target: Image2D,
		inputRect: Rectangle,
		outRect: Rectangle,
		filterManage: FilterManager
	) {

		const size = FilterUtils.meashureBlurBounds(
			inputRect,
			this.blurX,
			this.blurY,
			this.quality,
			true
		);

		const firstPass = filterManage.popTemp(size.width, size.height);
		const secondPass = filterManage.popTemp(size.width, size.height);

		this._hBlurTask.destRect.setTo(
			inputRect.x - size.x,
			inputRect.y - size.y,
			inputRect.width, inputRect.height
		);

		this._hBlurTask.inputRect = inputRect;

		this._bevelTask.inputRect = this._hBlurTask.destRect;
		this._bevelTask.destRect = outRect;

		this._hBlurTask.source = source;
		this._hBlurTask.target = firstPass;
		this._vBlurTask.source = firstPass;
		this._vBlurTask.target = secondPass;
		this._bevelTask.source = secondPass;
		this._bevelTask.sourceImage = source;
		this._bevelTask.target = target;

		this._temp = [firstPass, secondPass];

		this._hBlurTask.needClear = true;
		this._vBlurTask.needClear = true;
		this._bevelTask.needClear = false;
	}
}