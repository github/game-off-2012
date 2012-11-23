using UnityEngine;
using System.Collections;

/// <summary>
/// Use this to access the easing functions
/// </summary>
public class OTEasing {

    /// <summary>
    /// Linear easing function
    /// </summary>
    public static OTEase Linear 
    {
        get 
        {
            if (linear==null)
                linear = new OTEaseLinear();
            return linear;
        }
    }

    /// <summary>
    /// Bounce In Easing function
    /// </summary>
    public static OTEase BounceIn
    {
        get
        {
            if (bounceIn == null)
                bounceIn = new OTEaseBounceIn();
            return bounceIn;
        }
    }

    /// <summary>
    /// Bounce Out Easing function
    /// </summary>
    public static OTEase BounceOut
    {
        get
        {
            if (bounceOut == null)
                bounceOut = new OTEaseBounceOut();
            return bounceOut;
        }
    }

    /// <summary>
    /// Bounce In Out Easing function
    /// </summary>
    public static OTEase BounceInOut
    {
        get
        {
            if (bounceInOut == null)
                bounceInOut = new OTEaseBounceInOut();
            return bounceInOut;
        }
    }

    /// <summary>
    /// Back In Easing function
    /// </summary>
    public static OTEase BackIn
    {
        get
        {
            if (backIn == null)
                backIn = new OTEaseBackIn();
            return backIn;
        }
    }

    /// <summary>
    /// Back Out Easing function
    /// </summary>
    public static OTEase BackOut
    {
        get
        {
            if (backOut == null)
                backOut = new OTEaseBackOut();
            return backOut;
        }
    }

    /// <summary>
    /// Back In Out Easing function
    /// </summary>
    public static OTEase BackInOut
    {
        get
        {
            if (backInOut == null)
                backInOut = new OTEaseBackInOut();
            return backInOut;
        }
    }

    /// <summary>
    /// Circ In Easing function
    /// </summary>
    public static OTEase CircIn
    {
        get
        {
            if (circIn == null)
                circIn = new OTEaseCircIn();
            return circIn;
        }
    }

    /// <summary>
    /// Circ Out Easing function
    /// </summary>
    public static OTEase CircOut
    {
        get
        {
            if (circOut == null)
                circOut = new OTEaseCircOut();
            return circOut;
        }
    }

    /// <summary>
    /// Circ In Out Easing function
    /// </summary>
    public static OTEase CircInOut
    {
        get
        {
            if (circInOut == null)
                circInOut = new OTEaseCircInOut();
            return circInOut;
        }
    }

    /// <summary>
    /// Strong In Easing function
    /// </summary>
    public static OTEase StrongIn
    {
        get
        {
            if (strongIn == null)
                strongIn = new OTEaseStrongIn();
            return strongIn;
        }
    }

    /// <summary>
    /// Strong Out Easing function
    /// </summary>
    public static OTEase StrongOut
    {
        get
        {
            if (strongOut == null)
                strongOut = new OTEaseStrongOut();
            return strongOut;
        }
    }


    /// <summary>
    /// Strong In Out Easing function
    /// </summary>
    public static OTEase StrongInOut
    {
        get
        {
            if (strongInOut == null)
                strongInOut = new OTEaseStrongInOut();
            return strongInOut;
        }
    }

    /// <summary>
    /// Sine In Easing function
    /// </summary>
    public static OTEase SineIn
    {
        get
        {
            if (sineIn == null)
                sineIn = new OTEaseSineIn();
            return sineIn;
        }
    }

    /// <summary>
    /// Sine Out Easing function
    /// </summary>
    public static OTEase SineOut
    {
        get
        {
            if (sineOut == null)
                sineOut = new OTEaseSineOut();
            return sineOut;
        }
    }

    /// <summary>
    /// Sine In Out Easing function
    /// </summary>
    public static OTEase SineInOut
    {
        get
        {
            if (sineInOut == null)
                sineInOut = new OTEaseSineInOut();
            return sineInOut;
        }
    }

    /// <summary>
    /// Quad In Easing function
    /// </summary>
    public static OTEase QuadIn
    {
        get
        {
            if (quadIn == null)
                quadIn = new OTEaseQuadIn();
            return quadIn;
        }
    }

