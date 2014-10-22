import IMaterialOwner				= require("awayjs-core/lib/core/base/IMaterialOwner");
import LineSubMesh					= require("awayjs-core/lib/core/base/LineSubMesh");
import LineSubGeometry				= require("awayjs-core/lib/core/base/LineSubGeometry");
import RenderablePool				= require("awayjs-core/lib/core/pool/RenderablePool");
import SubGeometryEvent				= require("awayjs-core/lib/events/SubGeometryEvent");

import RenderableBase				= require("awayjs-stagegl/lib/core/pool/RenderableBase");

/**
 * @class away.pool.LineSubMeshRenderable
 */
class LineSubMeshRenderable extends RenderableBase
{
	/**
	 *
	 */
	public static id:string = "linesubmesh";

	/**
	 *
	 */
	public subMesh:LineSubMesh;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param subMesh
	 * @param level
	 * @param dataOffset
	 */
	constructor(pool:RenderablePool, subMesh:LineSubMesh, level:number = 0, indexOffset:number = 0)
	{
		super(pool, subMesh.parentMesh, subMesh, level, indexOffset);

		this.subMesh = subMesh;
	}

	/**
	 * //TODO
	 *
	 * @returns {base.LineSubGeometry}
	 * @protected
	 */
	public _pGetSubGeometry():LineSubGeometry
	{
		var subGeometry:LineSubGeometry = this.subMesh.subGeometry;

		this._pVertexDataDirty[LineSubGeometry.START_POSITION_DATA] = true;
		this._pVertexDataDirty[LineSubGeometry.END_POSITION_DATA] = true;

		if (subGeometry.thickness)
			this._pVertexDataDirty[LineSubGeometry.THICKNESS_DATA] = true;

		if (subGeometry.startColors)
			this._pVertexDataDirty[LineSubGeometry.COLOR_DATA] = true;

		return subGeometry;
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param materialOwner
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.LineSubMeshRenderable}
	 * @private
	 */
	public _pGetOverflowRenderable(pool:RenderablePool, materialOwner:IMaterialOwner, level:number, indexOffset:number):RenderableBase
	{
		return new LineSubMeshRenderable(pool, <LineSubMesh> materialOwner, level, indexOffset);
	}
}

export = LineSubMeshRenderable;