using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Xml;

/// <summary>
/// Sprite altlas imported from a Cocos2D XML data file
/// </summary>
/// <remarks>
/// Suports trimmed and rotated images. Make sure the data file is saved with the .xml extension
/// because Unity3D will not detect it as a TextAsset. Cocos2D export defaults to a .plist extension
/// so this need to be changed.
/// </remarks>
public class OTSpriteAtlasCocos2D : OTSpriteAtlasImportXML 
{

    XmlNode subTexture = null;

    Vector2 StringToVector2(string s)
    {
        string _s = s.Substring(1, s.Length - 2);
        string[] sa = _s.Split(',');
        return new Vector2(System.Convert.ToSingle(sa[0]), System.Convert.ToSingle(sa[1]));
    }

    Rect StringToRect(string s)
    {
        string _s = s.Substring(1, s.Length - 2);
        string[] sa = _s.Split(new string[] { "},{" }, System.StringSplitOptions.None);
        Vector2 v1 = StringToVector2(sa[0]+"}");
        Vector2 v2 = StringToVector2("{"+sa[1]);
        return new Rect(v1.x, v1.y, v2.x, v2.y);
    }

    Rect GetRect(string name)
    {
        XmlNode nameNode = subTexture.SelectSingleNode("key[.='" + name + "']");
        if (nameNode != null)
        {
            XmlNode stringNode = nameNode.NextSibling;
            return StringToRect(stringNode.InnerText);
        }
        return new Rect(0, 0, 0, 0);
    }

    Vector2 GetVector2(string name)
    {
        XmlNode nameNode = subTexture.SelectSingleNode("key[.='" + name + "']");
        if (nameNode != null)
        {
            XmlNode stringNode = nameNode.NextSibling;
            return StringToVector2(stringNode.InnerText);
        }
        return Vector2.zero;
    }

    bool GetBool(string name)
    {
        XmlNode nameNode = subTexture.SelectSingleNode("key[.='" + name + "']");
        if (nameNode != null)
        {
            XmlNode boolNode = nameNode.NextSibling;
            return (boolNode.Name.ToLower() == "true");
        }
        return false;
    }

    /// <summary>
    /// Import atlasData from sparrow xml
    /// </summary>
    protected override OTAtlasData[] Import()
    {
        if (!ValidXML())
            return new OTAtlasData[] { };

        List<OTAtlasData> data = new List<OTAtlasData>();
        if (xml.DocumentElement.Name == "plist")
        {
            XmlNode frames = xml.DocumentElement.SelectSingleNode("dict/key");
            if (frames != null && frames.InnerText == "frames")
            {
                XmlNodeList subTextureNames = xml.DocumentElement.SelectNodes("dict/dict/key");
                XmlNodeList subTextures = xml.DocumentElement.SelectNodes("dict/dict/dict");
                try
                {
                    for (int si = 0; si < subTextures.Count; si++)
                    {
                        subTexture = subTextures[si];
                        OTAtlasData ad = new OTAtlasData();

                        bool rotated = GetBool("rotated");
                        Rect frame = GetRect("frame");
                        Rect colorRect = GetRect("sourceColorRect");
                        Vector2 sourceSize = GetVector2("sourceSize");
                        try
                        {
                            ad.name = subTextureNames[si].InnerText.Split('.')[0];
                        }
                        catch (System.Exception)
                        {
                            ad.name = subTextureNames[si].InnerText;
                        }
                        ad.position = new Vector2(frame.xMin, frame.yMin);
                        if (rotated)
                            ad.rotated = true;

                        ad.size = new Vector2(colorRect.width, colorRect.height);
                        ad.frameSize = sourceSize;
                        ad.offset = new Vector2(colorRect.xMin, colorRect.yMin);

                        data.Add(ad);
                    }
                }
                catch (System.Exception ERR)
                {
                    Debug.LogError("Orthello : Cocos2D Atlas Import error!");
                    Debug.LogError(ERR.Message);
                }
            }
        }
        return data.ToArray();
    }

}