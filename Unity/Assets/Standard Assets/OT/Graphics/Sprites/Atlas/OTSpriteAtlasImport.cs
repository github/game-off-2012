using UnityEngine;
using System.Collections;
using System.Xml;
using System.IO;

/// <summary>
/// Base class for importing sprite atlasses
/// </summary>
public class OTSpriteAtlasImport : OTSpriteAtlas
{
    
    
    public TextAsset _atlasDataFile = null;
    /// <summary>
    /// Will reload the atlas data
    /// </summary>
    public bool reloadData = false;
	
	
	[HideInInspector]
	public int bytesDataFile = 0;
	
	[HideInInspector]
	public int id = 0;
	
    /// <summary>
    /// Atlas data file to import framedata from
    /// </summary>
    public TextAsset atlasDataFile
    {
        get
        {
            return _atlasDataFile;
        }
        set
        {
            _atlasDataFile = value;
            Update();
        }
    }
	
    
    public bool reloadFrame
    {
        get
        {
            return _reloadFrame;
        }
    }

    private TextAsset _atlasDataFile_ = null;	
	private bool _reloadFrame = false;
	
    
    new protected void Start()
    {
		if (atlasDataFile!=null && atlasData.Length>0)
        	_atlasDataFile_ = atlasDataFile;		
		else
			_reloadFrame = true;
        base.Start();
    }
	
	protected virtual void LocateAtlasTexture()
	{
		string[] imgFormats = new string[] { "png", "jpg", "jpeg", "gif", "bmp", 
			"tga", "iff", "pict" };
				
		if (texture!=null && texture.name == atlasDataFile.name)
			return;		
		
#if UNITY_EDITOR 		
		string basePath = Path.GetDirectoryName(UnityEditor.AssetDatabase.GetAssetPath(atlasDataFile))+"/"+atlasDataFile.name;
		
		for (int i=0; i< imgFormats.Length; i++)
		{
			string path = basePath +"."+ imgFormats[i];
			Object o = (UnityEditor.AssetDatabase.LoadAssetAtPath(path,typeof(Texture)));		
			if (o is Texture)
			{
				texture = (o as Texture);
				return;
			}
		}
#endif		
	}	
	
    /// <summary>
    /// Override this Import method to load the atlas data from the xml
    /// </summary>
    /// <returns>Array with atlas frame data</returns>
    protected virtual OTAtlasData[] Import()
    {
        return new OTAtlasData[] { };
    }

    
    new protected void Update()
    {
        if (_atlasDataFile_!=atlasDataFile || reloadData || (atlasDataFile!=null && bytesDataFile!=atlasDataFile.bytes.Length))
        {
			
			if (atlasDataFile!=null)
			{
				if (_atlasDataFile_!=atlasDataFile || texture == null )
					LocateAtlasTexture();
			}
			
            _atlasDataFile_ = atlasDataFile;
            if (atlasDataFile != null)
            {
				bytesDataFile = atlasDataFile.bytes.Length;
                atlasReady = false;
                atlasData = Import();
				id++;
				GetFrames();
                atlasReady = true;
            }
			else
				bytesDataFile = 0;
			
            if (reloadData)
                reloadData = false;
#if UNITY_EDITOR
			if (!Application.isPlaying)
				UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
#endif										
			
        }

        base.Update();
    }
}