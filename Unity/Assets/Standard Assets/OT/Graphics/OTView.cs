using UnityEngine;
using System.Collections;
 
/// <summary>
/// Provides functionality to control the 2D Camera View. 
/// </summary>
[ExecuteInEditMode]
public class OTView : MonoBehaviour
{
    //----------------------------------------------------------------------
    // Public properties
    //----------------------------------------------------------------------
    /// <summary>
    /// Camera view zoom value. zoom out &lt; 0 &gt; zoom in.
    /// </summary>
    /// <remarks>
    /// Positive zoom values will zoom in where a value of 1 will double the size of your sprites. 
    /// Negative zoom values will zoom out where a value of -1 will half the size of your sprites.
    /// A value of 0 (zero) should display the actual (pixel) size. Note that the actual pizel size 
    /// will only be pixel perfect when <see cref="OTView.alwaysPixelPerfect"/> is set to true or when the current 
    /// resolution is the <see cref="OTView.pixelPerfectResolution"/>.
    /// </remarks>
    /// 
    public float zoom
    {
        get
        {
            return _zoom;
        }
        set
        {
            _zoom = value;
            Update();
        }
    }
    /// <summary>
    /// Current view position (x/y).
    /// </summary>
    /// <remarks>
    /// You can use the view's position to scroll or move the camera/view around in your
    /// 2D world. 
    /// </remarks>
    public Vector2 position
    {
        get
        {
            return _position;
        }
        set
        {
           _position = value;
        }
    }
    /// <summary>
    /// Current camera view rotation in degrees.
    /// </summary>
    public float rotation
    {
        get
        {
            return _rotation;
        }
        set
        {
            _rotation = value;
        }
    }
    /// <summary>
    /// Pixel perfect indicator
    /// </summary>
    /// <remarks>
    /// If alwaysPixelPerfect is set to true, sprites will always be 'pixel perfect' ignoring the
    /// current (device) resolution. If you would like to use a base resolution ( that is pixel
    /// perfect ) and zoom your view depending on the current resolution, set this to false and
    /// set your pixelResolution to the resolution on which the sprites should be pixel perfect.
    /// <br></br><br></br>
    /// <strong style="color:red" >!IMPORTANT</strong> To use pixel perfect sprites Mip Mapping 
    /// and texture compression should be disabled.
    /// </remarks>
    public bool alwaysPixelPerfect
    {
        get
        {
            return _alwaysPixelPerfect;
        }
        set
        {
            _alwaysPixelPerfect = value;
            Update();
        }
    }
    /// <summary>
    /// Resolution on which sprites will be pixel perfect
    /// </summary>
    /// <remarks>
    /// Use this to set the resolution on which spritys should be pixel perfect. This setting will
    /// only be active when the alwaysPixelPerfect setting is set to false. Only the Y (height) value
    /// of the resultion is used to calculate the zooming factor.
    /// <br></br><br></br>
    /// <strong style="color:red" >!IMPORTANT</strong> To use pixel perfect sprites Mip Mapping 
    /// and texture compression should be disabled.
    /// </remarks>
    public Vector2 pixelPerfectResolution
    {
        get
        {
            return _pixelPerfectResolution;
        }
        set
        {
            _pixelPerfectResolution = value;
            if (!alwaysPixelPerfect) Update();
        }
    }

    /// <summary>
    /// Target object's position will followed.
    /// </summary>
    public GameObject movementTarget
    {
        get
        {
            return _movementTarget;
        }
        set
        {
            _movementTarget = value;
            Update();
        }
    }
		
    /// <summary>
    /// Target object's rotation will be followed.
    /// </summary>
    public GameObject rotationTarget
    {
        get
        {
            return _rotationTarget;
        }
        set
        {
            _rotationTarget = value;
            Update();
        }
    }

    /// <summary>
    /// World boundary for the view (camera)
    /// </summary>
    /// <remarks>
    /// If world boundary is set this will restrict the camera
    /// from leaving this boundary box. Setting this to Rect(0,0,0,0) 
    /// will impose no  boundary restriction.
    /// This is specified in pixel (world space) coordinates.
    /// </remarks>
    public Rect worldBounds
    {
        get
        {
            return _worldBounds;
        }
        set
        {
            _worldBounds = value;
            Update();
        }
    }

    /// <summary>
    /// Camera object belonging to this this view.
    /// </summary>
    new public Camera camera
    {
        get
        {
            return _camera;
        }
    }

