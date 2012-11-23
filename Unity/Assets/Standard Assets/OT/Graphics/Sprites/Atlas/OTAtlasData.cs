using UnityEngine;
using System.Collections;

/// <summary>
/// Stores data of a specific OTSpriteAtlas frame.
/// </summary>
[System.Serializable]
public class OTAtlasData
{
    /// <summary>
    /// This frame's name
    /// </summary>
    public string name = "";
    /// <summary>
    /// This frame's atlas position
    /// </summary>
    public Vector2 position = Vector2.zero;
    /// <summary>
    /// This frame's position offset
    /// </summary>
    public Vector2 offset = Vector2.zero;
    /// <summary>
    /// if this image is rotated on Atlas
    /// </summary>
    public bool rotated = false;
    /// <summary>
    /// This frame's atlas size
    /// </summary>
    public Vector2 size = Vector2.zero;
    /// <summary>
    /// atlas frame size
    /// </summary>
    public Vector2 frameSize = Vector2.zero;
	
	[HideInInspector]
	public OTAtlasMetaData[] metaData;
	
	public void AddMeta(string key, string value)
	{
		if (metaData==null)
			metaData = new OTAtlasMetaData[] {};
		
		System.Array.Resize<OTAtlasMetaData>(ref metaData, metaData.Length+1);
		metaData[metaData.Length-1] = new OTAtlasMetaData();
		metaData[metaData.Length-1].key = key;		
		metaData[metaData.Length-1].value = value;				
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

