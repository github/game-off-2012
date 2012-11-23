using UnityEngine;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// OT Helper class to store object prefab references.
/// </summary>
[System.Serializable]
public class OTObjectType {
    /// <summary>
    /// Object type name.
    /// </summary>
    public string name = "";
    /// <summary>
    /// Object prototype.
    /// </summary>
    public GameObject prototype;

    /// <summary>
    /// Lookup table to find an object prototype by name.
    /// </summary>
    public static Dictionary<string, GameObject> lookup = new Dictionary<string, GameObject>();

    
    public static string Sprite
    {
        get
        {
            return "Sprite";
        }
    }
    
    public static string FilledSprite
    {
        get
        {
            return "FilledSprite";
        }
    }
    
    public static string AnimatingSprite
    {
        get
        {
            return "AnimatingSprite";
        }
    }
    
    public static string Animation
    {
        get
        {
            return "Animation";
        }
    }
    
    public static string SpriteSheet
    {
        get
        {
            return "SpriteSheet";
        }
    }
    
    public static string SpriteBatch
    {
        get
        {
            return "SpriteBatch";
        }
    }
    
    public static string SpriteAtlas
    {
        get
        {
            return "SpriteAtlas";
        }
    }

    public static string GradientSprite
    {
        get
        {
            return "GradientSprite";
        }
    }
	
    public static string TextSprite
    {
        get
        {
            return "TextSprite";
        }
    }
	
    public static string Scale9Sprite
    {
        get
        {
            return "Scale9Sprite";
        }
    }
	
	
}
