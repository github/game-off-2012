using UnityEngine;
using System.Collections;
 
public class OTScale9Sprite : OTSprite
{
	
	public enum SideFillType { 
		Scale, Repeat 
	};
	public OTScale9Margins _margins = new OTScale9Margins();
	
	// public SideFillType _fillSide = SideFillType.Scale;

    //-----------------------------------------------------------------------------
    // public attributes (get/set)
    //-----------------------------------------------------------------------------
	/*
    public SideFillType fillSide
	{
		get
		{
			return _fillSide;
		}
		set
		{
			if (value!=_fillSide)
			{
				_fillSide = value;			
				meshDirty = true;
			}
		}
	}
	*/
    public OTScale9Margins margins
	{
		get
		{
			return _margins;
		}
		set
		{
			_margins = value;			
			meshDirty = true;
		}
	}
		
    private OTScale9Margins _margins_;
	// private SideFillType _fillSide_ = SideFillType.Scale;
	
	Vector3[] verts = new Vector3[]{};
	Vector2[] _uv = new Vector2[]{};
	int[] tris = new int[]{};
	int Scale9Verts(int idx, float yp, float uvp)
	{
		int ix = 100;
		if (image!=null) ix = image.width;
				
		float maLeft = (_meshsize_.x * ((margins.left>=1)?(margins.left/ix):margins.left)) * (ix/_size.x) * OT.view.sizeFactor;
		float maRight = (_meshsize_.x * ((margins.right>=1)?(margins.right/ix):margins.right)) * (ix/_size.x) * OT.view.sizeFactor;
		
		float uvLeft =  ((margins.left>=1)?(margins.left/ix):margins.left);
		float uvRight = ((margins.right>=1)?(margins.right/ix):margins.right);
		
		_uv[idx] = new Vector2(0, uvp);
		verts[idx++] = new Vector3(mLeft, yp, 0);
		_uv[idx] = new Vector2(uvLeft, uvp);
		verts[idx++] = new Vector3(mLeft + maLeft , yp, 0);
		_uv[idx] = new Vector2(1-uvRight, uvp);
		verts[idx++] = new Vector3(mRight - maRight, yp, 0);
		_uv[idx] = new Vector2(1, uvp);
		verts[idx++] = new Vector3(mRight, yp, 0);												
		return idx;
	}
	
	int Scale9Face(int idx, int start, int vcount)
	{
		tris[idx++] = start;
		tris[idx++] = start+1;
		tris[idx++] = start+vcount;
		tris[idx++] = start+1;
		tris[idx++] = start+vcount+1;
		tris[idx++] = start+vcount;
		return idx;
	}
		
    protected override Mesh GetMesh()
    {
		Mesh mesh =InitMesh();
				
		int iy = 100;
		if (image!=null) iy = image.height;
		
		
		float maTop = (_meshsize_.y * ((margins.top>=1)?(margins.top/iy):margins.top)) * (iy/_size.y)* OT.view.sizeFactor;
		float maBottom = (_meshsize_.y * ((margins.bottom>=1)?(margins.bottom/iy):margins.bottom)) * (iy/_size.y) * OT.view.sizeFactor;

		float uvTop =  ((margins.top>=1)?(margins.top/iy):margins.top);
		float uvBottom = ((margins.bottom>=1)?(margins.bottom/iy):margins.bottom);
		
		verts = new Vector3[16];
		_uv = new Vector2[16];
		tris = new int[ 9 * 6 ];
		
		int idx = 0;
		idx = Scale9Verts(idx, mTop, 1);
		idx = Scale9Verts(idx, mTop - maTop, 1-uvTop);
		idx = Scale9Verts(idx, mBottom + maBottom, uvBottom);
		idx = Scale9Verts(idx, mBottom, 0);

		idx = 0;
		idx = Scale9Face(idx,0,4);
		idx = Scale9Face(idx,1,4);
		idx = Scale9Face(idx,2,4);
		idx = Scale9Face(idx,4,4);
		idx = Scale9Face(idx,5,4);
		idx = Scale9Face(idx,6,4);
		idx = Scale9Face(idx,8,4);
		idx = Scale9Face(idx,9,4);
		idx = Scale9Face(idx,10,4);
		
        mesh.vertices = verts;
        mesh.uv = _uv;		
        mesh.triangles = tris;
				

        mesh.RecalculateBounds();
        mesh.RecalculateNormals();
		
        return mesh;
    }
	
		
    //-----------------------------------------------------------------------------
    // overridden subclass methods
    //-----------------------------------------------------------------------------	
    
    protected override void CheckSettings()
    {
		Vector2 loc = transform.localScale;
		if (!_size.Equals(_size_) || !_size.Equals(loc))
			meshDirty = true;
		
        base.CheckSettings();			
		if (MarginsChanged() /* || _fillSide != _fillSide_ */ )
		{
			meshDirty = true;
			_margins_ = _margins;
			// _fillSide_ = _fillSide;
		}
    }

    
    protected override string GetTypeName()
    {
        return "Scale9";
    }
			
    protected override void HandleUV()
    {
        if (spriteContainer != null && spriteContainer.isReady)
        {
            OTContainer.Frame frame = spriteContainer.GetFrame(frameIndex);
            // adjust this sprites UV coords
            if (frame.uv != null && mesh != null)
            {								
				// splice UV that we got from the container.
                mesh.uv = frame.uv;
            }
        }
    }
	
	protected override void Clean()
	{
		base.Clean();					
	}

    //-----------------------------------------------------------------------------
    // class methods
    //-----------------------------------------------------------------------------		
	bool MarginsChanged()
	{
		return (!margins.Equals(_margins_));
	}
		
    
    protected override void Awake()
    {
        base.Awake();
		_margins_ = _margins;
		// _fillSide_ = _fillSide;
    }
	
	public void Rebuild()
	{
		meshDirty = true;
	}


    new void Start()
    {
        base.Start();
    }
	
    // Update is called once per frame
    new void Update()
    {
        base.Update();
    }
}

[System.Serializable]
public class OTScale9Margins
{
	public float top = 25;
	public float bottom = 25;
	public float left = 25;
	public float right = 25;
	
	public bool Equals(OTScale9Margins other)
	{
		return (top==other.top && bottom == other.bottom && left == other.left && right == other.right);
	}
}
