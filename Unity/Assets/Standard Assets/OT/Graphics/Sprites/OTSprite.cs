using UnityEngine;
using System.Collections;
 
/// <summary>
/// Provides functionality to use static sprites (images) to your scenes.
/// </summary>
public class OTSprite : OTObject
{		
    //-----------------------------------------------------------------------------
    // Editor settings
    //-----------------------------------------------------------------------------
    
    public bool _flipHorizontal = false;
    
    public bool _flipVertical = false;
    
    public bool _transparent = true;
    
    public bool _additive = false;
    
    public string _materialReference = "transparent";
    
    public Color _tintColor = Color.white;
    
    public float _alpha = 1.0f;
    
    public Texture _image = null;
    
    public int _frameIndex = 0;
	
    public string _frameName = "";
    
    public OTContainer _spriteContainer;	

    //-----------------------------------------------------------------------------
    // public attributes (get/set)
    //-----------------------------------------------------------------------------

    /// <summary>
    /// Flips sprite image horizontally
    /// </summary>
    public bool flipHorizontal
    {
        get
        {
            return _flipHorizontal;
        }
        set
        {
            _flipHorizontal = value;
            meshDirty = true;
            _flipHorizontal_ = _flipHorizontal;
            Update();
        }
    }

    /// <summary>
    /// Flips sprite image verically
    /// </summary>
    public bool flipVertical
    {
        get
        {
            return _flipVertical;
        }
        set
        {
            _flipVertical = value;
            meshDirty = true;
            _flipVertical_ = _flipVertical;
            Update();
        }
    }
	
    /// <summary>
    /// Sprite needs transparency support
    /// </summary>
    public bool transparent
    {
        get
        {
            return _transparent;
        }
        set
        {
            _transparent = value;
			Clean();
        }
    }
    /// <summary>
    /// Sprite needs additive transparency support
    /// </summary>
    public bool additive
    {
        get
        {
            return _additive;
        }
        set
        {
            _additive = value;
			Clean();
        }
    }

    /// <summary>
    /// Current texture of the sprite (image or spriteContainer)
    /// </summary>
    public Texture texture
    {
        get
        {
            if (spriteContainer != null)
                return spriteContainer.GetTexture();
            else
                return image;
        }
    }

    /// <summary>
    /// Default image texture for this sprite.
    /// </summary>
    public Texture image
    {
        get
        {
            return _image;
        }
        set
        {
            _image = value;
			CheckSettings();
			Clean();
        }
    }

    /// <summary>
    /// Sprite Container that will provide image information for this sprite
    /// </summary>
    public OTContainer spriteContainer
    {
        get
        {
            return _spriteContainer;
        }
        set
        {
            _spriteContainer = value;
			_containerName = "";
			Clean();
        }
    }

	/// <summary>
    /// Index of the frame that is used to get image information from the Sprite Container
    /// </summary>
    public int frameIndex
    {
        get
        {
            return _frameIndex;
        }
        set
        {
            _frameIndex = value;
			Clean();
        }
    }
	
	/// <summary>
    /// name of the frame that is used to get image information from the Sprite Container
    /// </summary>
    public string frameName
    {
        get
        {
            return _frameName;
        }
        set
        {			
            _frameName = value;
			Clean();
        }
    }

    
    public Material material
    {
        get
        {
            if (Application.isPlaying)
                return renderer.material;
            else
                return renderer.sharedMaterial;
        }
        set
        {
            assignedMaterial = true;
            if (Application.isPlaying)
                renderer.material = value;
            else
                renderer.sharedMaterial = value;
        }
    }

    /// <summary>
    /// Reference name of material for this sprite
    /// </summary>
    public string materialReference
    {
        get
        {
            return _materialReference;
        }
        set
        {
            _materialReference = value;
			Clean();
        }
    }

    /// <summary>
    /// Tinting color of this sprite.
    /// </summary>
    /// <remarks>
    /// This setting will only work if this sprite's materialReference can work with color tinting.
    /// </remarks>
    public Color tintColor
    {
        get
        {
            return _tintColor;
        }
        set
        {
            _tintColor = value;
			Clean();
        }
    }
    /// <summary>
    /// Alpha channel for this sprite.
    /// </summary>
    /// <remarks>
    /// This setting will only work if this sprite's materialReference can work with alpha channels/color.
    /// </remarks>
    public float alpha
    {
        get
        {
            return _alpha;
        }
        set
        {
            _alpha = value;
			Clean();
        }
    }
	
	
	[HideInInspector]
	public string _containerName = "";
	[HideInInspector]
	public bool _newSprite = true;
	
