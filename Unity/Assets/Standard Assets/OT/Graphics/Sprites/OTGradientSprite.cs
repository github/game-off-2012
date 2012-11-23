using UnityEngine;
using System.Collections;
 
/// <summary>
/// Provides functionality to use sprites in your scenes that display a multi-coloured gradient
/// </summary>
public class OTGradientSprite : OTSprite
{
	/// <summary>
	/// Gradient orientation enumeration
	/// </summary>
	public enum GradientOrientation { 
		/// <summary>
		/// Vertical gradient orientation
		/// </summary>
		Vertical, 
		/// <summary>
		/// Horizontal gradient orientation
		/// </summary>
		Horizontal 
	}
	
    //-----------------------------------------------------------------------------
    // Editor settings
    //-----------------------------------------------------------------------------
	
	public GradientOrientation _gradientOrientation = GradientOrientation.Vertical;
	
    public OTGradientSpriteColor[] _gradientColors;
	
    //-----------------------------------------------------------------------------
    // public attributes (get/set)
    //-----------------------------------------------------------------------------
	/// <summary>
	/// Gets or sets the gradient orientation.
	/// </summary>
	/// <value>
	/// The gradient orientation.
	/// </value>
    public GradientOrientation gradientOrientation
	{
		get
		{
			return _gradientOrientation;
		}
		set
		{
			if (value!=_gradientOrientation)
			{
				_gradientOrientation = value;			
				meshDirty = true;

				isDirty = true;
			}
		}
	}
	/// <summary>
	/// Gets or sets the gradient colors.
	/// </summary>
	/// <value>
	/// An array with OTGradientSpriteColor elements
	/// </value>
    public OTGradientSpriteColor[] gradientColors
	{
		get
		{
			return _gradientColors;
		}
		set
		{
			_gradientColors = value;			
			meshDirty = true;			
			isDirty = true;
		}
	}
	
    private OTGradientSpriteColor[] _gradientColors_;
	private GradientOrientation _gradientOrientation_ = GradientOrientation.Vertical;
		
	void GradientVerts(int vr, int vp, int pos)
	{
		if (_gradientOrientation == GradientOrientation.Horizontal)
		{
			float dd = (_meshsize_.x/100) * (_gradientColors[vr].position + pos);							
			verts[vp * 2] = new Vector3(mLeft + dd, mTop , 0); 	// top
			verts[(vp * 2) +1] = new Vector3(mLeft + dd, mBottom , 0);		// bottom
		}
		else
		{
			float dd = (_meshsize_.y/100) * (_gradientColors[vr].position + pos);
			verts[vp * 2] = new Vector3(mLeft, mTop - dd , 0); 	// left
			verts[(vp * 2) +1] = new Vector3(mRight, mTop - dd , 0);		// right
		}
	}
	
	Vector3[] verts = new Vector3[]{};
	/// <exclude/>
    protected override Mesh GetMesh()
    {		
		Mesh mesh = InitMesh();
				
		int count = _gradientColors.Length;		
		for (int vr=0; vr<_gradientColors.Length; vr++)
			if (_gradientColors[vr].size>0)
				count++;
				
		verts = new Vector3[count * 2];
		int vp = 0;
		for (int vr=0; vr<_gradientColors.Length; vr++)
		{
			GradientVerts(vr,vp++,0);
			if (_gradientColors[vr].size>0)
				GradientVerts(vr,vp++,_gradientColors[vr].size);
		}		
        mesh.vertices = verts;

		int[] tris = new int[(count-1) * 6];
		for (int vr=0; vr<count-1; vr++)
		{
			int vv = vr*2;
			if (_gradientOrientation == GradientOrientation.Horizontal)
			{
				int[] _tris = new int[] { vv,vv+2,vv+3,vv+3,vv+1,vv };
				_tris.CopyTo(tris, vr * 6);
			}
			else
			{
				int[] _tris = new int[] { vv,vv+1,vv+3,vv+3,vv+2,vv };
				_tris.CopyTo(tris, vr * 6);
			}
		}		
		
        mesh.triangles = tris;

		float[] gradientPositions = new float[count];
		vp = 0;
		for(int g = 0; g<gradientColors.Length; g++)
		{
			gradientPositions[vp] = gradientColors[g].position;					
			vp++;
			if (gradientColors[g].size>0)
			{
				gradientPositions[vp] = gradientColors[g].position + gradientColors[g].size;									
				vp++;
			}
		}
				
        mesh.uv = SpliceUV(
			new Vector2[] { 
				new Vector2(0,1), new Vector2(1,1), new Vector2(1,0), new Vector2(0,0)
			},gradientPositions, _gradientOrientation == GradientOrientation.Horizontal);
		
        return mesh;
    }
	
	
	void CloneGradientColors()
	{
		_gradientColors_ = new OTGradientSpriteColor[_gradientColors.Length];
		for (int c=0; c<_gradientColors.Length; c++)
		{
			_gradientColors_[c] = new OTGradientSpriteColor();
			_gradientColors_[c].position = _gradientColors[c].position;
			_gradientColors_[c].size = _gradientColors[c].size;
			_gradientColors_[c].color = _gradientColors[c].color;
		}		
	}
	
