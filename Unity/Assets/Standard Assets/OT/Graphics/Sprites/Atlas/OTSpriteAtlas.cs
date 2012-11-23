 using UnityEngine;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// Sprite container with frames that can have different sizes
/// </summary>
public class OTSpriteAtlas : OTContainer
{
    
    
    public Vector2 _sheetSize = Vector2.zero;
    /// <summary>
    /// Spritesheet's texture
    /// </summary>
    public Texture texture;
    /// <summary>
    /// Info about the frames on the atlas
    /// </summary>
    public OTAtlasData[] atlasData = new OTAtlasData[] {};
	
	[HideInInspector]
    /// <summary>
    /// Use position offset and sizing with trimmed frames
    /// </summary>
    /// <remarks>
    /// If set to false, no offsetting and resizing will be implemented,
    /// the vertices of the frames image locations will be pre-rendered
    /// and assigned when this frame is requested.
    /// </remarks>
    public bool offsetSizing = true;
	
	
	[HideInInspector]
	public string metaType = "";
	[HideInInspector]
	public OTAtlasMetaData[] metaData;

    Vector2 _sheetSize_ = Vector2.zero;
	Texture _texture = null;

    /// <summary>
    /// Original sheet size
    /// </summary>
    /// <remarks>
    /// This setting is optional and only used in combination with frameSize when
    /// the frames do not exactly fill up the texture horizontally and/or vertically.
    /// <br></br><br></br>
    /// Sometimes a sheet has some left over space to the right or bottom of the
    /// texture that was used. By setting the original sheetSize and the frameSize, 
    /// the empty left-over space can be calculated and taken into account when
    /// setting the texture scaling and frame texture offsetting.
    /// </remarks>
    public Vector2 sheetSize
    {
        get
        {
            return _sheetSize;
        }
        set
        {
            _sheetSize = value;
            dirtyContainer = true;
        }
    }

    
    protected bool atlasReady = true;
    
    protected bool _offsetSizing = true;
	
	Dictionary<string, OTAtlasData> dataByName = new Dictionary<string, OTAtlasData>();
	public OTAtlasData DataByName(string dataName)
	{
		if (dataByName.ContainsKey(dataName))
			return dataByName[dataName];
		return null;
	}
    
    override public Texture GetTexture()
    {
        return texture;
    }

    
    override protected Frame[] GetFrames()
    {
        if (texture == null) return new Frame[] { };

        Vector2 texSize = sheetSize;
        if (Vector2.Equals(texSize, Vector2.zero) && texture != null)
            texSize = new Vector2(texture.width, texture.height);

        if (Vector2.Equals(texSize, Vector2.zero))
            return new Frame[] { };

        if (atlasReady && atlasData.Length > 0)
        {
            // convert atlasData to frames
            Frame[] frames = new Frame[atlasData.Length];
			
			dataByName.Clear();
			
            for (int a = 0; a < atlasData.Length; a++)
            {
                OTAtlasData data = atlasData[a];
                Frame frame = new Frame();
                frame.name = data.name;
				
				if (!dataByName.ContainsKey(data.name))
					dataByName.Add(data.name,data);								

                if (offsetSizing)
                {
                    frame.offset = data.offset;
                    frame.size = data.size;
                }
                else
                {
                    frame.offset = Vector2.zero;
                    frame.size = data.frameSize;

                    Vector2 vOffset = new Vector2(data.offset.x / frame.size.x, data.offset.y / frame.size.y);
                    Vector2 vSize = new Vector2(data.size.x / frame.size.x, data.size.y / frame.size.y);

                    Vector3 tl = new Vector3(((1f / 2f) * -1)  + vOffset.x, (1f / 2f) - vOffset.y, 0);
                    frame.vertices = new Vector3[] { 
                        tl,
                        tl + new Vector3(vSize.x,0,0),
                        tl + new Vector3(vSize.x,vSize.y * -1,0),
                        tl + new Vector3(0,vSize.y * -1,0)
                    };

                }
                frame.imageSize = data.frameSize;

                frame.uv = new Vector2[4];
                float sx = data.position.x / texSize.x;
                float sy = 1 - ((data.position.y + data.size.y) / texSize.y);
                float scx = data.size.x / texSize.x;
                float scy = data.size.y / texSize.y;
                if (data.rotated)
                {
                    sy = 1 - ((data.position.y + data.size.x) / texSize.y);
                    scx = data.size.y / texSize.x;
                    scy = data.size.x / texSize.y;
                    frame.uv[3] = new Vector2(sx, sy + scy);
                    frame.uv[0] = new Vector2(sx + scx, sy + scy);
                    frame.uv[1] = new Vector2(sx + scx, sy);
                    frame.uv[2] = new Vector2(sx, sy);
                }
                else
                {
                    frame.uv[0] = new Vector2(sx, sy + scy);
                    frame.uv[1] = new Vector2(sx + scx, sy + scy);
                    frame.uv[2] = new Vector2(sx + scx, sy);
                    frame.uv[3] = new Vector2(sx, sy);
                }
                frames[a] = frame;
            }
            return frames;
        }
        return new Frame[] { };
    }

    
    new protected void Start()
    {
        _sheetSize_ = sheetSize;
        _offsetSizing = offsetSizing;
		_texture = texture;
        base.Start();
    }
	
	protected virtual void LocateAtlasData()
	{
	}	
		
	protected void AddMeta(string key, string value)
	{
		if (metaData==null)
			metaData = new OTAtlasMetaData[] {};
		
		System.Array.Resize<OTAtlasMetaData>(ref metaData, metaData.Length+1);
		metaData[metaData.Length-1] = new OTAtlasMetaData();
		metaData[metaData.Length-1].key = key;		
		metaData[metaData.Length-1].value = value;				
	}	
    
    new protected void Update()
    {
        if (!Vector2.Equals(_sheetSize, _sheetSize_) || _offsetSizing!=offsetSizing || _texture!=texture)
        {
			if (texture!=_texture && texture!=null)
				LocateAtlasData();
			
            _sheetSize_ = _sheetSize;
            _offsetSizing = offsetSizing;
			_texture = texture;
			
            dirtyContainer = true;
        }
        base.Update();
    }
	
	public string GetMeta(string key)
	{
		if (metaData == null)
			return "";		
		for (int k=0; k<metaData.Length; k++)
		{
			if (metaData[k].key == key)
				return metaData[k].value;
		}	
		return "";
	}	
	
}

[System.Serializable]
public class OTAtlasMetaData
{
	public string key;
	public string value;
}	