    //-----------------------------------------------------------------------------
    // protected and private  fields
    //-----------------------------------------------------------------------------
    protected OTContainer _spriteContainer_ = null;
    int _frameIndex_ = 0;
    string _frameName_ = "";
    bool _flipHorizontal_ = false;
    bool _flipVertical_ = false;
    protected Texture _image_ = null;
    bool _transparent_ = true;
    Color _tintColor_ = Color.white;
    float _alpha_ = 1;
    bool _additive_ = false;
    string _materialReference_ = "transparent";
    string lastMatName = "";
    Material lastMat = null;
    OTMatRef mr;
    bool assignedMaterial = false;
	bool spriteInvalid  = false;
	
    //-----------------------------------------------------------------------------
    // public methods
    //-----------------------------------------------------------------------------

    /// <summary>
    /// Retrieve frame data of the sprite's current frame. This data will include the
    /// texture scale, texture offset and uv coordinates that are needed to get the
    /// current frame's image.
    /// </summary>
    /// <returns>frame data of sprite's current frame</returns>
    public OTContainer.Frame CurrentFrame()
    {
        if (spriteContainer != null && spriteContainer.isReady)
            return spriteContainer.GetFrame(frameIndex);
        else
        {
            if (spriteContainer == null)
                throw new System.Exception("No Sprite Container available [" + name + "]");
            else
                throw new System.Exception("Sprite Container not ready [" + name + "]");
        }
    }

    
    public override void StartUp()
    {
        isDirty = true;
        lastMatName = GetMatName();
        Material mat = OT.LookupMaterial(lastMatName);				
		lastMat = mat;		
        if (mat != null)
        {
            renderer.material = mat;
            HandleUV();
        }
        base.StartUp();
    }

    
    public override void Assign(OTObject protoType)
    {
        base.Assign(protoType);
        OTSprite pSprite = protoType as OTSprite;
        tintColor = pSprite.tintColor;
        alpha = pSprite.alpha;
        image = pSprite.image;
        spriteContainer = pSprite.spriteContainer;
        frameIndex = pSprite.frameIndex;
        materialReference = pSprite.materialReference;
    }

	
	protected float mLeft = 0,mRight = 0,mTop = 0, mBottom = 0;
	
	protected Vector2 _meshsize_ = Vector2.one;
	
	protected Mesh InitMesh()
	{
        Mesh mesh = new Mesh();		
        _meshsize_ = Vector2.one;

        _meshsize_ = Vector2.one;
        _pivotPoint = pivotPoint;

		float dx = (_meshsize_.x/2);
		float dy = (_meshsize_.y/2);
		float px =  _pivotPoint.x;
		float py =  _pivotPoint.y;						
		
		mTop = dy - py;
		mLeft = -dx - px;
		mBottom = -dy - py;
		mRight = dx - px;
		
		return mesh;		
	}

    //-----------------------------------------------------------------------------
    // overridden subclass methods
    //-----------------------------------------------------------------------------
    
    protected override Mesh GetMesh()
    {
		Mesh mesh = InitMesh();
		
        mesh.vertices = new Vector3[] { 
                new Vector3(mLeft, mTop, 0),		// topleft
                new Vector3(mRight, mTop, 0),		// topright
                new Vector3(mRight, mBottom, 0),		// botright
                new Vector3(mLeft, mBottom, 0)	// botleft
            };        
		mesh.triangles = new int[] { 
                0,1,2,2,3,0
            };

        Vector2[] meshUV = new Vector2[] { 
            new Vector2(0,1), new Vector2(1,1), 
            new Vector2(1,0), new Vector2(0,0) };

        if (flipHorizontal)
        {
            Vector2 v;
            v = meshUV[0];
            meshUV[0] = meshUV[1]; meshUV[1] = v;
            v = meshUV[2];
            meshUV[2] = meshUV[3]; meshUV[3] = v;
        }

        if (flipVertical)
        {
            Vector2 v;
            v = meshUV[0];
            meshUV[0] = meshUV[3]; meshUV[3] = v;
            v = meshUV[1];
            meshUV[1] = meshUV[2]; meshUV[2] = v;
        }

        mesh.uv = meshUV;
		
        return mesh;
    }

    
    protected override string GetTypeName()
    {
        return "Sprite";
    }

    
    protected override void AfterMesh()
    {
        base.AfterMesh();
        // reset size because mesh has been created with a size (x/y) of 1/1
        size = _size;
        _frameIndex_ = -1;
        _frameName_ = "";
        isDirty = true;
    }	
	