    private bool IntersectRect(Rect r1, Rect r2)
    {
        return !( r2.xMin > r1.xMax
            || r2.xMax < r1.xMin
            || r2.yMin > r1.yMax
            || r2.yMax < r1.yMin
            );
    }

    /// <summary>
    /// Checks if a specific object is in view.
    /// </summary>
    /// <param name="o">Object to check</param>
    /// <returns></returns>
    public bool Contains(OTObject o)
    {
        return IntersectRect(worldRect, o.rect);
    }
    /// <summary>
    /// Position of the mousepointer in world coordinates.
    /// </summary>
    public Vector2 mouseWorldPosition
    {
        get
        {
			Vector3 wp = camera.ScreenToWorldPoint(Input.mousePosition);
            return ((OT.world == OT.World.WorldSide2D)?(Vector2)wp:new Vector2(wp.x,wp.z));
        }
    }
    /// <summary>
    /// Position of the mousepointer in view coordinates.
    /// </summary>
    public Vector2 mouseViewPosition
    {
        get
        {
           return camera.ScreenToViewportPoint(Input.mousePosition);
        }
    }

    /// <summary>
    /// This view's rectangle in world coordinates.
    /// </summary>
    public Rect worldRect
    {
        get
        {
            return _worldRect;
        }
    }

    private Camera _camera
    {
        get
        {
            return Camera.main;
        }
    }

    //----------------------------------------------------------------------
    
    public float _zoom = 0f;
    
    public Vector2 _position = Vector2.zero;
    
    public float _rotation = 0;
    
    public GameObject _movementTarget = null;
    
    public GameObject _rotationTarget = null;
    
    public Rect _worldBounds = new Rect(0, 0, 0, 0);
    
    public bool _alwaysPixelPerfect = true;
    
    public Vector2 _pixelPerfectResolution = new Vector2(1024, 768);
    /// <summary>
    /// Overrides the Orthello controlled Orthographic size of the camera
    /// </summary>
    public float customSize = 0;
    /// <summary>
    /// If checked will draw world bounds and view rectangle
    /// </summary>
    public bool drawGizmos = false;
    /// <summary>
    /// Color of view gizmos in scene
    /// </summary>
    public Color gizmosColor = Color.yellow;
    /// <summary>
    /// Z depth of the camera position
    /// </summary>
    public int cameraDepth = -1001;
    /// <summary>
    /// Far clipping range of the camera
    /// </summary>
    public int cameraRange = 2001;

    
    public float sizeFactor
    {
        get
        {
            return sizeFact;
        }
    }

    private float sizeFact = 1;
    private Vector2 _position_ = Vector2.zero;
    private float _zoom_ = 0;
    private float _rotation_ = 0;
	private Vector2 _currentScreen = Vector2.zero;

    float resSize
    {
        get
        {
            if (customSize == 0)
            {
                if (alwaysPixelPerfect)
                    return (float)Screen.height / 2f;
                else
                    return (float)Screen.height / 2f * (pixelPerfectResolution.y / (float)Screen.height);
            }
            else
              return customSize;
        }
    }
	
    public void InitView()
    {
        SetCamera();
    }

    void SetCamera()
    {
        if (OT.world2D)
        {
			if (!camera.orthographic)
            	camera.orthographic = true;
			if (camera.orthographicSize!=resSize * Mathf.Pow(2, _zoom * -1))
            	camera.orthographicSize = resSize * Mathf.Pow(2, _zoom * -1);
			if (camera.near!=0)
            	camera.near = 0;
			if (camera.far!= cameraRange)				
            	camera.far = cameraRange;				
			if (OT.world == OT.World.WorldSide2D)
			{
				cameraDepth = -1000;
				if (!camera.transform.rotation.Equals(Quaternion.identity))
            		camera.transform.rotation = Quaternion.identity;
				if (!camera.transform.position.Equals(new Vector3(_position.x, _position.y, cameraDepth)))
            		camera.transform.position = new Vector3(_position.x, _position.y, cameraDepth);
			}
			else
			{
				cameraDepth = 1000;
				if (!camera.transform.rotation.Equals(Quaternion.Euler(new Vector3(90,0,0))))
            		camera.transform.rotation = Quaternion.Euler(new Vector3(90,0,0));
				if (!camera.transform.position.Equals(new Vector3(_position.x, cameraDepth, _position.y)))
            		camera.transform.position = new Vector3(_position.x, cameraDepth, _position.y);
			}  
			if (!this.transform.position.Equals(camera.transform.position))
				this.transform.position = camera.transform.position;
			if (!this.transform.rotation.Equals(camera.transform.rotation))
				this.transform.rotation = camera.transform.rotation;								
		}
		else
		{
			drawGizmos = false;
			if (camera.orthographic)
				camera.orthographic = false;
		}
    }

