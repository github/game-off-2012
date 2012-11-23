using UnityEngine;
using System.Collections;
using System.Xml;
using System.IO;

/// <summary>
/// Base class for importing a sprite atlas from an XML file
/// </summary>
public class OTSpriteAtlasImportXML : OTSpriteAtlasImport
{
    
    protected  string AttrS(XmlNode node, string field)
    {
        try
        {
            return node.Attributes[field].InnerText;
        }
        catch (System.Exception)
        {
            return "";
        }
    }
	
    protected  int AttrI(XmlNode node, string field)
    {
        try
        {
            return System.Convert.ToInt16(node.Attributes[field].InnerText);
        }
        catch (System.Exception)
        {
            return -1;
        }
    }
	
	protected override void LocateAtlasData()
	{
		if (atlasDataFile!=null && texture.name == atlasDataFile.name)
			return;		
				
#if UNITY_EDITOR 		
		string path = Path.GetDirectoryName(UnityEditor.AssetDatabase.GetAssetPath(texture))+"/"+texture.name+".xml";
		Object o = (UnityEditor.AssetDatabase.LoadAssetAtPath(path,typeof(TextAsset)));
		if (o is TextAsset)
			_atlasDataFile = (o as TextAsset);
#endif
	}	
	
    protected XmlDocument xml = new XmlDocument();
    /// <summary>
    /// Check if xml provided is valid
    /// </summary>
    /// <returns>Array with atlas frame data</returns>
    protected bool ValidXML()
    {
        try
        {
            xml.LoadXml(atlasDataFile.text);
            return true;
        }
        catch (System.Exception err)
        {
            Debug.LogError("Orthello : Atlas XML file could not be read!");
            Debug.LogError(err.Message);
        } 
        return false;
    }
}