    //-----------------------------------------------------------------------------
    // overridden subclass methods
    //-----------------------------------------------------------------------------	
    
    protected override void CheckDirty()
    {
		base.CheckDirty();
		
		if (_gradientColors.Length!=_gradientColors_.Length || GradientMeshChanged() || _gradientOrientation_ != _gradientOrientation)
			meshDirty = true;			
		else
		if (GradientColorChanged())
			isDirty = true;
	}
	
	protected override void CheckSettings()
    {
        base.CheckSettings();
				
		if (_gradientColors.Length<2)
			System.Array.Resize(ref _gradientColors,2);
    }
	    
    protected override string GetTypeName()
    {
        return "Gradient";
    }
			
	/// <exclude/>
    protected override void HandleUV()
    {
        if (spriteContainer != null && spriteContainer.isReady)
        {
            OTContainer.Frame frame = spriteContainer.GetFrame(frameIndex);
            // adjust this sprites UV coords
            if (frame.uv != null && mesh != null)
            {								
				int count = _gradientColors.Length;		
				for (int vr=0; vr<_gradientColors.Length; vr++)
					if (_gradientColors[vr].size>0)
						count++;
				
				// get positions for UV splicing
				float[] gradientPositions = new float[count];
				int vp = 0;
				for(int g = 0; g<gradientColors.Length; g++)
				{
					gradientPositions[vp] = gradientColors[g].position;					
					vp++;
					if (gradientColors[g].size>0)
					{
						gradientPositions[vp] = gradientColors[g].position + gradientColors[g].size;									
						vp++;
					}
				}
				// splice UV that we got from the container.
                mesh.uv = SpliceUV(frame.uv.Clone() as Vector2[],gradientPositions,gradientOrientation == GradientOrientation.Horizontal);
            }
        }
    }
	
	/// <exclude/>
	protected override void Clean()
	{
		base.Clean();
		if (mesh == null) return;
		
		_gradientColors[0].position = 0;
		_gradientColors[_gradientColors.Length-1].position = 100-_gradientColors[_gradientColors.Length-1].size;					
		CloneGradientColors();
		_gradientOrientation_ = _gradientOrientation;
		
		var colors = new Color[mesh.vertexCount];
		int vp = 0;
		for (int c=0; c<_gradientColors.Length; c++)
		{
			if (vp < mesh.vertexCount/2)
			{			
				colors[(vp*2)] = _gradientColors[c].color;
				colors[(vp*2)+1] = _gradientColors[c].color;								
			}
			vp++;
			if (_gradientColors[c].size>0 && vp < mesh.vertexCount/2)
			{
				colors[(vp*2)] = _gradientColors[c].color;
				colors[(vp*2)+1] = _gradientColors[c].color;								
				vp++;
			}			
		}
					
		mesh.colors = colors;
		
	}

    //-----------------------------------------------------------------------------
    // class methods
    //-----------------------------------------------------------------------------	
	bool GradientMeshChanged()
	{
		bool res = false;
		for (int c = 0; c < _gradientColors.Length; c++)
		{
			if (_gradientColors[c].position < 0) _gradientColors[c].position = 0;
			if (_gradientColors[c].position > 100) _gradientColors[c].position = 100;
			if (_gradientColors[c].size < 0) _gradientColors[c].size = 0;
			if (_gradientColors[c].size > 100) _gradientColors[c].size = 100;
			if (_gradientColors[c].position+_gradientColors[c].size > 100) 
				_gradientColors[c].position = 100-_gradientColors[c].size;
			
			if (_gradientColors[c].position!=_gradientColors_[c].position || _gradientColors[c].size!=_gradientColors_[c].size)
				res = true;			
		}
		return res;	
	}
	
	bool GradientColorChanged()
	{
		for (int c = 0; c < _gradientColors.Length; c++)
		{
			if (!_gradientColors[c].color.Equals(_gradientColors_[c].color))
			{
				return true;			
			}
		}
		return false;	
	}
		
    
    protected override void Awake()
    {
		CloneGradientColors();
		_gradientOrientation_ = _gradientOrientation;
        base.Awake();
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

/// <summary>
/// OT gradient sprite color element
/// </summary>
[System.Serializable]
public class OTGradientSpriteColor
{
	/// <summary>
	/// The position of the color (0-100)
	/// </summary>
	public int position = 0;
	/// <summary>
	/// The size of solid color area (0-100)
	/// </summary>
	public int size = 0;
	/// <summary>
	/// The color of this element
	/// </summary>
	public Color color = Color.white;
}