    public virtual string GetMatName()
    {
        string matName = "";

        if (spriteContainer != null)
           matName += "spc:" + spriteContainer.name + ":" + materialReference;
        else
            if (image != null)
                matName += "img:" + _image.GetInstanceID() + " : " +
                    materialReference;
        if (matName == "") matName = materialReference;

        if (mr != null)
        {
            if (mr.fieldColorTint != "")
                matName += " : " + tintColor.ToString();
            if (mr.fieldAlphaChannel != "" || mr.fieldAlphaColor != "")
                matName += " : " + alpha;
        }
        return matName;
    }

    private void SetMatReference()
    {
        if (transparent)
            _materialReference = "transparent";
        else
            if (additive)
                _materialReference = "additive";
            else
                if (_materialReference == "additive" || _materialReference == "transparent" || _materialReference == "")
                    _materialReference = "solid";
    }

    
    override protected void CheckDirty()
    {		
        base.CheckDirty();
		
        if (spriteContainer != null)
        {
            if (spriteContainer.isReady)
            {				
                if (_spriteContainer_ != spriteContainer || _frameIndex_ != frameIndex || _frameName_ != frameName)
                    isDirty = true;
            }
        }
        else
            if (_spriteContainer_ != null || image != _image_)
                isDirty = true;

        if (flipHorizontal != _flipHorizontal_ || flipVertical != _flipVertical_)
        {
            _flipHorizontal_ = flipHorizontal;
            _flipVertical_ = flipVertical;
            meshDirty = true;
        }

        if (!Application.isPlaying)
        {
            if (!isDirty && spriteContainer != null && material.mainTexture != spriteContainer.GetTexture())
                isDirty = true;
        }

        if (transparent != _transparent_ && transparent)
        {
            _additive = false;
            _additive_ = additive;
            _transparent_ = transparent;
            SetMatReference();
        }
        else
            if (additive != _additive_ && additive)
            {
                _transparent = false;
                _additive_ = additive;
                _transparent_ = transparent;
                SetMatReference();
            }
            else
                if (!_additive && !_transparent)
                {
                    _additive_ = additive;
                    _transparent_ = transparent;
                    if (_materialReference == "transparent" || _materialReference == "additive")
                        _materialReference = "solid";
                }



        if (materialReference != _materialReference_)
        {
            mr = OT.GetMatRef(materialReference);
            if (_materialReference == "transparent")
            {
                _transparent = true;
                _additive = false;
            }
            else
                if (_materialReference == "additive")
                {
                    _transparent = false;
                    _additive = true;
                }
                else
                {
                    _transparent = false;
                    _additive = false;
                }
            isDirty = true;
        }

        if (mr != null)
        {
            if (_tintColor_ != tintColor)
            {
                if (mr.fieldColorTint != "")
                    isDirty = true;
                else
                {
                    _tintColor = Color.white;
                    _tintColor_ = _tintColor;
                    Debug.LogWarning("Orthello : TintColor can not be set on this materialReference!");
                }
            }
            if (_alpha_ != alpha)
            {
                if (mr.fieldAlphaColor != "" || mr.fieldAlphaChannel != "")
                    isDirty = true;
                else
                {
                    _alpha = 1;
                    _alpha_ = 1;
                    Debug.LogWarning("Orthello : Alpha value can not be set on this materialReference!");
                }
            }
        }

    }
	
	
	protected Vector2[] SpliceUV(Vector2[] uv, float[] pos, bool horizontal)
	{
		if (pos.Length<=2)
			return uv;
		
		Vector2 tl = uv[0];
		Vector2 tr = uv[1];
		Vector2 bl = uv[3];
																			
		Vector2[] _uv = new Vector2[pos.Length * 2];
		for (int vr=0; vr<pos.Length; vr++)
		{
			float vi = pos[vr];
			if (vr==0) vi=0;
			if (vr == pos.Length-1) vi=100;
			
			if (horizontal)
			{
				float dd = ((tr.x-tl.x)/100f) * vi;
				
				int vp = vr;
				if (flipHorizontal) 
					vp = (pos.Length-1-vr);
				
				Vector2 p1 = new Vector2(tl.x+dd,tl.y);
				Vector2 p2 = new Vector2(bl.x+dd,bl.y);
				if (flipVertical)
				{
					Vector2 ps = p1;
					p1 = p2;
					p2 = ps;
				}
								
				_uv[vp * 2] = p1;
				_uv[vp * 2+1] = p2;
			}
			else
			{
				float dd = ((tl.y-bl.y)/100f) * vi;
				
				int vp = vr;
				if (flipVertical) 
					vp = (pos.Length-1-vr);
				
				Vector2 p1 = new Vector2(tl.x,tl.y-dd);
				Vector2 p2 = new Vector2(tr.x,tr.y-dd);
								
				if (flipHorizontal)
				{
					Vector2 ps = p1;
					p1 = p2;
					p2 = ps;
				}
									
				_uv[vp * 2] = p1;
				_uv[vp * 2+1] = p2;
			}
		}										
		return _uv;
	}
		
	

