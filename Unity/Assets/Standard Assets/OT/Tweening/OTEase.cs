using UnityEngine;
using System.Collections;

/// <summary>
/// Easing base class.
/// </summary>
/// <remarks>
/// You use the <see cref="OTEasing" /> class to get the easing functions
/// </remarks>
public class OTEase {
    /// <summary>
    /// base easing function
    /// </summary>
    public virtual float ease(float t, float b, float c, float d)
    {
        return 0.0f;
    }
}
