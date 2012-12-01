package away3d.bounds
{

	import away3d.arcane;
	import away3d.core.math.*;
	import away3d.core.pick.*;
	import away3d.primitives.*;

	import flash.geom.*;

	use namespace arcane;

	/**
	 * BoundingSphere represents a spherical bounding volume defined by a center point and a radius.
	 * This bounding volume is useful for point lights.
	 */
	public class BoundingSphere extends BoundingVolumeBase
	{
		private var _radius : Number = 0;
		private var _centerX : Number = 0;
		private var _centerY : Number = 0;
		private var _centerZ : Number = 0;

		/**
		 * The radius of the bounding sphere, calculated from the contents of the entity.
		 */
		public function get radius() : Number
		{
			return _radius;
		}

		/**
		 * Creates a new <code>BoundingSphere</code> object
		 */
		public function BoundingSphere()
		{
		}

		/**
		 * @inheritDoc
		 */
		override public function nullify() : void
		{
			super.nullify();
			_centerX = _centerY = _centerZ = 0;
			_radius = 0;
		}

		/**
		 * todo: pass planes?
		 * @inheritDoc
		 */
		override public function isInFrustum(mvpMatrix : Matrix3D) : Boolean
		{
			var raw : Vector.<Number> = Matrix3DUtils.RAW_DATA_CONTAINER;
			mvpMatrix.copyRawDataTo(raw);
			var c11 : Number = raw[uint(0)], c12 : Number = raw[uint(4)], c13 : Number = raw[uint(8)], c14 : Number = raw[uint(12)];
			var c21 : Number = raw[uint(1)], c22 : Number = raw[uint(5)], c23 : Number = raw[uint(9)], c24 : Number = raw[uint(13)];
			var c31 : Number = raw[uint(2)], c32 : Number = raw[uint(6)], c33 : Number = raw[uint(10)], c34 : Number = raw[uint(14)];
			var c41 : Number = raw[uint(3)], c42 : Number = raw[uint(7)], c43 : Number = raw[uint(11)], c44 : Number = raw[uint(15)];
			var a : Number, b : Number, c : Number, d : Number;
			var dd : Number, rr : Number = _radius;

			// TODO: this can be (much) faster: http://www.racer.nl/reference/vfc_markmorley.htm

			// left plane
			a = c41 + c11;
			b = c42 + c12;
			c = c43 + c13;
			d = c44 + c14;
			dd = a * _centerX + b * _centerY + c * _centerZ;
			if (a < 0) a = -a;
			if (b < 0) b = -b;
			if (c < 0) c = -c;
			rr = (a + b + c) * _radius;
			if (dd + rr < -d) return false;
			// right plane
			a = c41 - c11;
			b = c42 - c12;
			c = c43 - c13;
			d = c44 - c14;
			dd = a * _centerX + b * _centerY + c * _centerZ;
			if (a < 0) a = -a;
			if (b < 0) b = -b;
			if (c < 0) c = -c;
			rr = (a + b + c) * _radius;
			if (dd + rr < -d) return false;
			// bottom plane
			a = c41 + c21;
			b = c42 + c22;
			c = c43 + c23;
			d = c44 + c24;
			dd = a * _centerX + b * _centerY + c * _centerZ;
			if (a < 0) a = -a;
			if (b < 0) b = -b;
			if (c < 0) c = -c;
			rr = (a + b + c) * _radius;
			if (dd + rr < -d) return false;
			// top plane
			a = c41 - c21;
			b = c42 - c22;
			c = c43 - c23;
			d = c44 - c24;
			dd = a * _centerX + b * _centerY + c * _centerZ;
			if (a < 0) a = -a;
			if (b < 0) b = -b;
			if (c < 0) c = -c;
			rr = (a + b + c) * _radius;
			if (dd + rr < -d) return false;
			// near plane
			a = c31;
			b = c32;
			c = c33;
			d = c34;
			dd = a * _centerX + b * _centerY + c * _centerZ;
			if (a < 0) a = -a;
			if (b < 0) b = -b;
			if (c < 0) c = -c;
			rr = (a + b + c) * _radius;
			if (dd + rr < -d) return false;
			// far plane
			a = c41 - c31;
			b = c42 - c32;
			c = c43 - c33;
			d = c44 - c34;
			dd = a * _centerX + b * _centerY + c * _centerZ;
			if (a < 0) a = -a;
			if (b < 0) b = -b;
			if (c < 0) c = -c;
			rr = (a + b + c) * _radius;
			if (dd + rr < -d) return false;

			return true;
		}

		/**
		 * @inheritDoc
		 */
		override public function fromSphere(center : Vector3D, radius : Number) : void
		{
			_centerX = center.x;
			_centerY = center.y;
			_centerZ = center.z;
			_radius = radius;
			_max.x = _centerX + radius;
			_max.y = _centerY + radius;
			_max.z = _centerZ + radius;
			_min.x = _centerX - radius;
			_min.y = _centerY - radius;
			_min.z = _centerZ - radius;
			_aabbPointsDirty = true;
			if (_boundingRenderable) updateBoundingRenderable();
		}

		// TODO: fromGeometry can probably be updated a lot
		// find center from extremes, but radius from actual furthest distance from center

		/**
		 * @inheritDoc
		 */
		override public function fromExtremes(minX : Number, minY : Number, minZ : Number, maxX : Number, maxY : Number, maxZ : Number) : void
		{
			_centerX = (maxX + minX) * .5;
			_centerY = (maxY + minY) * .5;
			_centerZ = (maxZ + minZ) * .5;

			var d : Number = maxX - minX;
			var y : Number = maxY - minY;
			var z : Number = maxZ - minZ;
			if (y > d) d = y;
			if (z > d) d = z;

			_radius = d * Math.sqrt(.5);
			super.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
		}

		/**
		 * @inheritDoc
		 */
		override public function clone() : BoundingVolumeBase
		{
			var clone : BoundingSphere = new BoundingSphere();
			clone.fromSphere(new Vector3D(_centerX, _centerY, _centerZ), _radius);
			return clone;
		}

		override public function rayIntersection(position:Vector3D, direction:Vector3D, targetNormal:Vector3D):Number {
			if (containsPoint(position)) return 0;

			var px : Number = position.x - _centerX, py : Number = position.y - _centerY, pz : Number = position.z - _centerZ;
			var vx : Number = direction.x, vy : Number = direction.y, vz : Number = direction.z;
			var rayEntryDistance:Number;

			var a : Number = vx * vx + vy * vy + vz * vz;
			var b : Number = 2 * ( px * vx + py * vy + pz * vz );
			var c : Number = px * px + py * py + pz * pz - _radius * _radius;
			var det : Number = b * b - 4 * a * c;

			if (det >= 0) { // ray goes through sphere
				var sqrtDet : Number = Math.sqrt(det);
				rayEntryDistance = ( -b - sqrtDet ) / ( 2 * a );
				if (rayEntryDistance >= 0) {
					targetNormal.x = px + rayEntryDistance * vx;
					targetNormal.y = py + rayEntryDistance * vy;
					targetNormal.z = pz + rayEntryDistance * vz;
					targetNormal.normalize();

					return rayEntryDistance;
				}
			}

			// ray misses sphere
			return -1;
		}

		/**
		 * @inheritDoc
		 */
		override public function containsPoint(position : Vector3D) : Boolean
		{
			var px : Number = position.x - _centerX, py : Number = position.y - _centerY, pz : Number = position.z - _centerZ;
			var distance : Number = Math.sqrt(px * px + py * py + pz * pz);
			return distance <= _radius;
		}

		override protected function updateBoundingRenderable() : void
		{
			var sc : Number = _radius;
			if (sc == 0) sc = 0.001;
			_boundingRenderable.scaleX = sc;
			_boundingRenderable.scaleY = sc;
			_boundingRenderable.scaleZ = sc;
			_boundingRenderable.x = _centerX;
			_boundingRenderable.y = _centerY;
			_boundingRenderable.z = _centerZ;
		}

		override protected function createBoundingRenderable() : WireframePrimitiveBase
		{
			return new WireframeSphere(1);
		}

		override public function classifyToPlane(plane : Plane3D) : int
		{
			var a : Number = plane.a;
			var b : Number = plane.b;
			var c : Number = plane.c;
			var dd : Number = a * _centerX + b * _centerY + c * _centerZ - plane.d;
			if (a < 0) a = -a;
			if (b < 0) b = -b;
			if (c < 0) c = -c;
			var rr : Number = (a  + b + c) * _radius;

			return  dd > rr ? 	PlaneClassification.FRONT :
					dd < -rr ? 	PlaneClassification.BACK :
							PlaneClassification.INTERSECT;
		}
	}
}