    protected virtual void HandleUV()
    {		
        if (spriteContainer != null && spriteContainer.isReady)
        {								
            OTContainer.Frame frame = spriteContainer.GetFrame(frameIndex);						
            // adjust this sprites UV coords
            if (frame.uv != null && mesh != null)
            {
                Vector2[] meshUV = frame.uv.Clone() as Vector2[];				
				if (meshUV.Length == mesh.vertexCount)
				{				
		                if (flipHorizontal)
		                {
		                    Vector2 v;
		                    v = meshUV[0];
		                    meshUV[0] = meshUV[1]; meshUV[1] = v;
		                    v = meshUV[2];
		                    meshUV[2] = meshUV[3]; meshUV[3] = v;
		                }
		
		                if (flipVertical)
		                {
		                    Vector2 v;
		                    v = meshUV[0];
		                    meshUV[0] = meshUV[3]; meshUV[3] = v;
		                    v = meshUV[1];
		                    meshUV[1] = meshUV[2]; meshUV[2] = v;
		                }	
		                mesh.uv = meshUV;
				}
            }
        }
    }

    
    protected virtual Material InitMaterial()
    {		
		OTDebug.Message("@-->InitMaterial-In()","ot-mat");			
		
        if (spriteContainer != null && !spriteContainer.isReady)
        {
			// if we have a non-ready sprite container
			// lets use the current assigned and scene saved material 												
            lastMat = material;			
            assignedMaterial = false;
			isDirty = true;
            return lastMat;
        }
		
		// correct _frameIndex
		if (spriteContainer!=null && _frameIndex>spriteContainer.frameCount-1)
			_frameIndex = spriteContainer.frameCount-1;
				
		// Get the new material base instance
        Material spMat = OT.GetMaterial(_materialReference, tintColor, alpha);
		// If we couldn't generate the material lets take our 'default' transparent
        if (spMat == null) spMat = OT.materialTransparent;
        if (spMat == null) return null;
		// lets create a unique material instance belonging to this
		// material name. This will be cached so other sprites that use
		// the same material name will use the same and will get batched 
		// automaticly
        Material mat = new Material(spMat);
				
        if (spriteContainer != null && spriteContainer.isReady)
        {
			// setup the sprite material hooked to the sprite container
            Texture tex = spriteContainer.GetTexture();
            if (mat.mainTexture != tex)
                mat.mainTexture = tex;
            mat.mainTextureScale = Vector2.one;
           	mat.mainTextureOffset = Vector2.zero;
            HandleUV();
        }
        else
        if (image != null)
        {
			// setup the sprite material hooked to the image texture
            if (mat != null)
            {
                mat.mainTexture = image;
                mat.mainTextureScale = Vector2.one;
                mat.mainTextureOffset = Vector3.zero;
            }
        }

        if (mat != null)
        {
			// if we had a previous created material assigned we have to decrease
			// the material cache count
            if (lastMatName != "" && lastMat != null)
                OT.MatDec(lastMat, lastMatName);				
			
			// because we are recreating the material the first time
			// we will have to destroy the current material or it
			// will start floating
            if (lastMat == null && !assignedMaterial && !isCopy)
            {
				if (renderer!=null)
				{
	                if (!Application.isPlaying)
	                    DestroyImmediate(renderer.sharedMaterial, true);
	                else
	                    Destroy(renderer.material);
				}
            }
			
			// assign the new material to the renderer
            if (Application.isPlaying) 
				renderer.material = mat;
            else
                renderer.sharedMaterial = mat;

			// store this material as the last material
            lastMat = mat;
			lastMatName = GetMatName();

			// we created/cached this material so it was not assigned
            assignedMaterial = false;
        }
		OTDebug.Message("@<--InitMaterial()","ot-mat");			
        return mat;
    }