    float _customSize;
    void Start()
    {
        _customSize = customSize;
        _position_ = _position;
        _rotation_ = _rotation;
		_currentScreen = new Vector2(Screen.width,Screen.height);
        _zoom_ = _zoom;
        if (customSize != 0)
        {
            sizeFact = (customSize / pixelPerfectResolution.y) * 2f;
            if (Application.isPlaying && alwaysPixelPerfect)
            {
                customSize *= Screen.height / pixelPerfectResolution.y;
                _customSize = customSize;
            }
        }
        else
            sizeFact = 1;

        GetWorldRect();
		recordPrefab = true;
    }

    private Rect _worldRect;
    Vector2 p1;
    Vector2 p2;
    Vector2 p3;
    Vector2 p4;
    Vector2 bl;
    Vector2 tr;
	
    void GetWorldRect()
    {
		if (OT.world == OT.World.World3D)
		{
			_worldRect = new Rect(0,0,0,0);
			return;
		}
		
		Vector3 vs = camera.ScreenToWorldPoint(new Vector2(0, 0));
		if (OT.world == OT.World.WorldSide2D)
        	p1 = vs;
		else
			p1 = new Vector2(vs.x,vs.z);		
        vs = camera.ScreenToWorldPoint(new Vector2(0, camera.pixelHeight));
		if (OT.world == OT.World.WorldSide2D)
        	p2 = vs;
		else
			p2 = new Vector2(vs.x,vs.z);
        vs = camera.ScreenToWorldPoint(new Vector2(camera.pixelWidth, 0));
		if (OT.world == OT.World.WorldSide2D)
        	p3 = vs;
		else
			p3 = new Vector2(vs.x,vs.z);
        vs = camera.ScreenToWorldPoint(new Vector2(camera.pixelWidth, camera.pixelHeight));
		if (OT.world == OT.World.WorldSide2D)
        	p4 = vs;
		else
			p4 = new Vector2(vs.x,vs.z);

        float x1, x2, y1, y2;

        x1 = p1.x; x2 = p1.x; 
		y1 = p1.y; y2 = p1.y;
		
        if (p2.x < x1) x1 = p2.x; 
		if (p2.y < y1) y1 = p2.y;
        if (p2.x > x2) x2 = p2.x; 
		if (p2.y > y2) y2 = p2.y;
        if (p3.x < x1) x1 = p3.x; 
		if (p3.y < y1) y1 = p3.y;
        if (p3.x > x2) x2 = p3.x; 
		if (p3.y > y2) y2 = p3.y;
        if (p4.x < x1) x1 = p4.x; 
		if (p4.y < y1) y1 = p4.y;
        if (p4.x > x2) x2 = p4.x; 
		if (p4.y > y2) y2 = p4.y;

        bl = new Vector2(x1, y1);
        tr = new Vector2(x2, y2);

        // Vector2 br = camera.ViewportToWorldPoint(new Vector2(1, 1));
        Vector2 si = new Vector2(tr.x - bl.x, tr.y - bl.y);
        _worldRect = new Rect(
            camera.transform.position.x - si.x / 2,
            ((OT.world == OT.World.WorldSide2D)?camera.transform.position.y:camera.transform.position.z) - si.y / 2,
            si.x,
            si.y);
    }