    /// <summary>
    /// Quad Out Easing function
    /// </summary>
    public static OTEase QuadOut
    {
        get
        {
            if (quadOut == null)
                quadOut = new OTEaseQuadOut();
            return quadOut;
        }
    }

    /// <summary>
    /// Quad In Out Easing function
    /// </summary>
    public static OTEase QuadInOut
    {
        get
        {
            if (quadInOut == null)
                quadInOut = new OTEaseQuadInOut();
            return quadInOut;
        }
    }


    /// <summary>
    /// Quart In Easing function
    /// </summary>
    public static OTEase QuartIn
    {
        get
        {
            if (quartIn == null)
                quartIn = new OTEaseQuartIn();
            return quartIn;
        }
    }

    /// <summary>
    /// Quart Out Easing function
    /// </summary>
    public static OTEase QuartOut
    {
        get
        {
            if (quartOut == null)
                quartOut = new OTEaseQuartOut();
            return quartOut;
        }
    }

    /// <summary>
    /// Quart In Out Easing function
    /// </summary>
    public static OTEase QuartInOut
    {
        get
        {
            if (quartInOut == null)
                quartInOut = new OTEaseQuartInOut();
            return quartInOut;
        }
    }


    /// <summary>
    /// Quint In Easing function
    /// </summary>
    public static OTEase QuintIn
    {
        get
        {
            if (quintIn == null)
                quintIn = new OTEaseQuintIn();
            return quintIn;
        }
    }

    /// <summary>
    /// Quint Out Easing function
    /// </summary>
    public static OTEase QuintOut
    {
        get
        {
            if (quintOut == null)
                quintOut = new OTEaseQuintOut();
            return quintOut;
        }
    }

    /// <summary>
    /// Quint In Out Easing function
    /// </summary>
    public static OTEase QuintInOut
    {
        get
        {
            if (quintInOut == null)
                quintInOut = new OTEaseQuintInOut();
            return quintInOut;
        }
    }


    /// <summary>
    /// Expo In Easing function
    /// </summary>
    public static OTEase ExpoIn
    {
        get
        {
            if (expoIn == null)
                expoIn = new OTEaseExpoIn();
            return expoIn;
        }
    }

    /// <summary>
    /// Expo Out Easing function
    /// </summary>
    public static OTEase ExpoOut
    {
        get
        {
            if (expoOut == null)
                expoOut = new OTEaseExpoOut();
            return expoOut;
        }
    }

    /// <summary>
    /// Expo In Out Easing function
    /// </summary>
    public static OTEase ExpoInOut
    {
        get
        {
            if (expoInOut == null)
                expoInOut = new OTEaseExpoInOut();
            return expoInOut;
        }
    }

    /// <summary>
    /// Cubic In Easing function
    /// </summary>
    public static OTEase CubicIn
    {
        get
        {
            if (cubicIn == null)
                cubicIn = new OTEaseCubicIn();
            return cubicIn;
        }
    }

    /// <summary>
    /// Cubic Out Easing function
    /// </summary>
    public static OTEase CubicOut
    {
        get
        {
            if (cubicOut == null)
                cubicOut = new OTEaseCubicOut();
            return cubicOut;
        }
    }

    /// <summary>
    /// Cubic In Out Easing function
    /// </summary>
    public static OTEase CubicInOut
    {
        get
        {
            if (cubicInOut == null)
                cubicInOut = new OTEaseCubicInOut();
            return cubicInOut;
        }
    }

    /// <summary>
    /// Elastic In Easing function
    /// </summary>
    public static OTEase ElasticIn
    {
        get
        {
            //if (elasticIn == null)
                elasticIn = new OTEaseElasticIn();
            return elasticIn;
        }
    }

    /// <summary>
    /// Elastic Out Easing function
    /// </summary>
    public static OTEase ElasticOut
    {
        get
        {
            //if (elasticOut == null)
                elasticOut = new OTEaseElasticOut();
            return elasticOut;
        }
    }

    /// <summary>
    /// Elastic In Out Easing function
    /// </summary>
    public static OTEase ElasticInOut
    {
        get
        {
            //if (elasticInOut == null)
                elasticInOut = new OTEaseElasticInOut();
            return elasticInOut;
        }
    }
	
