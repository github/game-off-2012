using UnityEngine;
using System.Collections;

public class OTEaseBounceIn : OTEase {
    OTEaseBounceOut easeOut = new OTEaseBounceOut();
    public override float ease(float t, float b, float c, float d)
    {
        return c - easeOut.ease(d - t, 0, c, d) + b;
    }
}
