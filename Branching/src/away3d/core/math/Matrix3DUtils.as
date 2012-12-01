package away3d.core.math
{
	import flash.geom.*;

	/**
	 * Matrix3DUtils provides additional Matrix3D math functions.
	 */
	public class Matrix3DUtils
	{
		/**
		 * A reference to a Vector to be used as a temporary raw data container, to prevent object creation.
		 */
		public static const RAW_DATA_CONTAINER : Vector.<Number> = new Vector.<Number>(16);

        /**
        * Fills the 3d matrix object with values representing the transformation made by the given quaternion.
        * 
        * @param	quarternion	The quarterion object to convert.
        */
        public static function quaternion2matrix(quarternion:Quaternion, m : Matrix3D = null):Matrix3D
        {
        	var x:Number = quarternion.x;
        	var y:Number = quarternion.y;
        	var z:Number = quarternion.z;
        	var w:Number = quarternion.w;
        	
            var xx:Number = x * x;
            var xy:Number = x * y;
            var xz:Number = x * z;
            var xw:Number = x * w;
    
            var yy:Number = y * y;
            var yz:Number = y * z;
            var yw:Number = y * w;
    
            var zz:Number = z * z;
            var zw:Number = z * w;

			var raw : Vector.<Number> = RAW_DATA_CONTAINER;
			raw[0] = 1 - 2 * (yy + zz); raw[1] = 2 * (xy + zw); raw[2] = 2 * (xz - yw); raw[4] = 2 * (xy - zw);
			raw[5] = 1 - 2 * (xx + zz); raw[6] = 2 * (yz + xw); raw[8] = 2 * (xz + yw); raw[9] = 2 * (yz - xw);
			raw[10] = 1 - 2 * (xx + yy);
			raw[3] = raw[7] = raw[11] = raw[12] = raw[13] = raw[14] = 0;
			raw[15] = 1;

            if (m) {
				m.copyRawDataFrom(raw);
				return m;
			}
			else
				return new Matrix3D(raw);
        }
        
        /**
        * Returns a normalised <code>Vector3D</code> object representing the forward vector of the given matrix.
		* @param	m		The Matrix3D object to use to get the forward vector
		* @param	v 		[optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
    	* @return			The forward vector
        */
        public static function getForward(m:Matrix3D, v:Vector3D = null):Vector3D
        {
			v ||= new Vector3D(0.0, 0.0, 0.0);
			m.copyColumnTo(2, v);
        	v.normalize();

        	return v;
        }
     	
     	/**
        * Returns a normalised <code>Vector3D</code> object representing the up vector of the given matrix.
        * @param	m		The Matrix3D object to use to get the up vector
		* @param	v 		[optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
    	* @return			The up vector
        */
        public static function getUp(m:Matrix3D, v:Vector3D = null):Vector3D
        {
        	v ||= new Vector3D(0.0, 0.0, 0.0);
			m.copyColumnTo(1, v);
        	v.normalize();

        	return v;
        }
     	
     	/**
        * Returns a normalised <code>Vector3D</code> object representing the right vector of the given matrix.
		* @param	m		The Matrix3D object to use to get the right vector
		* @param	v 		[optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
    	* @return			The right vector
        */
        public static function getRight(m:Matrix3D, v:Vector3D = null):Vector3D
        {
        	v ||= new Vector3D(0.0, 0.0, 0.0);
			m.copyColumnTo(0, v);
        	v.normalize();

        	return v;
        }
     	
     	/**
         * Returns a boolean value representing whether there is any significant difference between the two given 3d matrices.
         */
        public static function compare(m1:Matrix3D, m2:Matrix3D):Boolean
        {
        	var r1 : Vector.<Number> = Matrix3DUtils.RAW_DATA_CONTAINER;
        	var r2 : Vector.<Number> = m2.rawData;
			m1.copyRawDataTo(r1);

			for (var i : uint = 0; i < 16; ++i)
				if (r1[i] != r2[i]) return false;
			
			return true;
        }

		public static function lookAt(matrix : Matrix3D, pos : Vector3D, dir : Vector3D, up : Vector3D) : void
		{
			var dirN : Vector3D;
			var upN : Vector3D;
			var lftN : Vector3D;
			var raw : Vector.<Number> = RAW_DATA_CONTAINER;

			lftN = dir.crossProduct(up);
			lftN.normalize();

			upN = lftN.crossProduct(dir);
			upN.normalize();
			dirN = dir.clone();
			dirN.normalize();

			raw[0] = lftN.x;
			raw[1] = upN.x;
			raw[2] = -dirN.x;
			raw[3] = 0.0;

			raw[4] = lftN.y;
			raw[5] = upN.y;
			raw[6] = -dirN.y;
			raw[7] = 0.0;

			raw[8] = lftN.z;
			raw[9] = upN.z;
			raw[10] = -dirN.z;
			raw[11] = 0.0;

			raw[12] = -lftN.dotProduct(pos);
			raw[13] = -upN.dotProduct(pos);
			raw[14] = dirN.dotProduct(pos);
			raw[15] = 1.0;

			matrix.copyRawDataFrom(raw);
		}

		public static function reflection(plane : Plane3D, target : Matrix3D = null) : Matrix3D
		{
			target ||= new Matrix3D();
			var a : Number = plane.a, b : Number = plane.b, c : Number = plane.c, d : Number = plane.d;
			var rawData : Vector.<Number> = Matrix3DUtils.RAW_DATA_CONTAINER;
			var ab2 : Number = -2*a*b;
			var ac2 : Number = -2*a*c;
			var bc2 : Number = -2*b*c;
			// reflection matrix
			rawData[0] = 1-2*a*a;	rawData[4] = ab2;		rawData[8] = ac2;		rawData[12] = -2*a*d;
			rawData[1] = ab2;		rawData[5] = 1-2*b*b;	rawData[9] = bc2;		rawData[13] = -2*b*d;
			rawData[2] = ac2;		rawData[6] = bc2;		rawData[10] = 1-2*c*c;	rawData[14] = -2*c*d;
			rawData[3] = 0;			rawData[7] = 0;			rawData[11] = 0;		rawData[15] = 1;
			target.copyRawDataFrom(rawData);

			return target
		}
	}
}
