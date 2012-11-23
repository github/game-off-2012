using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;

/// <summary>
/// Use this class to tween properties of objects
/// </summary>
public class OTTween
{
    /// <summary>
    /// Tween notification delegate
    /// </summary>
    /// <param name="tween">Tween for this notification</param>
    public delegate void TweenDelegate(OTTween tween);
    /// <summary>
    /// Will be fired when a tween has finished.
    /// </summary>
    public TweenDelegate onTweenFinish;

    /// <summary>
    /// Will be true when a tween is running
    /// </summary>
    public bool isRunning
    {
        get
        {
            return _running;
        }
    }
	
	public object target
	{
		get
		{
			return _target;
		}		
	}

    List<string> vars = new List<string>();
    List<OTEase> easings = new List<OTEase>();
    List<OTEase> pongEasings = new List<OTEase>();
    List<object> fromValues = new List<object>();
    List<object> toValues = new List<object>();
    List<FieldInfo> fields = new List<FieldInfo>();
    List<PropertyInfo> props = new List<PropertyInfo>();
    List<Component> callBackTargets = new List<Component>();

    OTEase easing;
    object _target;
    float duration;
    float time = 0;
    float waitTime = 0;
    bool _running = false;
    bool _doStop = false;

    static OTTweenController controller = null;

    void CheckController()
    {
        if (controller == null)
        {
            controller = OT.Controller(typeof(OTTweenController)) as OTTweenController;
            if (controller == null)
            {
                controller = new OTTweenController();
                OT.AddController(controller);
            }
        }
        else
        {
            if ((OT.Controller(typeof(OTTweenController)) as OTTweenController) == null)
                OT.AddController(controller);
        }

        if (controller != null)
            controller.Add(this);
    }

    /// <summary>
    /// OTTween constructor
    /// </summary>
    /// <param name="target">Object on which to tween properties</param>
    /// <param name="duration">Tween duration</param>
    /// <param name="easing">Tween 'default' easing function</param>
    public OTTween(object target, float duration, OTEase easing)
    {
        this._target = target;
        this.duration = duration;
        this.easing = easing;
        CheckController();

    }

    /// <summary>
    /// OTTween constructor (easing Linear)
    /// </summary>
    /// <param name="target">Object on which to tween properties</param>
    /// <param name="duration">Tween duration</param>
    public OTTween(object target, float duration)
    {
        this._target = target;
        this.duration = duration;
        this.easing = OTEasing.Linear;
        CheckController();
    }

    // -----------------------------------------------------------------
    // class methods
    // -----------------------------------------------------------------
    /// <summary>
    /// Tween has to use callback functions.
    /// </summary>
    /// <param name="target">target class that will receive the callbacks.</param>
    public void InitCallBacks(Component target)
    {
        callBackTargets.Add(target);
    }


    private void SetVar(string name)
    {
        if (target != null)
        {
            FieldInfo field = target.GetType().GetField(name);
            if (field != null)
            {
                fromValues.Add(field.GetValue(target));
                fields.Add(field);
                props.Add(null);
            }
            else
            {
                PropertyInfo prop = target.GetType().GetProperty(name);
                if (prop != null)
                {
                    fromValues.Add(prop.GetValue(target, null));
                    props.Add(prop);
                    fields.Add(null);
                }
                else
                {
                    fromValues.Add(null);
                    fields.Add(null);
                    props.Add(null);
                }
            }
        }
    }