	protected bool adjustFrameSize = true;
    protected override void Clean()
    {
        if (!OT.isValid || mesh == null) return;
        base.Clean();	
						
        if (_spriteContainer_ != spriteContainer ||
            _frameIndex_ != frameIndex ||
			_frameName_ != frameName ||
            _image_ != image ||
            _tintColor_ != tintColor ||
            _alpha_ != alpha ||
            _materialReference_ != _materialReference ||
            isCopy)
        {					
            if (spriteContainer != null && spriteContainer.isReady)
            {
				
				if (_frameName_ != frameName)
					_frameIndex = spriteContainer.GetFrameIndex(frameName);
													
                if (frameIndex < 0) _frameIndex = 0;
                if (frameIndex > spriteContainer.frameCount - 1) _frameIndex = spriteContainer.frameCount - 1;

				// set frame name
				OTContainer.Frame fr = CurrentFrame();
				if (fr.name!="" && (frameName == "" || fr.name.IndexOf(frameName)!=0))
					_frameName = fr.name;
									
                if (spriteContainer is OTSpriteAtlas)
                {
					if (adjustFrameSize)
					{												
	                    if ((spriteContainer as OTSpriteAtlas).offsetSizing)
	                    {
	                        if (Vector2.Equals(oSize, Vector2.zero))
	                        {
	                            oSize = fr.size * OT.view.sizeFactor;
	                            Vector2 nOffset = fr.offset * OT.view.sizeFactor;
	                            if (_baseOffset.x != nOffset.x || _baseOffset.y != nOffset.y)
	                            {
	                                offset = nOffset;
	                                position = _position;
	                                imageSize = fr.imageSize * OT.view.sizeFactor;
	                            }
	                        }
	                        if (_frameIndex_ != frameIndex || _spriteContainer_ != spriteContainer)
	                        {
								float _sx = (size.x / oSize.x);
								float _sy = (size.y / oSize.y);
	                            Vector2 sc = new Vector2(_sx * fr.size.x * OT.view.sizeFactor, _sy * fr.size.y * OT.view.sizeFactor);
	                            Vector3 sc3 = new Vector3(sc.x, sc.y, 1);
	
	                            _size = sc;
	                            if (!Vector3.Equals(transform.localScale, sc3))
	                               transform.localScale = sc3;
	                            oSize = fr.size * OT.view.sizeFactor;
								
	                            imageSize = new Vector2(_sx * fr.imageSize.x * OT.view.sizeFactor, _sy * fr.imageSize.y * OT.view.sizeFactor);								
	                            Vector2 nOffset = new Vector2(_sx * fr.offset.x * OT.view.sizeFactor, _sy * fr.offset.y * OT.view.sizeFactor);
								
                                offset = nOffset;
                                position = _position;
	                        }
	                    }
	                    else
	                    {
	                        Vector3[] verts = fr.vertices.Clone() as Vector3[];
	                        verts[0] -= new Vector3(pivotPoint.x, pivotPoint.y, 0);
	                        verts[1] -= new Vector3(pivotPoint.x, pivotPoint.y, 0);
	                        verts[2] -= new Vector3(pivotPoint.x, pivotPoint.y, 0);
	                        verts[3] -= new Vector3(pivotPoint.x, pivotPoint.y, 0);
	                        mesh.vertices = verts;
	
	                        _size = fr.size;
	                        Vector3 sc3 = new Vector3(_size.x, _size.y, 1);
	                        if (!Vector3.Equals(transform.localScale, sc3))
	                            transform.localScale = sc3;
	                    }
					}
                }
				
            }
			
			// keep old and get new material name								
			string cMatName = GetMatName();															
			if (lastMatName!=cMatName)
			{														
				// material name has changed to look it up
	            Material mat = OT.LookupMaterial(cMatName);				
				// if we could not find the material let create a new one
	            if (mat == null)
	                mat = InitMaterial();					
	            else
	            {
					// if we had a previous generated material lets
					// decrease its use
					if (lastMat!=null && lastMatName!="")
						OT.MatDec(lastMat,lastMatName);
	                renderer.material = mat;
	                HandleUV();					
					lastMat = mat;
					lastMatName = cMatName;
	            }							
				// increase the current material's use
	           	OT.MatInc(mat, cMatName);				
			}
			else
			{
				if (_frameIndex_ != frameIndex)
	               HandleUV();
			}									
			
	        _spriteContainer_ = spriteContainer;
	        _materialReference_ = materialReference;
	        _frameIndex_ = frameIndex;
			_frameName_ = frameName;
	        _image_ = image;
	        _tintColor_ = tintColor;
	        _alpha_ = alpha;				
		}
		
		

        isDirty = false;
        if (spriteContainer != null && !spriteContainer.isReady)
            isDirty = true;
		
#if UNITY_EDITOR
		if (!Application.isPlaying)
			UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
#endif			
				
    }

    
    new protected void OnDestroy()
    {
        if (lastMatName != "" && lastMat != null)
            OT.MatDec(lastMat, lastMatName);
        else
            DestroyImmediate(material);
        base.OnDestroy();
    }

    
    protected Vector2 baseSize = Vector2.zero;
	bool frameReloaded  = false;
    
