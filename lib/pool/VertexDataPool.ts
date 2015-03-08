import SubGeometryBase				= require("awayjs-core/lib/data/SubGeometryBase");

import IndexData					= require("awayjs-stagegl/lib/pool/IndexData");
import VertexData					= require("awayjs-stagegl/lib/pool/VertexData");

/**
 *
 */
class VertexDataPool
{
	private static _pool:Object = new Object();

	constructor()
	{
	}

	public static getItem(subGeometry:SubGeometryBase, indexData:IndexData, dataType:string):VertexData
	{
		if (subGeometry.concatenateArrays)
			dataType = SubGeometryBase.VERTEX_DATA;

		var subGeometryDictionary:Object = <Object> (VertexDataPool._pool[subGeometry.id] || (VertexDataPool._pool[subGeometry.id] = new Object()));
		var subGeometryData:Array<VertexData> = <Array<VertexData>> (subGeometryDictionary[dataType] || (subGeometryDictionary[dataType] = new Array<VertexData>()));

		var vertexData:VertexData = subGeometryData[indexData.level] || (subGeometryData[indexData.level] = new VertexData(subGeometry, dataType));
		vertexData.updateData(indexData.originalIndices, indexData.indexMappings);

		return vertexData;
	}

	public static disposeItem(subGeometry:SubGeometryBase, level:number, dataType:string)
	{
		var subGeometryDictionary:Object = <Object> VertexDataPool._pool[subGeometry.id];
		var subGeometryData:Array<VertexData> = <Array<VertexData>> subGeometryDictionary[dataType];

		subGeometryData[level].dispose();
		subGeometryData[level] = null;
	}

	public disposeData(subGeometry:SubGeometryBase)
	{
		var subGeometryDictionary:Object = <Object> VertexDataPool._pool[subGeometry.id];

		for (var key in subGeometryDictionary) {
			var subGeometryData:Array<VertexData> = <Array<VertexData>> subGeometryDictionary[key];

			var len:number = subGeometryData.length;
			for (var i:number = 0; i < len; i++) {
				subGeometryData[i].dispose();
				subGeometryData[i] = null;
			}
		}

		VertexDataPool._pool[subGeometry.id] = null;
	}
}

export = VertexDataPool;