    private void TweenVar(object fromValue, object toValue, OTEase easing, FieldInfo field, PropertyInfo prop)
    {
        object value = null;
        if (toValue == null || fromValue == null) return;

        switch (fromValue.GetType().Name.ToLower())
        {
            case "single":
                if (!(toValue is float))
                    toValue = System.Convert.ToSingle(toValue);
                value = easing.ease(time, (float)fromValue, (float)toValue - (float)fromValue, duration);
                break;
            case "double":
                if (!(toValue is double))
                    toValue = System.Convert.ToDouble(toValue);
                value = easing.ease(time, (float)fromValue, (float)toValue - (float)fromValue, duration);
                break;
            case "int":
            case "int32":
                if (!(toValue is int))
                    toValue = System.Convert.ToInt32(toValue);

                value = (int)easing.ease(time, (int)fromValue, (int)toValue - (int)fromValue, duration);
                break;
            case "vector2":
                Vector2 _toValue2 = (Vector2)toValue;
                Vector2 _fromValue2 = (Vector2)fromValue;
                Vector2 _value2 = Vector2.zero;

                if ((_toValue2 - _fromValue2).x != 0)
                    _value2.x = easing.ease(time, _fromValue2.x, (_toValue2 - _fromValue2).x, duration);
                else
                    _value2.x = _fromValue2.x;

                if ((_toValue2 - _fromValue2).y != 0)
                    _value2.y = easing.ease(time, _fromValue2.y, (_toValue2 - _fromValue2).y, duration);
                else
                    _value2.y = _fromValue2.y;

                value = _value2;
                break;
            case "vector3":
                Vector3 _toValue3 = (Vector3)toValue;
                Vector3 _fromValue3 = (Vector3)fromValue;
                Vector3 _value3 = Vector3.zero;

                if ((_toValue3 - _fromValue3).x != 0)
                    _value3.x = easing.ease(time, _fromValue3.x, (_toValue3 - _fromValue3).x, duration);
                else
                    _value3.y = _fromValue3.y;
                if ((_toValue3 - _fromValue3).y != 0)
                    _value3.y = easing.ease(time, _fromValue3.y, (_toValue3 - _fromValue3).y, duration);
                else
                    _value3.y = _fromValue3.y;
                if ((_toValue3 - _fromValue3).z != 0)
                    _value3.z = easing.ease(time, _fromValue3.z, (_toValue3 - _fromValue3).z, duration);
                else
                    _value3.z = _fromValue3.z;


                value = _value3;
                break;
            case "color":
                Color _toColor = (Color)toValue;
                Color _fromColor = (Color)fromValue;

                float r = easing.ease(time, _fromColor.r, _toColor.r - _fromColor.r, duration);
                float g = easing.ease(time, _fromColor.g, _toColor.g - _fromColor.g, duration);
                float b = easing.ease(time, _fromColor.b, _toColor.b - _fromColor.b, duration);
                float a = easing.ease(time, _fromColor.a, _toColor.a - _fromColor.a, duration);

                value = new Color(r, g, b, a);
                break;
        }

		try
		{
	        if (field != null)
	            field.SetValue(target, value);
	        else
	            if (prop != null)
	                prop.SetValue(target, value, null);
		}
		catch(System.Exception)
		{
			
			_doStop = true;
			return;
		};

    }

    
    protected bool CallBack(string handler, object[] param)
    {
        for (int t = 0; t < callBackTargets.Count; t++)
        {
            MethodInfo mi = callBackTargets[t].GetType().GetMethod(handler);
            if (mi != null)
            {
                mi.Invoke(callBackTargets[t], param);
                return true;
            }
        }
        return false;
    }

    
    public bool Update(float deltaTime)
    {
        if (_doStop)
        {
            _running = false;
            return true;
        }

        if (waitTime > 0)
        {
            waitTime -= Time.deltaTime;
            if (waitTime > 0) return false;
        }
        if (vars.Count == 0) return false;
        _running = true;

        time += deltaTime;
        if (time > duration) time = duration;
        for (int v = 0; v < vars.Count; v++)
        {
            OTEase easing = this.easing;
            if (easings[v] != null)
                easing = easings[v];
            TweenVar(fromValues[v], toValues[v], easing, fields[v], props[v]);
        }
        if (time == duration)
        {
            _running = false;
            if (onTweenFinish != null)
                onTweenFinish(this);
            if (!CallBack("onTweenFinish", new object[] { this }))
                CallBack("OnTweenFinish", new object[] { this });
            return true;
        }
        else
            return false;
    }

    /// <summary>
    /// Sets the wait time (start delay) for this tween 
    /// </summary>
    /// <param name="waitTime"></param>
    /// <returns></returns>
    public OTTween Wait(float waitTime)
    {
        this.waitTime = waitTime;
        return this;
    }

    /// <summary>
    /// Tween a 'public' property of the tween's target object
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="fromValue">From value</param>
    /// <param name="toValue">To value</param>
    /// <param name="easing">Easing function</param>
    /// <param name="pongEasing">Easing when 'ponging'</param>
    /// <returns>Tween object</returns>
    public OTTween Tween(string var, object fromValue, object toValue, OTEase easing, OTEase pongEasing)
    {
        vars.Add(var);
        SetVar(var);
        if (fromValue != null)
        {
            object fv = fromValues[fromValues.Count - 1];
            if (fv != null)
            {
                if (fv is float && fromValue is int)
                    fromValue = System.Convert.ToSingle(fromValue);
                else
                    if (fv is double && fromValue is int)
                        fromValue = System.Convert.ToDouble(fromValue);
            }
            fromValues[fromValues.Count - 1] = fromValue;
        }
        toValues.Add(toValue);
        easings.Add(easing);
        pongEasings.Add(pongEasing);
        return this;
    }

