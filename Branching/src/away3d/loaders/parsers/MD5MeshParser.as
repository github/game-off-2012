package away3d.loaders.parsers
{
	import away3d.animators.SkeletonAnimationSet;
	import away3d.animators.SkeletonAnimator;
	import away3d.animators.data.Skeleton;
	import away3d.animators.data.SkeletonJoint;
	import away3d.arcane;
	import away3d.core.base.Geometry;
	import away3d.core.base.SkinnedSubGeometry;
	import away3d.core.math.Quaternion;
	import away3d.entities.Mesh;
	import flash.geom.Matrix3D;
	import flash.geom.Vector3D;


	use namespace arcane;

	// todo: create animation system, parse skeleton

	/**
	 * AWDParser provides a parser for the md5mesh data type, providing the geometry of the md5 format.
	 *
	 * todo: optimize
	 */
	public class MD5MeshParser extends ParserBase
	{
		private var _textData:String;
		private var _startedParsing : Boolean;
		private static const VERSION_TOKEN : String = "MD5Version";
		private static const COMMAND_LINE_TOKEN : String = "commandline";
		private static const NUM_JOINTS_TOKEN : String = "numJoints";
		private static const NUM_MESHES_TOKEN : String = "numMeshes";
		private static const COMMENT_TOKEN : String = "//";
		private static const JOINTS_TOKEN : String = "joints";
		private static const MESH_TOKEN : String = "mesh";

		private static const MESH_SHADER_TOKEN : String = "shader";
		private static const MESH_NUM_VERTS_TOKEN : String = "numverts";
		private static const MESH_VERT_TOKEN : String = "vert";
		private static const MESH_NUM_TRIS_TOKEN : String = "numtris";
		private static const MESH_TRI_TOKEN : String = "tri";
		private static const MESH_NUM_WEIGHTS_TOKEN : String = "numweights";
		private static const MESH_WEIGHT_TOKEN : String = "weight";

		private var _parseIndex : int;
		private var _reachedEOF : Boolean;
		private var _line : int;
		private var _charLineIndex : int;
		private var _version : int;
		private var _numJoints : int;
		private var _numMeshes : int;

		private var _mesh : Mesh;
		private var _shaders : Vector.<String>;

		private var _maxJointCount : int;
		private var _meshData : Vector.<MeshData>;
		private var _bindPoses : Vector.<Matrix3D>;
		private var _geometry : Geometry;

		private var _skeleton : Skeleton;
		private var _animationSet : SkeletonAnimationSet;

		private var _rotationQuat : Quaternion;

		/**
		 * Creates a new MD5MeshParser object.
		 */
		public function MD5MeshParser(additionalRotationAxis : Vector3D = null, additionalRotationRadians : Number = 0)
		{
			super(ParserDataFormat.PLAIN_TEXT);
			_rotationQuat = new Quaternion();

			_rotationQuat.fromAxisAngle(Vector3D.X_AXIS, -Math.PI * .5);

			if (additionalRotationAxis) {
				var quat : Quaternion = new Quaternion();
				quat.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
				_rotationQuat.multiply(_rotationQuat, quat);
			}
		}

		/**
		 * Indicates whether or not a given file extension is supported by the parser.
		 * @param extension The file extension of a potential file to be parsed.
		 * @return Whether or not the given file type is supported.
		 */
		public static function supportsType(extension : String) : Boolean
		{
			extension = extension.toLowerCase();
			return extension == "md5mesh";
		}

		/**
		 * Tests whether a data block can be parsed by the parser.
		 * @param data The data block to potentially be parsed.
		 * @return Whether or not the given data is supported.
		 */
		public static function supportsData(data : *) : Boolean
		{
			return false;
		}


		/**
		 * @inheritDoc
		 */
		protected override function proceedParsing() : Boolean
		{
			var token : String;

			if(!_startedParsing) {
				_textData = getTextData();
				_startedParsing = true;
			}

			while (hasTime()) {
				token = getNextToken();
				switch (token) {
					case COMMENT_TOKEN:
						ignoreLine();
						break;
					case VERSION_TOKEN:
						_version = getNextInt();
						if (_version != 10) throw new Error("Unknown version number encountered!");
						break;
					case COMMAND_LINE_TOKEN:
						parseCMD();
						break;
					case NUM_JOINTS_TOKEN:
						_numJoints = getNextInt();
						_bindPoses = new Vector.<Matrix3D>(_numJoints, true);
						break;
					case NUM_MESHES_TOKEN:
						_numMeshes = getNextInt();
						break;
					case JOINTS_TOKEN:
						parseJoints();
						break;
					case MESH_TOKEN:
						parseMesh();
						break;
					default:
						if (!_reachedEOF)
							sendUnknownKeywordError();
				}

				if (_reachedEOF) {
					calculateMaxJointCount();
					_animationSet = new SkeletonAnimationSet(_maxJointCount);

					_mesh = new Mesh(new Geometry(), null);
					_geometry = _mesh.geometry;

					for (var i : int = 0; i < _meshData.length; ++i) {
						_geometry.addSubGeometry(translateGeom(_meshData[i].vertexData, _meshData[i].weightData, _meshData[i].indices));
					}

					//_geometry.animation = _animation;
//					_mesh.animationController = _animationController;

					finalizeAsset(_mesh);
					finalizeAsset(_skeleton);
					finalizeAsset(_animationSet);
					return ParserBase.PARSING_DONE;
				}
			}
			return ParserBase.MORE_TO_PARSE;
		}

		private function calculateMaxJointCount() : void
		{
			_maxJointCount = 0;

			var numMeshData : int = _meshData.length;
			for (var i : int = 0; i < numMeshData; ++i) {
				var meshData : MeshData = _meshData[i];
				var vertexData : Vector.<VertexData> = meshData.vertexData;
				var numVerts : int = vertexData.length;

				for (var j : int = 0; j < numVerts; ++j) {
					var zeroWeights : int = countZeroWeightJoints(vertexData[j], meshData.weightData);
					var totalJoints : int = vertexData[j].countWeight - zeroWeights;
					if (totalJoints > _maxJointCount)
						_maxJointCount = totalJoints;
				}
			}
		}

		private function countZeroWeightJoints(vertex : VertexData, weights : Vector.<JointData>) : int
		{
			var start : int = vertex.startWeight;
			var end : int = vertex.startWeight + vertex.countWeight;
			var count : int = 0;
			var weight : Number;

			for (var i : int = start; i < end; ++i) {
				weight = weights[i].bias;
				if (weight == 0) ++count;
			}

			return count;
		}

		/**
		 * Parses the skeleton's joints.
		 */
		private function parseJoints() : void
		{
			var ch : String;
			var joint : SkeletonJoint;
			var pos : Vector3D;
			var quat : Quaternion;
			var i : int = 0;
			var token : String = getNextToken();

			if (token != "{") sendUnknownKeywordError();

			_skeleton = new Skeleton();

			do {
				if (_reachedEOF) sendEOFError();
				joint = new SkeletonJoint();
				joint.name = parseLiteralString();
				joint.parentIndex = getNextInt();
				pos = parseVector3D();
				pos = _rotationQuat.rotatePoint(pos);
				quat = parseQuaternion();

				// todo: check if this is correct, or maybe we want to actually store it as quats?
				_bindPoses[i] = quat.toMatrix3D();
				_bindPoses[i].appendTranslation(pos.x, pos.y, pos.z);
				var inv : Matrix3D = _bindPoses[i].clone();
				inv.invert();
				joint.inverseBindPose = inv.rawData;

				_skeleton.joints[i++] = joint;

				ch = getNextChar();

				if (ch == "/") {
					putBack();
					ch = getNextToken();
					if (ch == COMMENT_TOKEN) ignoreLine();
					ch = getNextChar();

				}

				if (ch != "}") putBack();
			} while (ch != "}");
		}

		/**
		 * Puts back the last read character into the data stream.
		 */
		private function putBack() : void
		{
			_parseIndex--;
			_charLineIndex--;
			_reachedEOF = _parseIndex >= _textData.length;
		}

		/**
		 * Parses the mesh geometry.
		 */
		private function parseMesh() : void
		{
			var token : String = getNextToken();
			var ch : String;
			var vertexData : Vector.<VertexData>;
			var weights : Vector.<JointData>;
			var indices : Vector.<uint>;

			if (token != "{") sendUnknownKeywordError();

			_shaders ||= new Vector.<String>();

			while (ch != "}") {
				ch = getNextToken();
				switch (ch) {
					case COMMENT_TOKEN:
						ignoreLine();
						break;
					case MESH_SHADER_TOKEN:
						_shaders.push(parseLiteralString());
						break;
					case MESH_NUM_VERTS_TOKEN:
						vertexData = new Vector.<VertexData>(getNextInt(), true);
						break;
					case MESH_NUM_TRIS_TOKEN:
						indices = new Vector.<uint>(getNextInt() * 3, true);
						break;
					case MESH_NUM_WEIGHTS_TOKEN:
						weights = new Vector.<JointData>(getNextInt(), true);
						break;
					case MESH_VERT_TOKEN:
						parseVertex(vertexData);
						break;
					case MESH_TRI_TOKEN:
						parseTri(indices);
						break;
					case MESH_WEIGHT_TOKEN:
						parseJoint(weights);
						break;
				}
			}

			_meshData ||= new Vector.<MeshData>();
			var i : uint = _meshData.length;
			_meshData[i] = new MeshData();
			_meshData[i].vertexData = vertexData;
			_meshData[i].weightData = weights;
			_meshData[i].indices = indices;
		}

		/**
		 * Converts the mesh data to a SkinnedSub instance.
		 * @param vertexData The mesh's vertices.
		 * @param weights The joint weights per vertex.
		 * @param indices The indices for the faces.
		 * @return A SkinnedSubGeometry instance containing all geometrical data for the current mesh.
		 */
		private function translateGeom(vertexData : Vector.<VertexData>, weights : Vector.<JointData>, indices : Vector.<uint>) : SkinnedSubGeometry
		{
			var len : int = vertexData.length;
			var v1 : int, v2 : int, v3 : int;
			var vertex : VertexData;
			var weight : JointData;
			var bindPose : Matrix3D;
			var pos : Vector3D;
			var subGeom : SkinnedSubGeometry = new SkinnedSubGeometry(_maxJointCount);
			var uvs : Vector.<Number> = new Vector.<Number>(len * 2, true);
			var vertices : Vector.<Number> = new Vector.<Number>(len * 3, true);
			var jointIndices : Vector.<Number> = new Vector.<Number>(len * _maxJointCount, true);
			var jointWeights : Vector.<Number> = new Vector.<Number>(len * _maxJointCount, true);
			var l : int;
			var nonZeroWeights : int;

			for (var i : int = 0; i < len; ++i) {
				vertex = vertexData[i];
				v1 = vertex.index * 3;
				v2 = v1 + 1;
				v3 = v1 + 2;
				vertices[v1] = vertices[v2] = vertices[v3] = 0;

				nonZeroWeights = 0;
				for (var j : int = 0; j < vertex.countWeight; ++j) {
					weight = weights[vertex.startWeight + j];
					if (weight.bias > 0) {
						bindPose = _bindPoses[weight.joint];
						pos = bindPose.transformVector(weight.pos);
						vertices[v1] += pos.x * weight.bias;
						vertices[v2] += pos.y * weight.bias;
						vertices[v3] += pos.z * weight.bias;

						// indices need to be multiplied by 3 (amount of matrix registers)
						jointIndices[l] = weight.joint * 3;
						jointWeights[l++] = weight.bias;
						++nonZeroWeights;
					}
				}

				for (j = nonZeroWeights; j < _maxJointCount; ++j) {
					jointIndices[l] = 0;
					jointWeights[l++] = 0;
				}

				v1 = vertex.index << 1;
				uvs[v1++] = vertex.s;
				uvs[v1] = vertex.t;
			}

			subGeom.updateIndexData(indices);
			subGeom.fromVectors(vertices, uvs, null, null);
			// cause explicit updates
			subGeom.vertexNormalData;
			subGeom.vertexTangentData;
			// turn auto updates off because they may be animated and set explicitly
			subGeom.autoDeriveVertexTangents = false;
			subGeom.autoDeriveVertexNormals = false;
			subGeom.updateJointIndexData(jointIndices);
			subGeom.updateJointWeightsData(jointWeights);

			return subGeom;
		}

		/**
		 * Retrieve the next triplet of vertex indices that form a face.
		 * @param indices The index list in which to store the read data.
		 */
		private function parseTri(indices : Vector.<uint>) : void
		{
			var index : int = getNextInt() * 3;
			indices[index] = getNextInt();
			indices[index + 1] = getNextInt();
			indices[index + 2] = getNextInt();
		}

		/**
		 * Reads a new joint data set for a single joint.
		 * @param weights the target list to contain the weight data.
		 */
		private function parseJoint(weights : Vector.<JointData>) : void
		{
			var weight : JointData = new JointData();
			weight.index = getNextInt();
			weight.joint = getNextInt();
			weight.bias = getNextNumber();
			weight.pos = parseVector3D();
			weights[weight.index] = weight;
		}

		/**
		 * Reads the data for a single vertex.
		 * @param vertexData The list to contain the vertex data.
		 */
		private function parseVertex(vertexData : Vector.<VertexData>) : void
		{
			var vertex : VertexData = new VertexData();
			vertex.index = getNextInt();
			parseUV(vertex);
			vertex.startWeight = getNextInt();
			vertex.countWeight = getNextInt();
//			if (vertex.countWeight > _maxJointCount) _maxJointCount = vertex.countWeight;
			vertexData[vertex.index] = vertex;
		}

		/**
		 * Reads the next uv coordinate.
		 * @param vertexData The vertexData to contain the UV coordinates.
		 */
		private function parseUV(vertexData : VertexData) : void
		{
			var ch : String = getNextToken();
			if (ch != "(") sendParseError("(");
			vertexData.s = getNextNumber();
			vertexData.t = getNextNumber();

			if (getNextToken() != ")") sendParseError(")");
		}

		/**
		 * Gets the next token in the data stream.
		 */
		private function getNextToken() : String
		{
			var ch : String;
			var token : String = "";

			while (!_reachedEOF) {
				ch = getNextChar();
				if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
					if (token != COMMENT_TOKEN)
						skipWhiteSpace();
					if (token != "")
						return token;
				}
				else token += ch;

				if (token == COMMENT_TOKEN) return token;
			}

			return token;
		}

		/**
		 * Skips all whitespace in the data stream.
		 */
		private function skipWhiteSpace() : void
		{
			var ch : String;

			do {
				ch = getNextChar();
			} while (ch == "\n" || ch == " " || ch == "\r" || ch == "\t");

			putBack();
		}

		/**
		 * Skips to the next line.
		 */
		private function ignoreLine() : void
		{
			var ch : String;
			while (!_reachedEOF && ch != "\n")
				ch = getNextChar();
		}

		/**
		 * Retrieves the next single character in the data stream.
		 */
		private function getNextChar() : String
		{
			var ch : String = _textData.charAt(_parseIndex++);

			if (ch == "\n") {
				++_line;
				_charLineIndex = 0;
			}
			else if (ch != "\r") ++_charLineIndex;

			if (_parseIndex >= _textData.length)
				_reachedEOF = true;

			return ch;
		}


		/**
		 * Retrieves the next integer in the data stream.
		 */
		private function getNextInt() : int
		{
			var i : Number = parseInt(getNextToken());
			if (isNaN(i)) sendParseError("int type");
			return i;
		}

		/**
		 * Retrieves the next floating point number in the data stream.
		 */
		private function getNextNumber() : Number
		{
			var f : Number = parseFloat(getNextToken());
			if (isNaN(f)) sendParseError("float type");
			return f;
		}

		/**
		 * Retrieves the next 3d vector in the data stream.
		 */
		private function parseVector3D() : Vector3D
		{
			var vec : Vector3D = new Vector3D();
			var ch : String = getNextToken();

			if (ch != "(") sendParseError("(");
			vec.x = -getNextNumber();
			vec.y = getNextNumber();
			vec.z = getNextNumber();

			if (getNextToken() != ")") sendParseError(")");

			return vec;
		}

		/**
		 * Retrieves the next quaternion in the data stream.
		 */
		private function parseQuaternion() : Quaternion
		{
			var quat : Quaternion = new Quaternion();
			var ch : String = getNextToken();

			if (ch != "(") sendParseError("(");
			quat.x = getNextNumber();
			quat.y = -getNextNumber();
			quat.z = -getNextNumber();

			// quat supposed to be unit length
			var t : Number = 1 - quat.x * quat.x - quat.y * quat.y - quat.z * quat.z;
			quat.w = t < 0 ? 0 : -Math.sqrt(t);

			if (getNextToken() != ")") sendParseError(")");

			var rotQuat : Quaternion = new Quaternion();
			rotQuat.multiply(_rotationQuat, quat);
			return rotQuat;
		}

		/**
		 * Parses the command line data.
		 */
		private function parseCMD() : void
		{
			// just ignore the command line property
			parseLiteralString();
		}

		/**
		 * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
		 * by double quotes.
		 */
		private function parseLiteralString() : String
		{
			skipWhiteSpace();

			var ch : String = getNextChar();
			var str : String = "";

			if (ch != "\"") sendParseError("\"");

			do {
				if (_reachedEOF) sendEOFError();
				ch = getNextChar();
				if (ch != "\"") str += ch;
			} while (ch != "\"");

			return str;
		}

		/**
		 * Throws an end-of-file error when a premature end of file was encountered.
		 */
		private function sendEOFError() : void
		{
			throw new Error("Unexpected end of file");
		}

		/**
		 * Throws an error when an unexpected token was encountered.
		 * @param expected The token type that was actually expected.
		 */
		private function sendParseError(expected : String) : void
		{
			throw new Error("Unexpected token at line " + (_line + 1) + ", character " + _charLineIndex + ". " + expected + " expected, but " + _textData.charAt(_parseIndex - 1) + " encountered");
		}

		/**
		 * Throws an error when an unknown keyword was encountered.
		 */
		private function sendUnknownKeywordError() : void
		{
			throw new Error("Unknown keyword at line " + (_line + 1) + ", character " + _charLineIndex + ". ");
		}
	}
}

import flash.geom.Vector3D;

class VertexData
{
	public var index : int;
	public var s : Number;
	public var t : Number;
	public var startWeight : int;
	public var countWeight : int;
}

class JointData
{
	public var index : int;
	public var joint : int;
	public var bias : Number;
	public var pos : Vector3D;
}

class MeshData
{
	public var vertexData : Vector.<VertexData>;
	public var weightData : Vector.<JointData>;
	public var indices : Vector.<uint>;
}

