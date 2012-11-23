using UnityEngine;
using System.Collections;

/// <summary>
/// OT Helper class to store material (name) references.
/// </summary>
[System.Serializable]
public class OTMatRef {
    /// <summary>
    /// Material reference name
    /// </summary>
    public string name = "";
    /// <summary>
    /// Shader Color Field Name to be used for tinting
    /// </summary>
    public string fieldColorTint = "";
    /// <summary>
    /// Shader Alpha channel Field Name to be used for alpha fading
    /// </summary>
    public string fieldAlphaChannel = "";
    /// <summary>
    /// Shader Color Field Name to be used for alpha fading
    /// </summary>
    public string fieldAlphaColor = "";
    /// <summary>
    /// Material reference
    /// </summary>
    public Material material;
}