	void AdjustToWorldBounds()
	{
        if (worldBounds.width != 0)
        {
        	Vector2 pos = position;				
            bool clampX = (Mathf.Abs(worldBounds.width) >= Mathf.Abs(worldRect.width));
            if (clampX)
            {
                float minX = _worldBounds.xMin;
                float maxX = _worldBounds.xMax;
                if (maxX < minX)
                {
                    float tmp = minX;
                    minX = maxX;
                    maxX = tmp; 
                }
                minX += Mathf.Abs(worldRect.width / 2);
                maxX -= Mathf.Abs(worldRect.width / 2);
                pos.x = Mathf.Clamp(pos.x, minX, maxX);
            }
            else
                pos.x = (worldRect.xMin + worldRect.width / 2);


            bool clampY = (Mathf.Abs(worldBounds.height) >= Mathf.Abs(worldRect.height));
            if (clampY)
            {
                float minY = _worldBounds.yMin;
                float maxY = _worldBounds.yMax;

                if (maxY < minY)
                {
                    float tmp = minY;
                    minY = maxY;
                    maxY = tmp;
                }

                minY += Mathf.Abs(worldRect.height / 2);
                maxY -= Mathf.Abs(worldRect.height / 2);
                pos.y = Mathf.Clamp(pos.y, minY, maxY);
            }
            else
                pos.y = (worldRect.yMin + worldRect.height / 2);

            position = pos;
        }		
	}
	
	bool getRect = false;
	bool recordPrefab = false;
	void EditorSettings()
	{
        // aspect ration check - because it sometimes is forced back to 4:3 ???
        float asp = (float)Screen.width / (float)Screen.height;
        if (asp!=camera.aspect) return;
		
		if (!Application.isPlaying)
		{
            if (_position_ == _position && OT.world2D)
            {
				if (OT.world == OT.World.WorldSide2D)
				{
	                if (!Vector2.Equals((Vector2)camera.transform.position, _position))
	                {
						// camera has been moved manually
	                    _position = camera.transform.position;
	                    _position_ = _position;
	                    transform.position = camera.transform.position;
						UpdateWorldRect();
						recordPrefab = true;
						getRect = true;
	                }
					else
			        if (transform.position.x != _position.x || transform.position.y != _position.y)
			        {
						// view object has been moved manually
			            camera.transform.position = new Vector3(transform.position.x, transform.position.y, cameraDepth);
			            _position = new Vector2(camera.transform.position.x, camera.transform.position.y);
			            _position_ = position;
						UpdateWorldRect();
						recordPrefab = true;
						getRect = true;
			        }																			
					
					if (transform.position.z != cameraDepth)
						transform.position = new Vector3(transform.position.x,transform.position.y, cameraDepth);
					
				}
				else
				{
	                if (!Vector2.Equals(new Vector2(camera.transform.position.x,camera.transform.position.z) , _position))
	                {
						// camera has been moved manually
	                    _position = new Vector2(camera.transform.position.x, camera.transform.position.z);
	                    _position_ = _position;
	                    transform.position = camera.transform.position;
						UpdateWorldRect();
						recordPrefab = true;
						getRect = true;
	                }
					else
			        if (transform.position.x != _position.x || transform.position.z != _position.y)
			        {
						// view object has been moved manually
			            camera.transform.position = new Vector3(transform.position.x, cameraDepth, transform.position.z);
			            _position = new Vector2(camera.transform.position.x, camera.transform.position.z);
			            _position_ = position;
						UpdateWorldRect();
						recordPrefab = true;
						getRect = true;
			        }																			
					if (transform.position.y != cameraDepth)
						transform.position = new Vector3(transform.position.x, cameraDepth, transform.position.z);
				}
            }	
			
			if (_rotation_ == _rotation && OT.world2D)
			{
				if (OT.world == OT.World.WorldSide2D)
				{
					if (transform.rotation.eulerAngles.z != rotation)
					{
						// view object has been rotated manually in editor
						rotation = transform.rotation.eulerAngles.z;
						camera.transform.rotation = transform.rotation;
						recordPrefab = true;			
						getRect = true;
					}
					else
					if (camera.transform.rotation.eulerAngles.z != rotation)
					{
						// camera has been rotated manually in editor
						rotation = camera.transform.rotation.eulerAngles.z;
						transform.rotation = camera.transform.rotation;
						recordPrefab = true;						
						getRect = true;
					}
				}	
				else
				{
					if (transform.rotation.eulerAngles.y != rotation)
					{
						// view object has been rotated manually in editor
						rotation = transform.rotation.eulerAngles.y;
						camera.transform.rotation = transform.rotation;
						recordPrefab = true;			
						getRect = true;
					}
					else
					if (camera.transform.rotation.eulerAngles.y != rotation)
					{
						// camera has been rotated manually in editor
						rotation = camera.transform.rotation.eulerAngles.y;
						transform.rotation = camera.transform.rotation;
						recordPrefab = true;						
						getRect = true;
					}					
				}
			}	
									
		}				
		
        if (OT.world2D && !camera.orthographic)
            SetCamera();
		
		
		
	}
	
