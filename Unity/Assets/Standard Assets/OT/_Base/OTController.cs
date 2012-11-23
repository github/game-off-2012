using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;

/// <summary>
/// Orthello Controller base class
/// </summary>
public class OTController {

    private static int indexer = 0;

    /// <summary>
    /// this controller runs at this speed (.5f=half speed, 1=normal, 2=twice as fast).
    /// </summary>
    public float speed = 1;
    /// <summary>
    /// enable/disable this controller.
    /// </summary>
    public bool enabled = true;
    /// <summary>
    /// controller name.
    /// </summary>
    public string name
    {
        get
        {
            return _name;
        }
    }
    /// <summary>
    /// running time
    /// </summary>
    public float time
    {
        get
        {
            return _time;
        }
    }
	/// <summary>
	/// Gets the owner of this controller
	/// </summary>
    public Object owner
    {
        get
        {
            return _owner;
        }
    }

    
    protected Object _owner;
    
    protected string _name;
    
    protected float deltaTime;
    protected float _time;

    List<Component> callBackTargets = new List<Component>();

    
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

    private bool initialized = false;

    /// <summary>
    /// Controller constructor
    /// </summary>
    /// <param name="owner">object that this controller will influence</param>
    /// <param name="name">controller name</param>
    public OTController(Object owner, string name)
    {
        this._owner = owner;
        this._name = name.ToLower();
    }

    /// <summary>
    /// Sets the owner of this controller
    /// </summary>
    /// <param name="owner"></param>
    public virtual void SetOwner(Object owner)
    {
        this._owner = owner;
    }

    /// <summary>
    /// Sets the name of this controller
    /// </summary>
    /// <param name="name"></param>
    public void SetName(string name)
    {
        this._name = name;
    }


    /// <summary>
    /// Controller constructor
    /// </summary>
    /// <param name="name">controller name</param>
    public OTController(string name)
    {
        this._owner = null;
        this._name = name.ToLower();
    }

    /// <summary>
    /// Controller constructor
    /// </summary>
    public OTController()
    {
        this._owner = null;
        this._name = "OTController" + (++indexer);
    }

    /// <summary>
    /// Object has to use callback functions.
    /// </summary>
    /// <param name="target">target class that will receive the callbacks.</param>
    public void InitCallBacks(Component target)
    {
        callBackTargets.Add(target);
    }

    /// <summary>
    /// Override this method to initialize the controller when subclassing the base.
    /// </summary>
    protected virtual void Initialize()
    {
    }

    /// <summary>
    /// Override this method to handle the controller when subclassing the base.
    /// </summary>
    protected virtual void Update()
    {
    }

    
    public void Update(float pDeltaTime)
    {
        if (!initialized)
        {
            Initialize();
            initialized = true;
        }
            
        deltaTime = pDeltaTime * speed;
        if (enabled)
            Update();
        _time += deltaTime;
    }
    /// <summary>
    /// Set timerecording of this controller to 0
    /// </summary>
    public void ResetTime()
    {
        _time = 0;
    }

}
