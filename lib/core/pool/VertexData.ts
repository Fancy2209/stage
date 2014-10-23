import SubGeometryBase				= require("awayjs-display/lib/base/SubGeometryBase");
import SubGeometryEvent				= require("awayjs-display/lib/events/SubGeometryEvent");

import ContextGLBase				= require("awayjs-stagegl/lib/core/stagegl/ContextGLBase");
import IVertexBuffer				= require("awayjs-stagegl/lib/core/stagegl/IVertexBuffer");

/**
 *
 */
class VertexData
{
	private _onVerticesUpdatedDelegate:(event:SubGeometryEvent) => void;
	private _subGeometry:SubGeometryBase;
	private _dataType:string;
	private _dataDirty = true;

	public invalid:Array<boolean> = new Array<boolean>(8);

	public buffers:Array<IVertexBuffer> = new Array<IVertexBuffer>(8);

	public contexts:Array<ContextGLBase> = new Array<ContextGLBase>(8);

	public data:Array<number>;

	public dataPerVertex:number;

	constructor(subGeometry:SubGeometryBase, dataType:string)
	{
		this._subGeometry = subGeometry;
		this._dataType = dataType;

		this._onVerticesUpdatedDelegate = (event:SubGeometryEvent) => this._onVerticesUpdated(event);
		this._subGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdatedDelegate);
	}

	public updateData(originalIndices:Array<number> = null, indexMappings:Array<number> = null)
	{
		if (this._dataDirty) {
			this._dataDirty = false;

			this.dataPerVertex = this._subGeometry.getStride(this._dataType);

			var vertices:Array<number> = this._subGeometry[this._dataType];

			if (indexMappings == null) {
				this.setData(vertices);
			} else {
				var splitVerts:Array<number> = new Array<number>(originalIndices.length*this.dataPerVertex);
				var originalIndex:number;
				var splitIndex:number;
				var i:number = 0;
				var j:number = 0;
				while(i < originalIndices.length) {
					originalIndex = originalIndices[i];

					splitIndex = indexMappings[originalIndex]*this.dataPerVertex;
					originalIndex *= this.dataPerVertex;

					for (j = 0; j < this.dataPerVertex; j++)
						splitVerts[splitIndex + j] = vertices[originalIndex + j];

					i++;
				}

				this.setData(splitVerts);
			}
		}
	}

	public dispose()
	{
		for (var i:number = 0; i < 8; ++i) {
			if (this.contexts[i]) {
				this.contexts[i].disposeVertexData(this);
				this.contexts[i] = null;
			}
		}
	}

	/**
	 * @private
	 */
	private disposeBuffers()
	{
		for (var i:number = 0; i < 8; ++i) {
			if (this.buffers[i]) {
				this.buffers[i].dispose();
				this.buffers[i] = null;
			}
		}
	}

	/**
	 * @private
	 */
	private invalidateBuffers()
	{
		for (var i:number = 0; i < 8; ++i)
			this.invalid[i] = true;
	}

	/**
	 *
	 * @param data
	 * @param dataPerVertex
	 * @private
	 */
	private setData(data:Array<number>)
	{
		if (this.data && this.data.length != data.length)
			this.disposeBuffers();
		else
			this.invalidateBuffers();

		this.data = data;
	}

	/**
	 * //TODO
	 *
	 * @param event
	 * @private
	 */
	private _onVerticesUpdated(event:SubGeometryEvent)
	{
		var dataType:string = this._subGeometry.concatenateArrays? SubGeometryBase.VERTEX_DATA : event.dataType;

		if (dataType == this._dataType)
			this._dataDirty = true;
	}
}

export = VertexData;