	void UpdateWorldRect()
	{
		Vector2 dv = position - _worldRect.center;		
		_worldRect.center = position;		
		p1 += dv;
		p2 += dv;
		p3 += dv;
		p4 += dv;
	}
	
    // Update is called once per frame
    
    public void Update()
    {
		if (!OT.isValid) return;
        
#if UNITY_EDITOR
		EditorSettings();
#endif
		
		// detect a screen size change
		if (_currentScreen.x != Screen.width || _currentScreen.y != Screen.height)
		{
			getRect = true;
			_currentScreen = new Vector2(Screen.width,Screen.height);
             camera.orthographicSize = resSize * Mathf.Pow(2, _zoom * -1);			
			_zoom_ = _zoom;
		}
		
		
		if (customSize!=0)
		{
	        if (customSize != _customSize)
	        {
	            _customSize = customSize;
            	sizeFact = (customSize / pixelPerfectResolution.y) * 2;
	        }
		}
		else
          	sizeFact = 1;
						
        if (_zoom_ != _zoom)
		{
			getRect = true;
            // check camera size
            if (camera.orthographicSize != resSize * (Mathf.Pow(2, _zoom * -1)))
                camera.orthographicSize = resSize * Mathf.Pow(2, _zoom * -1);
			_zoom_ = _zoom;
		}
		
	
		if (Application.isPlaying && OT.world2D)
		{
			// check movement and rotation targets			
	        if (movementTarget != null)
			{
				Vector2 targetPos;
				if (OT.world == OT.World.WorldTopDown2D)
					targetPos = new Vector2(movementTarget.transform.position.x,movementTarget.transform.position.z);
				else
					targetPos = movementTarget.transform.position;
				
				if (!position.Equals(targetPos))
				{
					position = targetPos;
					UpdateWorldRect();
				}
			}	
	        if (rotationTarget != null)
			{
				if (OT.world == OT.World.WorldSide2D && rotationTarget.transform.eulerAngles.z!=rotation)
	            	rotation = rotationTarget.transform.eulerAngles.z;
				else
				if (OT.world == OT.World.WorldTopDown2D && rotationTarget.transform.eulerAngles.y!=rotation)
	            	rotation = rotationTarget.transform.eulerAngles.y;
			}
		}

		if (_rotation_!=rotation && OT.world2D)
		{
			_rotation_ = rotation;
	        // match camera rotation with view rotation
			if (OT.world == OT.World.WorldSide2D)
			{
		        if (camera.transform.eulerAngles.z != rotation)
		        {
		            camera.transform.eulerAngles = new Vector3(0, 0, rotation);
		            transform.rotation = camera.transform.rotation;
					getRect = true;
		        }			
			}
			else
			{
		        if (camera.transform.eulerAngles.y != rotation)
		        {
		            camera.transform.eulerAngles = new Vector3(90, rotation,0);
		            transform.rotation = camera.transform.rotation;
					getRect = true;
		        }			
			}
		}
		
		if (getRect || _position_ != _position)
		{
			GetWorldRect();
			getRect = false;
			AdjustToWorldBounds();
	        if (_position_ != _position && OT.world2D)
	        {
	            _position_ = _position;
				if (OT.world == OT.World.WorldSide2D)
				{
		            if (camera.transform.position.x != _position.x || Camera.main.transform.position.y != _position.y || Camera.main.transform.position.z != cameraDepth)
		            {
				        // match camera and view postion
		                camera.transform.position = new Vector3(_position.x, _position.y, cameraDepth);
		                transform.position = camera.transform.position;
		            }
				}
				else
				{
		            if (camera.transform.position.x != _position.x || Camera.main.transform.position.z != _position.y || Camera.main.transform.position.y != cameraDepth)
		            {
				        // match camera and view postion
		                camera.transform.position = new Vector3(_position.x, cameraDepth, _position.y);
		                transform.position = camera.transform.position;
		            }
				}				
				UpdateWorldRect();
	        }
		}
		
#if UNITY_EDITOR
		if (recordPrefab && !Application.isPlaying)
		{
			UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
			recordPrefab = false;
		}
#endif		
				
    }

