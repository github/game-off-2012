﻿package away3d.primitives
{
	import flash.geom.Vector3D;

	/**
	 * A WireframePlane primitive mesh.
	 */
	public class WireframePlane extends WireframePrimitiveBase
	{
		public static const ORIENTATION_YZ:String = "yz";
		public static const ORIENTATION_XY:String = "xy";
		public static const ORIENTATION_XZ:String = "xz";

		private var _width : Number;
		private var _height : Number;
		private var _segmentsW : int;
		private var _segmentsH : int;
		private var _orientation : String;

		/**
		 * Creates a new WireframePlane object.
		 * @param width The size of the cube along its X-axis.
		 * @param height The size of the cube along its Y-axis.
		 * @param segmentsW The number of segments that make up the cube along the X-axis.
		 * @param segmentsH The number of segments that make up the cube along the Y-axis.
		 * @param color The colour of the wireframe lines
		 * @param thickness The thickness of the wireframe lines
		 * @param orientation The orientaion in which the plane lies.
		 */
		public function WireframePlane(width : Number, height : Number, segmentsW : int = 10, segmentsH : int = 10, color:uint = 0xFFFFFF, thickness:Number = 1, orientation : String = "yz") {
			super(color, thickness);

			_width = width;
			_height = height;
			_segmentsW = segmentsW;
			_segmentsH = segmentsH;
			_orientation = orientation;
		}

		/**
		 * The orientaion in which the plane lies.
		 */
		public function get orientation() : String
		{
			return _orientation;
		}

		public function set orientation(value : String) : void
		{
			_orientation = value;
			invalidateGeometry();
		}

		/**
		 * The size of the cube along its X-axis.
		 */
		public function get width() : Number
		{
			return _width;
		}

		public function set width(value : Number) : void
		{
			_width = value;
			invalidateGeometry();
		}

		/**
		 * The size of the cube along its Y-axis.
		 */
		public function get height() : Number
		{
			return _height;
		}

		public function set height(value : Number) : void
		{
			if (value <= 0) throw new Error("Value needs to be greater than 0");
			_height = value;
			invalidateGeometry();
		}

		/**
		 * The number of segments that make up the plane along the X-axis.
		 */
		public function get segmentsW() : int
		{
			return _segmentsW;
		}

		public function set segmentsW(value : int) : void
		{
			_segmentsW = value;
			removeAllSegments();
			invalidateGeometry();
		}

		/**
		 * The number of segments that make up the plane along the Y-axis.
		 */
		public function get segmentsH() : int
		{
			return _segmentsH;
		}

		public function set segmentsH(value : int) : void
		{
			_segmentsH = value;
			removeAllSegments();
			invalidateGeometry();
		}

		/**
		 * @inheritDoc
		 */
		override protected function buildGeometry() : void
		{
			var v0 : Vector3D = new Vector3D();
			var v1 : Vector3D = new Vector3D();
			var hw : Number = _width*.5;
			var hh : Number = _height*.5;
			var index : int;
			var ws : int, hs : int;

			if (_orientation == ORIENTATION_XY) {
				v0.y = hh; v0.z = 0;
				v1.y = -hh; v1.z = 0;

				for (ws = 0; ws <= _segmentsW; ++ws) {
					v0.x = v1.x = (ws/_segmentsW-.5)*_width;
					updateOrAddSegment(index++, v0, v1);
				}

				v0.x = -hw;
				v1.x = hw;

				for (hs = 0; hs <= _segmentsH; ++hs) {
					v0.y = v1.y = (hs/_segmentsH-.5)*_height;
					updateOrAddSegment(index++, v0, v1);
				}
			}

			else if (_orientation == ORIENTATION_XZ) {
				v0.z = hh; v0.y = 0;
				v1.z = -hh; v1.y = 0;

				for (ws = 0; ws <= _segmentsW; ++ws) {
					v0.x = v1.x = (ws/_segmentsW-.5)*_width;
					updateOrAddSegment(index++, v0, v1);
				}

				v0.x = -hw;
				v1.x = hw;

				for (hs = 0; hs <= _segmentsH; ++hs) {
					v0.z = v1.z = (hs/_segmentsH-.5)*_height;
					updateOrAddSegment(index++, v0, v1);
				}
			}

			else if (_orientation == ORIENTATION_YZ) {
				v0.y = hh; v0.x = 0;
				v1.y = -hh; v1.x = 0;

				for (ws = 0; ws <= _segmentsW; ++ws) {
					v0.z = v1.z = (ws/_segmentsW-.5)*_width;
					updateOrAddSegment(index++, v0, v1);
				}

				v0.z = hw;
				v1.z = -hw;

				for (hs = 0; hs <= _segmentsH; ++hs) {
					v0.y = v1.y = (hs/_segmentsH-.5)*_height;
					updateOrAddSegment(index++, v0, v1);
				}
			}
		}

	}
}
