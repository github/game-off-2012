using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Xml;

/// <summary>
/// Sprite altlas imported from a Sparrow  XML data file
/// </summary>
/// <remarks>
/// Supports trimmed images.
/// </remarks>
public class OTSpriteAtlasSparrow : OTSpriteAtlasImportXML 
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
        if (xml.DocumentElement.Name == "TextureAtlas")
        {
            XmlNodeList subTextures = xml.DocumentElement.SelectNodes("SubTexture");
            for (int si = 0; si < subTextures.Count; si++)
            {
                subTexture = subTextures[si];
                OTAtlasData ad = new OTAtlasData();

                ad.name = S("name");
                ad.position = new Vector2(I("x"), I("y"));
                ad.size = new Vector2(I("width"), I("height"));
                ad.frameSize = new Vector2(I("frameWidth"), I("frameHeight"));
                ad.offset = new Vector2(I("frameX"), I("frameY")) * -1;

                data.Add(ad);
            }
        }
        return data.ToArray();
    }

}