    void DrawRect(Rect r, Color c)
    {		
        Gizmos.color = c;
		if (OT.world == OT.World.WorldSide2D)
		{
	        Gizmos.DrawLine(new Vector3(r.xMin, r.yMin, 900), new Vector3(r.xMax, r.yMin, 900));
	        Gizmos.DrawLine(new Vector3(r.xMin, r.yMin, 900), new Vector3(r.xMin, r.yMax, 900));
	        Gizmos.DrawLine(new Vector3(r.xMax, r.yMin, 900), new Vector3(r.xMax, r.yMax, 900));
	        Gizmos.DrawLine(new Vector3(r.xMin, r.yMax, 900), new Vector3(r.xMax, r.yMax, 900));
		}
		else
		{
	        Gizmos.DrawLine(new Vector3(r.xMin, -900, r.yMin), new Vector3(r.xMax, -900, r.yMin));
	        Gizmos.DrawLine(new Vector3(r.xMin, -900, r.yMin), new Vector3(r.xMin, -900, r.yMax));
	        Gizmos.DrawLine(new Vector3(r.xMax, -900, r.yMin), new Vector3(r.xMax, -900, r.yMax));
	        Gizmos.DrawLine(new Vector3(r.xMin, -900, r.yMax), new Vector3(r.xMax, -900, r.yMax));
		}
    }

    void DrawView(Vector3 p1, Vector3 p2, Vector3 p3, Vector3 p4, Color c)
    {
        Gizmos.color = c;
        Gizmos.DrawLine(p1, p2);
        Gizmos.DrawLine(p1, p3);
        Gizmos.DrawLine(p2, p4);
        Gizmos.DrawLine(p3, p4);
    }

    Color Darker(Color c)
    {
        return new Color(c.r * 0.5f, c.g * 0.5f, c.b * 0.5f);
    }

    
    protected void OnDrawGizmos()
    {
		if (OT.world3D)
			return;
		
        if (drawGizmos)
        {
            DrawRect(worldBounds, Darker(gizmosColor));
            Rect r = worldRect;
			
			if (OT.world == OT.World.WorldSide2D)
			{
		        Vector3 gp1 = new Vector3(p1.x, p1.y, 900);
		        Vector3 gp2 = new Vector3(p2.x, p2.y, 900);
		        Vector3 gp3 = new Vector3(p3.x, p3.y, 900);
		        Vector3 gp4 = new Vector3(p4.x, p4.y, 900);
												
	            DrawView(gp1, gp2, gp3, gp4, Darker(gizmosColor));
					
	            gp1 = new Vector3(r.xMin, r.yMin, 900);
	            gp2 = new Vector3(r.xMax, r.yMin, 900);
	            gp3 = new Vector3(r.xMin, r.yMax, 900);
	            gp4 = new Vector3(r.xMax, r.yMax, 900);
				
            	DrawView(gp1,gp2,gp3,gp4, gizmosColor);
			}
			else
			{
		        Vector3 gp1 = new Vector3(p1.x, -900, p1.y);
		        Vector3 gp2 = new Vector3(p2.x, -900, p2.y);
		        Vector3 gp3 = new Vector3(p3.x, -900, p3.y);
		        Vector3 gp4 = new Vector3(p4.x, -900, p4.y);
				
	            DrawView(gp1, gp2, gp3, gp4, Darker(gizmosColor));
					
	            gp1 = new Vector3(r.xMin, -900, r.yMin);
	            gp2 = new Vector3(r.xMax, -900, r.yMin);
	            gp3 = new Vector3(r.xMin, -900, r.yMax);
	            gp4 = new Vector3(r.xMax, -900, r.yMax);
				
            	DrawView(gp1,gp2,gp3,gp4, gizmosColor);
			}

        }
    }

#if UNITY_EDITOR	
    void OnGUI()
    {
		if (!OT.isValid || OT.view == null)
			return;
		
		// we have to calculate the right Orthographic size because we
		// coud be in edit mode and just captured the right screen dimensions
		if (!Application.isPlaying)
		{
			if (OT.view.alwaysPixelPerfect)
			{
		        if (camera.orthographicSize != resSize * (Mathf.Pow(2, _zoom * -1)))
		            camera.orthographicSize = resSize * Mathf.Pow(2, _zoom * -1);
			}
		}		
        //GUI.Box(new Rect((Screen.width / 2) - 50, (Screen.height / 2) - 50, 100, 100), "");
    }
#endif

}