    override protected void CheckSettings()
    {
        base.CheckSettings();
        if (Application.isEditor || OT.dirtyChecks || dirtyChecks)
        {
            if (spriteContainer != null && spriteContainer.isReady)
            {		
				if (baseSize.Equals(Vector2.zero) || _newSprite)
					baseSize = _size;
				_newSprite = false;
												
				if (spriteContainer is OTSpriteAtlasImport && (spriteContainer as OTSpriteAtlasImport).reloadFrame && !frameReloaded)
				{
					_frameIndex_ = -1;	
					frameReloaded = true;
				}
								
                if (frameIndex < 0) _frameIndex = 0;
                if (frameIndex > spriteContainer.frameCount - 1) _frameIndex = spriteContainer.frameCount - 1;
				
				OTContainer.Frame fr = CurrentFrame();
				if (_spriteContainer_ == null && _containerName != "")
				{					
					// set basesize to current frame size if we just had a lookup from a prefab					
					baseSize = fr.size;
				}	
				_containerName = spriteContainer.name;

                if (_spriteContainer_ != spriteContainer && adjustFrameSize)
					ResizeFrame();
				baseSize = fr.size;
            }
            else
            {
				if (_spriteContainer_ != null && _spriteContainer == null)
				{
					_containerName = "";				
				}
				
		        if (_image_ != image) 
				{
					if (!baseSize.Equals(Vector2.zero))							
		               size =  new Vector2 (size.x * (image.width / baseSize.x) , size.y * (image.height / baseSize.y) ) * OT.view.sizeFactor;
					else
		            	size = new Vector2(image.width, image.height) * OT.view.sizeFactor;
					baseSize = new Vector2(image.width, image.height);
				}				
				
            }
            if (alpha < 0) _alpha = 0;
            else
                if (alpha > 1) _alpha = 1;
        }
}