	/// <summary>
	/// Ease type enumeration with all easing functions
	/// </summary>
	public enum EaseType
	{
		Linear, 
		BackIn, BackInOut, BackOut,
		BounceIn, BounceInOut, BounceOut,
		CircIn, CircInOut, CircOut,
		CubicIn, CubicInOut, CubicOut,
		ElasticIn, ElasticInOut, ElasticOut,
		ExpoIn, ExpoInOut, ExpoOut,
		QuadIn, QuadInOut, QuadOut,
		QuartIn, QuartInOut, QuartOut,
		QuintIn, QuintInOut, QuintOut,
		SineIn, SineInOut, SineOut,
		StrongIn, StrongInOut, StrongOut
	}
	
	/// <summary>
	/// gets and ease object based on its ease type
	/// </summary>
	public static OTEase Ease(EaseType ease)
	{
		switch(ease)
		{
		case EaseType.Linear: 		return Linear;
		case EaseType.BackIn: 		return BackIn;
		case EaseType.BackInOut : 	return BackInOut;
		case EaseType.BackOut : 	return BackOut;
		case EaseType.BounceIn : 	return BounceIn;
		case EaseType.BounceInOut : return BounceInOut;
		case EaseType.BounceOut : 	return BounceOut;
		case EaseType.CircIn :		return CircIn;
		case EaseType.CircInOut :	return CircInOut;
		case EaseType.CircOut :		return CircOut;
		case EaseType.CubicIn : 	return CubicIn;
		case EaseType.CubicInOut : 	return CubicInOut;
		case EaseType.CubicOut :	return CubicOut;
		case EaseType.ElasticIn :	return ElasticIn;
		case EaseType.ElasticInOut :return ElasticInOut;
		case EaseType.ElasticOut :	return ElasticOut;
		case EaseType.QuadIn :		return QuadIn;
		case EaseType.QuadInOut : 	return QuadInOut;
		case EaseType.QuadOut :		return QuadOut;
		case EaseType.QuartIn : 	return QuartIn;
		case EaseType.QuartInOut : 	return QuartInOut;
		case EaseType.QuartOut :	return QuartOut;
		case EaseType.QuintIn :		return QuintIn;
		case EaseType.QuintInOut : 	return QuintInOut;
		case EaseType.QuintOut :	return QuintOut;
		case EaseType.SineIn : 		return SineIn;
		case EaseType.SineInOut : 	return SineInOut;
		case EaseType.SineOut :		return SineOut;
		case EaseType.StrongIn : 	return StrongIn;
		case EaseType.StrongInOut : return StrongInOut;
		case EaseType.StrongOut :	return StrongOut;
		case EaseType.ExpoIn : 		return ExpoIn;
		case EaseType.ExpoInOut : 	return ExpoInOut;
		case EaseType.ExpoOut : 	return ExpoOut;	
		}	
		return linear;
	}
	
    private static OTEase linear = null;
    
    private static OTEase backIn = null;
    private static OTEase backInOut = null;
    private static OTEase backOut = null;

    private static OTEase bounceIn = null;
    private static OTEase bounceInOut = null;
    private static OTEase bounceOut = null;

    private static OTEase circIn = null;
    private static OTEase circInOut = null;
    private static OTEase circOut = null;

    private static OTEase cubicIn = null;
    private static OTEase cubicInOut = null;
    private static OTEase cubicOut = null;

    private static OTEase elasticIn = null;
    private static OTEase elasticInOut = null;
    private static OTEase elasticOut = null;

    private static OTEase quadIn = null;
    private static OTEase quadInOut = null;
    private static OTEase quadOut = null;

    private static OTEase quartIn = null;
    private static OTEase quartInOut = null;
    private static OTEase quartOut = null;

    private static OTEase quintIn = null;
    private static OTEase quintInOut = null;
    private static OTEase quintOut = null;

    private static OTEase strongIn = null;
    private static OTEase strongInOut = null;
    private static OTEase strongOut = null;

    private static OTEase sineIn = null;
    private static OTEase sineInOut = null;
    private static OTEase sineOut = null;

    private static OTEase expoIn = null;
    private static OTEase expoInOut = null;
    private static OTEase expoOut = null;


}
