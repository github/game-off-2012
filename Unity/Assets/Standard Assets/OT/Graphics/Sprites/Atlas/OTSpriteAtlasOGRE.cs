using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Xml;

/// <summary>
/// Sprite altlas imported from a OGRE XML data file
/// </summary>
public class OTSpriteAtlasOGRE : OTSpriteAtlasImportXML 
{

    XmlNode subTexture = null;
    private string S(string field)
    {
        if (subTexture != null)
        {
            try
            {
                return subTexture.Attributes[field].InnerText;
            }
            catch (System.Exception)
            {
                return "";
            }
        }
        return "";
    }

    private int I(string field)
    {
        try
        {
            return System.Convert.ToInt32(S(field));
        }
        catch (System.Exception)
        {
            return 0;
        }
    }

    /// <summary>
    /// Import atlasData from sparrow xml
    /// </summary>
    protected override OTAtlasData[] Import()
    {
        if (!ValidXML())
            return new OTAtlasData[] { };

        List<OTAtlasData> data = new List<OTAtlasData>();
        if (xml.DocumentElement.Name == "Imageset")
        {
            XmlNodeList subTextures = xml.DocumentElement.SelectNodes("Image");
            for (int si = 0; si < subTextures.Count; si++)
            {
                subTexture = subTextures[si];
                OTAtlasData ad = new OTAtlasData();

                ad.name = S("Name");
                ad.position = new Vector2(I("XPos"), I("YPos"));
                ad.size = new Vector2(I("Width"), I("Height"));
                ad.frameSize = new Vector2(I("Width"), I("Height"));
                ad.offset = Vector2.zero;

                data.Add(ad);
            }
        }
        return data.ToArray();
    }

}