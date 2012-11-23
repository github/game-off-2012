using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Xml;
using System.IO;

/// <summary>
/// Sprite altlas imported from a Sparrow  XML data file
/// </summary>
/// <remarks>
/// Supports trimmed images.
/// </remarks>
public class OTSpriteAtlasBMFontXml : OTSpriteAtlasImportXML 
{

    /// <summary>
    /// Import atlasData from sparrow xml
    /// </summary>
    protected override OTAtlasData[] Import()
    {
        if (!ValidXML())
            return new OTAtlasData[] { };

        List<OTAtlasData> data = new List<OTAtlasData>();
        if (xml.DocumentElement.Name == "font")
        {
			XmlNode info = xml.DocumentElement.SelectSingleNode("info");
			if (info!=null && AttrS(info,"face")!="")
			{					
				name = "Font "+AttrS(info,"face")+"-"+AttrS(info,"size");
				if (AttrS(info,"bold")=="1")
					name += "b";
				if (AttrS(info,"italic")=="1")
					name += "i";
							
				metaType = "FONT";
            	XmlNode charsNode = xml.DocumentElement.SelectSingleNode("chars");
				if (charsNode!=null)
				{
					XmlNodeList chars = charsNode.SelectNodes("char");
		            for (int si = 0; si < chars.Count; si++)
		            {
		                XmlNode charNode = chars[si];
		                OTAtlasData ad = new OTAtlasData();
		
		                ad.name = ""+AttrI(charNode,"id");
		                ad.position = new Vector2(AttrI(charNode,"x"), AttrI(charNode,"y"));
		                ad.size = new Vector2(AttrI(charNode,"width"), AttrI(charNode,"height"));
		                ad.offset = new Vector2(AttrI(charNode,"xoffset"), AttrI(charNode,"yoffset"));		
						
						ad.AddMeta("dx",AttrS(charNode,"xadvance"));
						
		                data.Add(ad);
		            }
				}
			}
        }
        return data.ToArray();
    }
	
	protected override void LocateAtlasData()
	{
#if UNITY_EDITOR 
		
		if (_atlasDataFile==null)
		{		
			string path = Path.GetDirectoryName(UnityEditor.AssetDatabase.GetAssetPath(texture))+"/"+texture.name+".fnt";
			string tpath = Path.GetDirectoryName(UnityEditor.AssetDatabase.GetAssetPath(texture))+"/"+texture.name+".xml";
			string fpath = Path.GetFullPath(path);
			string ftpath = Path.GetFullPath(tpath);
			if (File.Exists(fpath))
			{
				File.Copy(fpath,ftpath);			
				UnityEditor.AssetDatabase.DeleteAsset(path);
				UnityEditor.AssetDatabase.ImportAsset(tpath);
				File.Delete(fpath);
			}
			
			base.LocateAtlasData();			
		}
#endif
	}	
	
}