    /// <summary>
    /// Tween a 'public' property of the tween's target object
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="fromValue">From value</param>
    /// <param name="toValue">To value</param>
    /// <param name="easing">Easing function</param>
    /// <returns>Tween object</returns>
    public OTTween Tween(string var, object fromValue, object toValue, OTEase easing)
    {
        return Tween(var, fromValue, toValue, easing, null);
    }
    /// <summary>
    /// Tween a 'public' property of the tween's target object
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="fromValue">From value</param>
    /// <param name="toValue">To value</param>
    /// <returns>Tween object</returns>
    public OTTween Tween(string var, object fromValue, object toValue)
    {
        return Tween(var, fromValue, toValue, null, null);
    }
    /// <summary>
    /// Tween a 'public' property of the tween's target object
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="toValue">To value</param>
    /// <param name="easing">Easing function</param>
    /// <param name="pongEasing">Easing when 'ponging'</param>
    /// <returns>Tween object</returns>
    public OTTween Tween(string var, object toValue, OTEase easing, OTEase pongEasing)
    {
        return Tween(var, null, toValue, easing, pongEasing);
    }
    /// <summary>
    /// Tween a 'public' property of the tween's target object
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="toValue">To value</param>
    /// <param name="easing">Easing function</param>
    /// <returns>Tween object</returns>
    public OTTween Tween(string var, object toValue, OTEase easing)
    {
        return Tween(var, null, toValue, easing, null);
    }
    /// <summary>
    /// Tween a 'public' property of the tween's target object
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="toValue">To value</param>
    /// <returns>Tween object</returns>
    public OTTween Tween(string var, object toValue)
    {
        return Tween(var, null, toValue, null, null);
    }

    /// <summary>
    /// Tween a 'public' property, adding a value, of the tween's target object.
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="addValue">Value to add</param>
    /// <param name="easing">Easing function</param>
    /// <param name="pongEasing">Easing when 'ponging'</param>
    /// <returns>Tween object</returns>
    public OTTween TweenAdd(string var, object addValue, OTEase easing, OTEase pongEasing)
    {
        vars.Add(var);
        SetVar(var);
        easings.Add(easing);
        pongEasings.Add(pongEasing);
        object fromValue = fromValues[fromValues.Count - 1];

        if (fromValue is int)
        {
            try
            {
                addValue = System.Convert.ToInt32(addValue);
            }
            catch (System.Exception)
            {
                addValue = 0;
            }
        }
        else
            if (fromValue is float)
            {
                try
                {
                    addValue = System.Convert.ToSingle(addValue);
                }
                catch (System.Exception)
                {
                    addValue = 0.0f;
                }
            }
            else
                if (fromValue is double)
                {
                    try
                    {
                        addValue = System.Convert.ToDouble(addValue);
                    }
                    catch (System.Exception)
                    {
                        addValue = 0.0;
                    }
                }

        switch (fromValue.GetType().Name.ToLower())
        {
            case "single": toValues.Add((float)fromValue + (float)addValue); break;
            case "double": toValues.Add((double)fromValue + (double)addValue); break;
            case "int": toValues.Add((int)fromValue + (int)addValue); break;
            case "int32": toValues.Add((int)fromValue + (int)addValue); break;
            case "vector2": toValues.Add((Vector2)fromValue + (Vector2)addValue); break;
            case "vector3": toValues.Add((Vector3)fromValue + (Vector3)addValue); break;
            default: toValues.Add(null); break;
        }
        return this;
    }
    /// <summary>
    /// Tween a 'public' property, adding a value, of the tween's target object.
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="addValue">Value to add</param>
    /// <param name="easing">Easing function</param>
    /// <returns>Tween object</returns>
    public OTTween TweenAdd(string var, object addValue, OTEase easing)
    {
        return TweenAdd(var, addValue, easing, null);
    }
    /// <summary>
    /// Tween a 'public' property, adding a value, of the tween's target object.
    /// </summary>
    /// <param name="var">Property name</param>
    /// <param name="addValue">Value to add</param>
    /// <returns>Tween object</returns>
    public OTTween TweenAdd(string var, object addValue)
    {
        return TweenAdd(var, addValue, null, null);
    }

    /// <summary>
    /// Stop this tween.
    /// </summary>
    public void Stop()
    {
        if (isRunning)
            _doStop = true;
    }

}