    //-----------------------------------------------------------------------------
    // class methods
    //-----------------------------------------------------------------------------
    // Use this for initialization

    
    protected override void Awake()
    {
		if (_frameIndex<0) 
			_frameIndex = 0;
		
        _spriteContainer_ = spriteContainer;
        _frameIndex_ = frameIndex;
		_frameName_ = frameName;
        _image_ = image;
        _materialReference_ = materialReference;
        _transparent_ = transparent;
        _flipHorizontal_ = flipHorizontal;
        _flipVertical_ = flipVertical;
        _tintColor_ = _tintColor;
        _alpha_ = _alpha;
        isDirty = true;
				
		if (image!=null)
			baseSize = new Vector2(image.width, image.height);
		
		if (_spriteContainer != null || image!=null)
			_newSprite = false;
				
        base.Awake();
    }


    public Material GetMat()
	{
        Material mat = OT.LookupMaterial(lastMatName);
		if (mat != null)
        {
			OTDebug.Message("GetMat -> Found","ot-mat");			
            renderer.material = mat;
            HandleUV();
        }
        else
		{
			OTDebug.Message("GetMat -> Not Found","ot-mat");						
            mat = InitMaterial();
		}
		
		OTDebug.Message("@OT.MatInc - GetMat()","ot-mat");
        OT.MatInc(mat, lastMatName);
				
		lastMat = mat;					
		return mat;
	}
	
	
    protected override void Start()
    {
        mr = OT.GetMatRef(materialReference);
		lastMatName = GetMatName();
        base.Start();
        if (!Application.isPlaying || (Application.isPlaying && !assignedMaterial))
			material = GetMat();

        if (Application.isPlaying)
            _frameIndex_ = -1;
    }


	void ResizeFrame()
	{
		OTContainer.Frame fr = CurrentFrame();
		oSize = fr.size;
		if (!baseSize.Equals(Vector2.zero))							
            size =  new Vector2(size.x * (fr.size.x / baseSize.x) , size.y * (fr.size.y / baseSize.y) ) * OT.view.sizeFactor;
		else
          size = fr.size * OT.view.sizeFactor;
		baseSize = fr.size;
	}
	
	int _frameStartIndex = -1;
	public void  InvalidateSprite()
	{
		spriteInvalid = true;
		otRenderer.enabled = false;
		if (spriteContainer!=null)
			_frameStartIndex = _frameIndex;		
        if (otTransform.childCount > 0)
        {									
			hiddenRenderers.Clear();
            Renderer[] renderers = gameObject.GetComponentsInChildren<Renderer>();			
            for (int r = 0; r < renderers.Length; r++)
			{
				if (renderers[r].enabled)
					hiddenRenderers.Add(renderers[r]);
                renderers[r].enabled = false;
			}
        }		
	}
	
	public bool isInvalid
	{
		get
		{
			return spriteInvalid;
		}
	}
	
	public void IsValid()
	{
		spriteInvalid = false;
	}
	
	bool SpriteValid()
	{			
		if (!spriteInvalid)
			return true;
		
		if (spriteInvalid)
		{
			if (!Application.isPlaying || _image != null || (spriteContainer!=null && spriteContainer.isReady))
			{				
				spriteInvalid = false;								
				if ((spriteContainer!=null && spriteContainer.isReady) && adjustFrameSize && _frameStartIndex>=0)
				{
					baseSize = spriteContainer.GetFrame(_frameStartIndex).size;
					ResizeFrame();	
				}
				
				if (!otRenderer.enabled)
				{					
					otRenderer.enabled = true;
	                if (transform.childCount > 0)
	                {
	                    Renderer[] renderers = gameObject.GetComponentsInChildren<Renderer>();
	                    for (int r = 0; r < renderers.Length; r++)
	                        renderers[r].enabled = true;
	                }				
				}
				return true;
			}
			return false;		
		}			
		return true;
	}
		
	
	
    // Update is called once per frame
    protected override void Update()
    {	
        if (!OT.isValid) return;
		
		if (spriteInvalid)
			SpriteValid();		
		
		if (image == null && _spriteContainer_ == null)
		{
			if (_containerName!="")
			{
				OTContainer c = OT.ContainerByName(_containerName);
				if (c!=null && c.isReady) 
					spriteContainer = c;					
			}
		}
							
        // check if no material has been assigned yet
        if (!Application.isPlaying)
        {
            Material mat = material;
            if (mat == null)
            {
                mat = new Material(OT.materialTransparent);
                material = mat;
                mat.mainTexture = texture;
            }	
			
        }
		
        base.Update();
						
    }

}