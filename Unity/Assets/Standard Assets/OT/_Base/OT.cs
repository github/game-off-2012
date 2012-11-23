using UnityEngine;
using System.Collections;
using System.Collections.Generic;

/// <summary>
/// Provides 'static' functionality to control the Orthello 2D Framework. 
/// </summary>
/// <remarks>
/// The OT class is used to offer some base 'static' framework functionality.
/// <br></br><br></br>
/// Use the OT class to :
/// <br></br><br></br>
/// <ul>
/// <li>Check if framework is initialized (isValid).</li>
/// <li>Find your objects, animations, (sprite)containers and materials programmaticly.</li>
/// <li>Set your default solid/transparent and additive material.</li>
/// <li>Create a sprite programmaticly.</li>
/// <li> a sprite programmaticly.</li>
/// </ul>
/// <br></br><br></br>
/// <strong style='color:red'>!IMPORTANT</strong> The OT class is already added as a script to the (prefab) <strong>/Orthello/Objects/OT object</strong> and is
/// only used on this object. The OT object has to be added to a new scene (with a main camera) to 
/// initialize the Orthello 2D framework. This <strong>must be done before adding other Orthello objects like sprites</strong> to your scene.
/// <br></br><br></br>
/// <strong style='color:red'>!IMPORTANT</strong> If you would like to <strong>use the OT class with the static functions from Javascript</strong>, make sure that you
/// create a root 'Standard Assets' folder in your project and  move the OT C# script into it. By doing so, it will be available in
/// your JS scripts and not give you a 'type not found' error.
/// </remarks>
[ExecuteInEditMode]
public class OT : MonoBehaviour
{
    static OT instance = null;
	
	public enum World { WorldSide2D, WorldTopDown2D, World3D };
        
	/// <summary>
	/// The object prototypes tha orthello knows
	/// </summary>
    public OTObjectType[] objectPrototypes;
    /// <summary>
    /// Material references known to the Orthello framework.
    /// </summary>
    /// <remarks>
    /// Orthello comes with several base materials that are pre-configured. These materials can be 
    /// expanded at your covenience. The base principle is to link a material name to a material
    /// object and use that material on an object by assigning <see cref="OTSprite.materialReference" />.
    /// The default materials : solid, transparent and additive can be activated by checking the
    /// setting the sprite properties <see cref="OTSprite.transparent" /> and <see cref="OTSprite.additive" />.
    /// </remarks>
    public OTMatRef[] materials;
	public World _world = World.WorldSide2D;
	
	public bool deactivatePrototypes = true;
	public bool _debug = false;
	public bool _reset = false;
	
	static bool _passive = false;
	static public bool passive
	{
		get
		{
			return _passive;
		}
		set
		{
			_passive = value;
			instance.enabled = !value;
			view.enabled = !value;
			
		}
	}
		
	static Camera[] _inputCameras = new Camera[] {};
	/// <summary>
	/// Gets or sets the input cameras.
	/// </summary>
	/// <remarks>
	/// When using multiple camera's to construct your display
	/// and both camera's are at different world positions and contain
	/// orthello elements that have to be captured for input, fill
	/// this array with all camera's that are viewing Orthello objects.
	/// </remarks>
	public static Camera[] inputCameras
	{
		get
		{
			if (_inputCameras.Length == 0)
				_inputCameras = new Camera[] { OT.view.camera };
			return _inputCameras;
		}
		set
		{
			_inputCameras = value;
		}			
	}
	
	static bool _painterAlgorithm = true;
	/// <summary>
	/// Gets or sets a value indicating whether the painter algorithm is used.
	/// </summary>
	/// <remarks>
	/// Defaults to true. When the painter algorithm is used, the x and y position
	/// are taken into account when calculating the depth. Adding a fractured number
	/// to the zValue and thus order sprites left to right and top to bottom when
	/// they are on the same depth (layer)
	/// </remarks>
	public static bool painterAlgorithm
	{
		get
		{
			return _painterAlgorithm;
		}
		set
		{
			_painterAlgorithm = value;
		}
	}
	
	
	static bool _loaded = false;
	/// <summary>
	/// Gets a value indicating whether the Orthello system is loaded.
	/// </summary>
	public static bool loaded
	{
		get
		{
			return _loaded;
		}
	}
	
	/// <summary>
	/// Gets a value indicating whether the Orthello system has a 3D orientation
	/// </summary>
	public static bool world3D
	{
		get
		{
			return (world == World.World3D);
		}
	}
	
	/// <summary>
	/// Gets a value indicating whether the Orthello system has a 3D orientation
	/// </summary>
	public static bool world2D
	{
		get
		{
			return (world != World.World3D);
		}
	}
	
	/// <summary>
	/// Gets the world type of this orthello system
	/// </summary>
	public static World world
	{
		get
		{
			if (!isValid)
				return World.WorldSide2D;
			return (instance._world);
		}
	}	
		
	   	
    /// <summary>
    /// Check and handle object setting changes while playing.
    /// </summary>   
    /// <remarks>
    /// When the system checks settings, it will for example
    /// add a collider and a rigidbody when you set collidable to true.
    /// Normally you wont need this functionality while the application
    /// is playing but you can set this to true when you are building
    /// up sprites from scratch. This will cost about 10fps (very rough estimate).
    /// </remarks>
    public static bool dirtyChecks = false;

    /// <summary>
    /// Uses object pooling when creating and destroying objects
    /// </summary>   
    /// <remarks>
    /// When objectPooling is set to true, Orthello uses object pooling when
    /// creating and destroying objects. This means that when an object is
    /// created using the OT.CreateObject(..) method is will be put in an
    /// object pool when it is destroyed. A new CreateObject request will than 
    /// re-use this object instead of creating another one.<br></br><br></br>
    /// If more objects need to created than available in the pool, the system
    /// will instantiate objects as normal.<br></br><br></br>
    /// You can use <see cref="OT.PreFabricate" />(prototype,number) to fill the object pool
    /// even before objects are requested using OT.CreateObject.
    /// </remarks>
    public static bool objectPooling = true;

    /// <summary>
    /// if true, debug mode will be active
    /// </summary>
    /// <remarks>\
    /// Use OTDebug class to send debug messages to the Orthello framework. These
	/// message can be viewed using normal GUI by toggling the messages on/off
	/// The Key-code for the toggle or the doubleTap-location for a mobile device 
	/// can be configured.
    /// </remarks>
    public static bool debug
	{
		get
		{
			if (!isValid)
				return false;
			return instance._debug;
		}
		set
		{
			if (!isValid)
				return;
			instance._debug = value;
		}
	}
	
	/// <summary>
	/// Gets the (first) valid touch after you OT.Over or OT.Clicked
	/// </summary>
	/// <value>
	/// The touch.
	/// </value>
	public static Touch touch
	{
		get
		{
			if (instance!=null)
				return instance._touch;
			Touch t = new Touch();
			return t;
		}
	}
	
	/// <summary>
	/// Gets a value indicating whether we are on a mobile platform
	/// </summary>
	/// <value>
	/// <c>true</c> if on a mobile platform; otherwise, <c>false</c>.
	/// </value>
	public static bool mobile
	{
		get
		{
			return (Application.platform == RuntimePlatform.Android || Application.platform == RuntimePlatform.IPhonePlayer);
		}
	}

    /// <summary>
    /// Check if all containers are ready.
    /// </summary>
    /// <returns>True if all containers are initialized and ready</returns>
    public static bool ContainersReady()
    {
        if (!OT.isValid) return false;
        for (int c = 0; c < containerCount; c++)
        {
            OTContainer co = instance.containerList[c];
            if (!co.isReady) return false;
        }
        return true;
    }
			
	public static bool multiDrag
	{
		get
		{
			if (!isValid)
				return false;
			return instance._multiDrag;
		}
		set
		{
			if (!isValid)				
				return;
			instance._multiDrag = value;
		}
	}
	
	static List<OTObject> persistantObjects = new List<OTObject>();
	public static void Persist(OTObject o)
	{
		if (!persistantObjects.Contains(o))
			persistantObjects.Add(o);
		DontDestroyOnLoad(o.gameObject);
	}
	
	/// <summary>
	/// Finds an orthello child object based on the begin of a name
	/// </summary>
	public static OTObject FindChild(GameObject go, string name)
	{
		if (go != null)
		{
			for (int g=0; g<go.transform.childCount; g++)
			{
				Transform tr = go.transform.GetChild(g);
				if (tr.gameObject.name.IndexOf(name)==0)
					return tr.gameObject.GetComponent<OTObject>();
			}
		}
		return null;
	}
	public static OTObject FindChild(OTObject o, string name)
	{
		return FindChild(o.gameObject,name);
	}	
	
	
	static bool _isValid = false;
    /// <summary>
    /// Framework initialization indicator.
    /// </summary>
    /// <remarks>
    /// Check this setting to see if the framework is readyto be used.
    /// </remarks>
    public static bool isValid
    {
        get
        {
			if (_isValid)
				return true;
			
            if (instance == null)
            {
                GameObject OT = GameObject.Find("OT");
				if (OT==null)
					   OT = GameObject.Find("OT-3D");
                if (OT != null)
                    instance = OT.GetComponent<OT>();
                if (instance==null)
                    return false;
				
				instance._sound = instance.GetComponent<OTSounds>();				
            }

            if (materialSolid == null || materialTransparent == null || materialAdditive == null)
            {
               Debug.LogError("Orthello : Not all materials assigned on OT object!");
               return false;
            }
									
            // if we are in editor mode and just compiled source code
            // all dictionaries (lookups) will be cleared so we have to 
            // re-create the lookup tables
            if (!Application.isPlaying)
            {
                if (instance.objects.Count > 0 && instance.lookup.Count == 0)
                    instance.createLookups();
                if (instance.animationList.Count > 0 && instance.animations.Count == 0)
                    instance.createAnimationLookups();
                if (instance.containerList.Count > 0 && instance.containers.Count == 0)
                    instance.createContainerLookups();
				
				if (instance.objectPrototypes.Length>0 && OTObjectType.lookup.Count==0)
				{
	                for (int o = 0; o < instance.objectPrototypes.Length; o++)
					{
						if (!OTObjectType.lookup.ContainsKey(instance.objectPrototypes[o].name.ToLower()))
	                    	OTObjectType.lookup.Add(instance.objectPrototypes[o].name.ToLower(), instance.objectPrototypes[o].prototype);
					}
				}
            }
			_loaded = true;
			_isValid = true;
            return true;
        }
    }

    /// <summary>
    /// Current update frames per second
    /// </summary>
    public static float fps
    {
        get
        {
            if (instance != null)
                return instance._fps;
            else
                return 0;
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public static int objectCount
    {
        get
        {
            if (instance != null)
                return instance.objects.Count;
            else
                return 0;
        }
    }

    /// <summary>
    /// Number of registered containers
    /// </summary>
    public static int containerCount
    {
        get
        {
            if (instance != null)
                return instance.containerList.Count;
            else
                return 0;
        }
    }

    /// <summary>
    /// Number of registered animations
    /// </summary>
    public static int animationCount
    {
        get
        {
            if (instance != null)
                return instance.animationList.Count;
            else
                return 0;
        }
    }

    /// <summary>
    /// Main camera view controller
    /// </summary>
    public static OTView view
    {
        get
        {
            if (isValid)
                return instance._view;
            else
                return null;
        }
    }
    
    /// <summary>
    /// Main sound controller
    /// </summary>
    public static OTSounds sound
    {
        get
        {
            if (isValid)
                return instance._sound;
            else
                return null;
        }
    }	
    
    public static Material materialSolid
    {
        get
        {
            if (instance != null)
            {
                if (instance._materialSolid == null)
                    instance._materialSolid = instance._GetMaterial("solid",new Color(0.5f,0.5f,0.5f),1);
                return instance._materialSolid;
            }
            else
                return null;
        }
    }

    
    public static Material materialTransparent
    {
        get
        {
            if (instance != null)
            {
                if (instance._materialTransparent == null)
                    instance._materialTransparent = instance._GetMaterial("transparent",new Color(0.5f,0.5f,0.5f),1);
                return instance._materialTransparent;
            }
            else
                return null;
        }
    }

    
    public static Material materialAdditive
    {
        get
        {
            if (instance != null)
            {
                if (instance._materialAdditive == null)
                    instance._materialAdditive = instance._GetMaterial("additive",new Color(0.5f,0.5f,0.5f),1);
                return instance._materialAdditive;
            }
            else
                return null;
        }
    }

    /// <summary>
    /// Checks if we are over a specific GameObject
    /// </summary>
    /// <param name="g">GameObject to check</param>
    /// <returns>True if we are over the GameObject</returns>
    public static bool Over(GameObject g)
    {
        if (g.collider != null)
        {
			if (Input.touches.Length>0)
			{
				for (int t=0; t<Input.touches.Length; t++)
				{
					// check if any of the touches are over/on the object
		            RaycastHit hit;
		            bool found = g.collider.Raycast(view.camera.ScreenPointToRay(Input.touches[t].position), out hit, 2500f);				
					if (found)
					{
						instance._touch = Input.touches[t];
						return true;
					}
				}				
			}
			else
			{						
				// check if the mouse is over the object
	            RaycastHit hit;
	            return (g.collider.Raycast(view.camera.ScreenPointToRay(Input.mousePosition), out hit, 2500f));
			}
        }
        return false;
    }
	
	/// <summary>
	/// Reset's the orthello system
	/// </summary>
	public static void Reset()
	{
		if (!isValid) return;
		instance._Reset();
	}

	/// <summary>
	/// Find an animating sprite
	/// </summary>
	public static OTAnimatingSprite AnimatingSprite(string name)
	{
		return ObjectByName(name) as OTAnimatingSprite;
	}
	/// <summary>
	/// Find a filled sprite
	/// </summary>
	public static OTFilledSprite FilledSprite(string name)
	{
		return ObjectByName(name) as OTFilledSprite;
	}
	/// <summary>
	/// Find a scale9 sprite
	/// </summary>
	public static OTScale9Sprite Scale9Sprite(string name)
	{
		return ObjectByName(name) as OTScale9Sprite;
	}
	/// <summary>
	/// Find a gradient sprite
	/// </summary>
	public static OTGradientSprite GradientSprite(string name)
	{
		return ObjectByName(name) as OTGradientSprite;
	}
	/// <summary>
	/// Find a text sprite
	/// </summary>
	public static OTTextSprite TextSprite(string name)
	{
		return ObjectByName(name) as OTTextSprite;
	}
	/// <summary>
	/// Find a sprite
	/// </summary>
	public static OTSprite Sprite(string name)
	{
		return ObjectByName(name) as OTSprite;
	}
	
	
    /// <summary>
    /// Checks if we are over a specific Orthello object
    /// </summary>
    /// <param name="o">Orthello object to check</param>
    /// <returns>True if we are over the Orthello object</returns>
    public static bool Over(OTObject o)
    {
		return Over(o.gameObject);
    }

    /// <summary>
    /// Checks if we clicked the mouse with a specific button on a GameObject
    /// </summary>
    /// <param name="g">GameObject to check</param>
    /// <param name="button">Mouse button that has to be used</param>
    /// <returns>True if we clicked on the GameObject</returns>
    public static bool Clicked(GameObject g, int button)
    {
        if (g.collider != null && Input.GetMouseButtonDown(button))
            return Over(g);
        return false;
    }
    /// <summary>
    /// Checks if we clicked the mouse with the left button on a GameObject
    /// </summary>
    /// <param name="g">GameObject to check</param>
    /// <returns>True if we clicked on the GameObject</returns>
    public static bool Clicked(GameObject g)
    {
        return Clicked(g,0);
    }
    /// <summary>
    /// Checks if we touched a GameObject
    /// </summary>
    /// <param name="g">GameObject to check</param>
    /// <returns>True if we touched the GameObject</returns>
    public static bool Touched(GameObject g)
    {
        return Clicked(g);
    }
    /// <summary>
    /// Checks if we clicked the mouse with the left button on an Orthello object
    /// </summary>
    /// <param name="o">Orthello object to check</param>
    /// <returns>True if we clicked on the Orthello object</returns>
    public static bool Clicked(OTObject o)
    {
        return Clicked(o.gameObject,0);
    }
    /// <summary>
    /// Checks if we clicked the mouse with the left button on a orthello of game object
    /// </summary>
    /// <param name="g">name of object to check</param>
    /// <returns>True if we clicked on the GameObject</returns>
    public static bool Clicked(string s)
    {
        OTObject o = OT.ObjectByName(s);
		if (o!=null)
			return Clicked(o);
		GameObject g = GameObject.Find(s);
		if (g!=null)
			return Clicked(g);
		return false;				
    }
	
    /// <summary>
    /// Checks if we touched an Orthello object
    /// </summary>
    /// <param name="o">Orthello object to check</param>
    /// <returns>True if we touched the Orthello object</returns>
    public static bool Touched(OTObject o)
    {
        return Clicked(o.gameObject);
    }

    
    public static OTMatRef GetMatRef(string name)
    {
        if (instance != null)
        {
            return instance._GetMatRef(name);
        }
        else
            return null;
    }

    
    public static void MatInc(Material mat, string matName)
    {
        if (instance != null)
            instance._MatInc(mat, matName);
    }
    
    public static void MatDec(Material mat, string matName)
    {
        if (instance != null)
            instance._MatDec(mat, matName);
    }

    
    public static Material GetMaterial(string name,float alpha)
    {
        return GetMaterial(name, new Color(0.5f,0.5f,0.5f), alpha);
    }
    
    public static Material GetMaterial(string name)
    {
        return GetMaterial(name, new Color(0.5f, 0.5f, 0.5f), 1);
    }
    
    public static Material GetMaterial(string name, Color tintColor)
    {
        return GetMaterial(name, tintColor, 1);
    }
    
    public static Material GetMaterial(string name, Color tintColor, float alpha)
    {
        if (isValid)
        {
            Material m = instance._GetMaterial(name, tintColor, alpha);
            if (m == null)
                m = LookupMaterial(name);
            return m;
        }
        return null;
    }
		
	public static void ClearMaterials(string name)
	{
		if (isValid)
		{
			instance._ClearMaterials(name);
		}
	}

	public static void ClearMaterials()
	{
		ClearMaterials("");
	}
    
    public static Material LookupMaterial(string name)
    {
        if (isValid)
        {
            return instance._LookupMaterial(name);
        }
        return null;
    }

    
    public static bool IsRegistered(OTObject o)
    {
        if (isValid)
            return instance._IsRegistered(o);
        else
            return false;
    }

    
    public static void RegisterLookup(OTObject o, string oldName)
    {
        if (isValid)
            instance._RegisterLookup(o, oldName);
    }

    
    public static void Register(OTObject o)
    {
        if (isValid)
            instance._Register(o);
    }

    
    public static void RegisterContainer(OTContainer container)
    {
        if (isValid)
            instance._RegisterContainer(container);
    }

    
    public static void RegisterContainerLookup(OTContainer container, string oldName)
    {
        if (isValid)
            instance._RegisterContainerLookup(container, oldName);
    }

    /// <summary>
    /// Get a container using a name lookup
    /// </summary>
    /// <param name="name">Name of sprite container object to find</param>
    /// <returns>OTContainer or null is none was found</returns>
    public static OTContainer ContainerByName(string name)
    {
        if (isValid)
            return instance._ContainerByName(name);
        else
            return null;
    }

    
    public static void RegisterAnimation(OTAnimation animation)
    {
        if (isValid)
            instance._RegisterAnimation(animation);
    }

    
    public static void RegisterMaterial(string name, Material mat)
    {
        if (isValid)
            instance._RegisterMaterial(name, mat);
    }

    
    public static void RegisterAnimationLookup(OTAnimation animation, string oldName)
    {
        if (isValid)
            instance._RegisterAnimationLookup(animation, oldName);
    }

    /// <summary>
    /// Get an animation using a name lookup
    /// </summary>
    /// <param name="name">Name of animation object to find</param>
    /// <returns>OTAnimation object or null is none was found</returns>
    public static OTAnimation AnimationByName(string name)
    {
        if (isValid)
            return instance._AnimationByName(name);
        else
            return null;
    }

    /// <summary>
    /// Get an object using a name lookup
    /// </summary>
    /// <param name="name">Name of object to find</param>
    /// <returns>OTObject or null is none was found</returns>
    public static OTObject ObjectByName(string name)
    {
        if (isValid)
            return instance._ObjectByName(name);
        else
            return null;
    }


    
    public static void InputTo(OTObject o)
    {
        if (isValid)
            instance._InputTo(o);
    }
    
    public static void NoInputTo(OTObject o)
    {
        if (isValid)
            instance._NoInputTo(o);
    }

    
    public static bool recordMode
    {
        get
        {
            if (instance != null)
            {
#if UNITY_EDITOR
				if (!Application.isPlaying)
					instance._recordMode = instance.RecordMode(false,false);
#endif
				return instance._recordMode;
            }
            else
                return false;
        }
    }
	
	
    /// <summary>
    /// Creates an objectpool of a specific number of objectPrototype instances
    /// </summary>
    /// <param name="objectPrototype">Name of object prototype for objectpool</param>
    /// <param name="numberOfInstances">Objectpool size</param>
    public static void PreFabricate(string objectPrototype, int numberOfInstances)
    {
        if (isValid)
            instance._PreFabricate(objectPrototype, numberOfInstances);
        return ;
    }

    /// <summary>
    /// Creates a new gameobject from a registered prototype
    /// </summary>
    /// <param name="objectPrototype">Name of object prototype to create</param>
    /// <returns>Created or pooled GameObject</returns>
    public static GameObject CreateObject(string objectPrototype)
    {
        if (isValid)
            return instance._CreateObject(objectPrototype);
        return null;
    }
	
    /// <summary>
    /// Creates a new OTSprite from a registered prototype
    /// </summary>
    /// <param name="objectPrototype">Name of object prototype to create</param>
    /// <returns>Created or pooled OTSprite</returns>
    public static OTSprite CreateSprite(string objectPrototype)
    {
        if (isValid)
            return instance._CreateObject(objectPrototype).GetComponent<OTSprite>();
        return null;
    }

    /// <summary>
    /// Destroys an Orthello object and puts it back into the object pool
    /// </summary>
    public static void DestroyObject(OTObject o)
    {
		if (o==null) return;
        if (isValid)
            instance._DestroyObject(o);
    }

    /// <summary>
    /// Destroys an Orthello object and puts it back into the object pool
    /// </summary>
    public static void DestroyObject(Component c)
    {
		if (c==null) return;
        if (isValid)
            instance._DestroyObject(c.gameObject);
    }
	
    /// <summary>
    /// Destroys an gameobject and puts it back into the object pool
    /// </summary>
    public static void DestroyObject(GameObject g)
    {
		if (g==null) return;
        if (isValid)
            instance._DestroyObject(g);
    }

    /// <summary>
    /// Destroys an Orthello container
    /// </summary>
    public static void DestroyContainer(OTContainer container)
    {
        if (isValid)
            instance._DestroyContainer(container);
    }

    /// <summary>
    /// Destroys an Orthello animation
    /// </summary>
    public static void DestroyAnimation(OTAnimation animation)
    {
        if (isValid)
            instance._DestroyAnimation(animation);
    }

    /// <summary>
    /// Destroys all Orthello objects
    /// </summary>
    public static void DestroyAll()
    {
        if (isValid)
            instance._DestroyAll();
    }

    /// <summary>
    /// Destroys all Orthello objects
    /// </summary>
    public static void Destroy()
    {
        if (isValid)
            instance._DestroyAll();
    }

    
    public static void RemoveObject(OTObject o)
    {
        if (isValid)
            instance._RemoveObject(o);
    }
    
    public static void RemoveObject(GameObject g)
    {
        if (isValid)
            instance._RemoveObject(g);
    }

    
    public static void RemoveAnimation(OTAnimation o)
    {
        if (isValid)
            instance._RemoveAnimation(o);
    }

    
    public static void RemoveContainer(OTContainer o)
    {
        if (isValid)
            instance._RemoveContainer(o);
    }
	
	/// <summary>
	/// We are going to create orthello objects and build them from scratch.
	/// </summary>
	/// <remarks>
	/// Because normaly, orthello objects are created using the Unity3D editor environment
	/// some property checking and handling only takes place in editor mode. Sometimes however,
	/// we will need that same handling in runtime mode, for example, when building orthello objects
	/// from scratch. Using this method, all property checking and handling will be activated 
	/// ( OT.dirtyChecks = true ) for a few (10 should be enough) update cycles.
	/// </remarks>
	public static void RuntimeCreationMode()
	{
        if (isValid)
            instance._RuntimeCreationMode();
	}

    /// <summary>
    /// Prints a message to the console when OT.debug = true
    /// </summary>
    /// <param name="msg"></param>
    public static void Print(string msg)
    {
        if (isValid)
            instance._Print(msg);
    }


    
    public static void RegisterForClick(OTObject o)
    {
        if (isValid)
            instance._RegisterForClick(o);
    }
	
	public static Dictionary<Material, int> matcount
	{
		get
		{
			return instance.materialCount;
		}
	}
		
	public static List<OTSprite> ContainerSprites(OTContainer container)
	{
		if (isValid)
		{
			List<OTSprite> res = new List<OTSprite>();
			for (int o=0; o<instance.objects.Count; o++)
			{
				if (instance.objects[o] is OTSprite && (instance.objects[o] as OTSprite).spriteContainer == container)
					res.Add(instance.objects[o] as OTSprite);
			}
			return res;
		}
		return null;
	}
	
	
    List<OTObject> objects = new List<OTObject>();
    List<OTObject> inputObjects = new List<OTObject>();
    Dictionary<string, OTObject> lookup = new Dictionary<string, OTObject>();

    List<OTContainer> containerList = new List<OTContainer>();
    Dictionary<string, OTContainer> containers = new Dictionary<string, OTContainer>();

    List<OTAnimation> animationList = new List<OTAnimation>();
    Dictionary<string, OTAnimation> animations = new Dictionary<string, OTAnimation>();

    Dictionary<string, Material> materialLookup = new Dictionary<string, Material>();
    Dictionary<Material, int> materialCount = new Dictionary<Material,int>();

    Dictionary<string, List<GameObject>> objectPool = new Dictionary<string, List<GameObject>>();
    Dictionary<string, GameObject> objectPoolContainer = new Dictionary<string, GameObject>();
    Dictionary<string, int> objectPoolIndexer = new Dictionary<string, int>();
    Dictionary<int, string> gameObjectProtoTypes = new Dictionary<int, string>();
	
	List<OTController> controllers = new List<OTController>();

    Material _materialSolid = null;
    Material _materialTransparent = null;
    Material _materialAdditive = null;

	Touch _touch;
			
    float _fps;
    float fpsTime = 0;

    RaycastHit hit;
    RaycastHit[] hits;

    OTView _view = null;
	OTSounds _sound = null;
	World _world_ = World.WorldSide2D;

    // Use this for initialization
    void Awake()
    {
        instance = this;
		_sound = instance.GetComponent<OTSounds>();
		if (_sound==null)
			_sound = instance.gameObject.AddComponent<OTSounds>();
		
        // find view class as child of the OT main class
        for (int c = 0; c < transform.childCount; c++)
        {
            _view = transform.GetChild(c).gameObject.GetComponent<OTView>();
            if (_view != null)
                break;
        }
        if (view != null) view.InitView();
		
		_world_ = _world;

        if (Application.isPlaying)
        {
            OTObjectType.lookup.Clear();
            for (int o = 0; o < objectPrototypes.Length; o++)
			{
				if (!OTObjectType.lookup.ContainsKey(objectPrototypes[o].name.ToLower()))
                	OTObjectType.lookup.Add(objectPrototypes[o].name.ToLower(), objectPrototypes[o].prototype);
				else
					Debug.LogWarning("duplicate object prototype OT.objectPrototype "+objectPrototypes[o].name);
			}

            // check if we have an OT/Prototypes folder
            for (int c = 0; c < transform.childCount; c++)
            {
                string n = transform.GetChild(c).gameObject.name.ToLower();
                if (n == "prototype" || n == "prototypes")
                {
                    Transform t = transform.GetChild(c);
                    // object prototypes found so add them to the lookup table
                    for (int p = 0; p < t.childCount; p++)
					{
						string na = t.GetChild(p).gameObject.name.ToLower();
						if (!OTObjectType.lookup.ContainsKey(na))
                        	OTObjectType.lookup.Add(na, t.GetChild(p).gameObject);
						else
							Debug.LogWarning("duplicate object prototype : OT.prototypes."+t.GetChild(p).gameObject.name);
						
						if (deactivatePrototypes)
							t.GetChild(p).gameObject.SetActiveRecursively(false);							
					}
                    break;
                }
            }
			
        }
    }

    
    public OTMatRef _GetMatRef(string name)
    {
        for (int i = 0; i < materials.Length; i++)
        {
            OTMatRef mref = materials[i];
            if (mref.name.ToLower() == name.ToLower())
                return mref;
        }
        return null;
    }

	
    public OTObject[] _ObjectsUnderPoint(Vector2 screenPoint, OTObject[] checkObjects, OTObject[] ignoreObjects)
    {
        List<OTObject> _ignoreObjects = new List<OTObject>(ignoreObjects);
        List<OTObject> _checkObjects = new List<OTObject>(checkObjects);
        List<OTObject> _foundObjects = new List<OTObject>();
        List<RaycastHit> _hits = new List<RaycastHit>();

		for (int i=0; i<inputCameras.Length; i++)
		{
	        Ray ray = inputCameras[i].ScreenPointToRay(screenPoint);
	        hits = Physics.RaycastAll(ray, 5000);
	        if (hits.Length > 0)
	        {
	            for (int h = hits.Length - 1; h >= 0; h--)
	            {
	                OTObject o = hits[h].collider.gameObject.GetComponent<OTObject>();
	                if (_ignoreObjects.Contains(o)) continue;
	                if (o != null)
	                {
	                    if ((_checkObjects.Count > 0 && _checkObjects.Contains(o)) || _checkObjects.Count == 0)
	                    {
	                        _foundObjects.Add(o);
	                        _hits.Add(hits[h]);
	                    }
	                }
	            }
	        }				
		}
		
        hits = _hits.ToArray();
        return _foundObjects.ToArray();
    }
    /// <summary>
    /// Get all orthello objects under a specific point
    /// </summary>
    /// <param name="screenPoint">point on screen</param>
    /// <param name="checkObjects">valid objects, if empty all object will be valid</param>
    /// <param name="ignoreObjects">igonore these objects</param>
    /// <returns>Array with found valid objects</returns>
    public static OTObject[] ObjectsUnderPoint(Vector2 screenPoint, OTObject[] checkObjects, OTObject[] ignoreObjects)
    {
        if (!isValid) return null;
        return instance._ObjectsUnderPoint(screenPoint, checkObjects, ignoreObjects);
    }
    /// <summary>
    /// Get all orthello objects under a specific point
    /// </summary>
    /// <param name="screenPoint">point on screen</param>
    /// <param name="checkObjects">valid objects, if empty all object will be valid</param>
    /// <returns>Array with found valid objects</returns>
    public static OTObject[] ObjectsUnderPoint(Vector2 screenPoint, OTObject[] checkObjects)
    {
        if (!isValid) return null;
        return instance._ObjectsUnderPoint(screenPoint, checkObjects, new OTObject[] { });
    }
    /// <summary>
    /// Get all orthello objects under a specific point
    /// </summary>
    /// <param name="screenPoint">point on screen</param>
    /// <returns>Array with found valid objects</returns>
    public static OTObject[] ObjectsUnderPoint(Vector2 screenPoint)
    {
        if (!isValid) return null;
        return instance._ObjectsUnderPoint(screenPoint, new OTObject[] { }, new OTObject[] { });
    }
    /// <summary>
    /// Get all orthello objects under the mouse pointer
    /// </summary>
    /// <returns>Array with found valid objects</returns>
    public static OTObject[] ObjectsUnderPoint()
    {
        if (!isValid) return null;
		if (Input.touches.Length>0)
        	return instance._ObjectsUnderPoint(Input.touches[0].position, new OTObject[] { }, new OTObject[] { });
		else
        	return instance._ObjectsUnderPoint(Input.mousePosition, new OTObject[] { }, new OTObject[] { });
    }
    
    public OTObject _ObjectUnderPoint(Vector2 screenPoint, OTObject[] checkObjects, OTObject[] ignoreObjects)
    {
        List<OTObject> _foundObjects = new List<OTObject>(ObjectsUnderPoint(screenPoint, checkObjects, ignoreObjects));
        float depth = 9999;
        OTObject hitObject = null;
        hit = new RaycastHit();
        for (int f = 0; f < _foundObjects.Count; f++)
        {
            OTObject o = _foundObjects[f];
			if (OT.world == World.WorldTopDown2D)
			{
	            if (o.collider.transform.position.y<=depth)
	            {
	                hitObject = o;
	                hit = hits[f];
	                depth = o.collider.transform.position.y;
	            }
			}
			else
            if (o.collider.transform.position.z<=depth)
            {
                hitObject = o;
                hit = hits[f];
                depth = o.collider.transform.position.z;
            }
        }
        return hitObject;
    }
    /// <summary>
    /// Get closest object (lowest depth) under a specific point
    /// </summary>
    /// <param name="screenPoint">point on screen</param>
    /// <param name="checkObjects">valid objects, if empty all object will be valid</param>
    /// <param name="ignoreObjects">igonore these objects</param>
    /// <returns>OTObject or null if none was found</returns>
    public static OTObject ObjectUnderPoint(Vector2 screenPoint, OTObject[] checkObjects, OTObject[] ignoreObjects)
    {
        if (!isValid) return null;
        return instance._ObjectUnderPoint(screenPoint, checkObjects, ignoreObjects);
    }
    /// <summary>
    /// Get closest object (lowest depth) under a specific point
    /// </summary>
    /// <param name="screenPoint">point on screen</param>
    /// <param name="checkObjects">valid objects, if empty all object will be valid</param>
    /// <returns>OTObject or null if none was found</returns>
    public static OTObject ObjectUnderPoint(Vector2 screenPoint, OTObject[] checkObjects)
    {
        if (!isValid) return null;
        return instance._ObjectUnderPoint(screenPoint, checkObjects, new OTObject[] { });
    }
    /// <summary>
    /// Get closest object (lowest depth) under a specific point
    /// </summary>
    /// <param name="screenPoint">point on screen</param>
    /// <returns>OTObject or null if none was found</returns>
    public static OTObject ObjectUnderPoint(Vector2 screenPoint)
    {
        if (!isValid) return null;
        return instance._ObjectUnderPoint(screenPoint, new OTObject[] { }, new OTObject[] { });
    }
    /// <summary>
    /// Get closest object (lowest depth) under the mouse pointer
    /// </summary>
    /// <returns>OTObject or null if none was found</returns>
    public static OTObject ObjectUnderPoint()
    {
        if (!isValid) return null;
		
		if (Input.touches.Length>0)
        	return instance._ObjectUnderPoint(Input.touches[0].position, new OTObject[] { }, new OTObject[] { });
		else		
        	return instance._ObjectUnderPoint(Input.mousePosition, new OTObject[] { }, new OTObject[] { });
    }
	
	bool _multiDrag = false;
	Vector2 dragPosition;
	bool maybeDrag = false;
	int maybeButton = 0;
		
    void Drag(OTDragObject o, Vector2 pos)
    {
        Vector3 vp = new Vector3();
 
        if (OT.world == World.World3D)
        {
            float _depthAdjust = 1000 + transform.position.z;
            Vector3 mousePoint = new Vector3(pos.x, pos.y, _depthAdjust);
            Vector3 objectPoint = new Vector3(o.position.x, o.position.y, _depthAdjust);
            vp = OT.view.camera.ScreenToWorldPoint(mousePoint) - OT.view.camera.ScreenToWorldPoint(objectPoint);
        }
        else
            vp = OT.view.camera.ScreenToWorldPoint(pos) - OT.view.camera.ScreenToWorldPoint(o.position);
 
        if (OT.world == World.WorldTopDown2D)
            o.dragObject.position += new Vector2(vp.x, vp.z);
        else
            o.dragObject.position += (Vector2)vp;
 
        o.position = pos;
        o.dragObject.HandleDrag("drag", null);
    }
	
	void DragControl(OTObject dragObject)
	{
		if (!OTDragObject.Dragging(dragObject))
		{
			if (mobile)
			{
				if (touch.phase == TouchPhase.Began)
				{					
					if (!multiDrag)
 						OTDragObject.Clear();
					
					if (OTDragObject.ByFinger(touch.fingerId)==null)
						OTDragObject.New(touch.fingerId).position = touch.position;					
					
					
				}
				else
				{
					OTDragObject o = OTDragObject.ByFinger(touch.fingerId);
					if (!o.dragging)
					{
						if (touch.phase == TouchPhase.Moved && o!=null)
						{
							o.dragging = true;																	
							o.dragObject = dragObject;
							dragObject.HandleDrag("start", null);
							dragObject.dragTouch = touch;
							Drag(o,touch.position);				
						}
					}
				}
			}
			else
			{
				if (!maybeDrag && Input.GetMouseButton(dragObject.dragButton))
				{
					dragPosition = Input.mousePosition;
					maybeDrag = true;
					maybeButton = dragObject.dragButton;
				}
				else
				if (Input.GetMouseButton(dragObject.dragButton) && !((Vector2)Input.mousePosition).Equals(dragPosition))
				{
					OTDragObject o = OTDragObject.New(dragObject);
					o.dragging = true;
					o.position = dragPosition;
					maybeDrag = false;
					dragObject.HandleDrag("start", null);
					Drag(o, Input.mousePosition);				
				}
			}
		}
		else
		{
			// find touch
			OTDragObject o = OTDragObject.ByObject(dragObject);
			if (OT.mobile)
			{			
				if (o!=null)
				{	
					if (touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled)
					{
						dragObject.HandleDrag("end", null);
						OTDragObject.Remove(o);
					}
					else
					{
						dragObject.dragTouch = touch;						
						Drag(o, touch.position);						
					}
				}
			}
			else
			{
				if (!Input.GetMouseButton(dragObject.dragButton))
				{
					dragObject.HandleDrag("end", null);
					OTDragObject.Remove(o);
				}
				else
					Drag(o, Input.mousePosition);				
			}
		}
	}

	void EndDragObject(int idx)
	{
		if (OTDragObject.dragObjects[idx].dragging)
			OTDragObject.dragObjects[idx].dragObject.HandleDrag("end", null);
		OTDragObject.dragObjects.RemoveAt(idx);
	}
	

    void HandleInput(Vector2 screenPoint)
    {		
        OTObject hitObject = ObjectUnderPoint(screenPoint, inputObjects.ToArray());
        if (hitObject != null && hitObject.enabled)
		{
			if (hitObject.draggable && !OTDragObject.Dragging(hitObject))
				DragControl(hitObject);				
			hitObject.OnInput(hit.point);
		}
    }
	
	bool _recordMode = false;
#if UNITY_EDITOR
	float checkRecordModeFrequency = 0.5f;
	float recordModeCheckTime = 0;
    bool RecordMode(bool set, bool value)
    {		
        UnityEditor.EditorWindow W = null;
        System.Type T = System.Type.GetType("UnityEditor.AnimationWindow,UnityEditor");
        Object[] allAniWindows = Resources.FindObjectsOfTypeAll(T);
        if (allAniWindows.Length > 0)
            W = (UnityEditor.EditorWindow)allAniWindows[0];

        if (T != null && W != null)
        {
            if (set)
                T.InvokeMember("SetAutoRecordMode", System.Reflection.BindingFlags.InvokeMethod, null, W, new object[] { value });
            System.Object Res = T.InvokeMember("GetAutoRecordMode", System.Reflection.BindingFlags.InvokeMethod, null, W, null);
            return ((bool)Res);
        }
        return false;
    }
#endif
	
	
	void _ResetContainer(OTContainer container)
	{
		container.Reset();
	}
	void _ResetAnimation(OTAnimation animation)
	{
		animation.Reset();		
	}
	void _ResetObject(OTObject o)
	{
		o.Reset();
	}
	
	void _Reset()
	{
		materialLookup.Clear();
		materialCount.Clear();
		for (int i=0; i<containerList.Count; i++)
			_ResetContainer(containerList[i]);
		for (int i=0; i<animationList.Count; i++)
			_ResetAnimation(animationList[i]);
		for (int i=0; i<objects.Count; i++)
			_ResetObject(objects[i]);					 		
	}
		
    // Update is called once per frame
    void Update()
    {
        if (instance == null) instance = this;
		
		if (_reset || _world_!=_world)
		{
			if (_world_!=_world)
			{
				_world_ = _world;
				view.InitView();
			}
						
			_Reset();
			_reset = false;
		}
						
#if UNITY_EDITOR	
		recordModeCheckTime+=Time.deltaTime;
		if (recordModeCheckTime > checkRecordModeFrequency)
		{
			_recordMode = RecordMode(false,false);
			recordModeCheckTime = 0;
		}
#endif
		
        if (Application.isEditor || dirtyChecks)
        {
            if (!Vector3.Equals(transform.position, Vector3.zero))
                transform.position = Vector3.zero;
			
			if (dirtyChecks && runTimeCreationMode && dirtyChecksUpdateCycles++ > 10)
			{
				dirtyChecks = false;
				runTimeCreationMode = false;
			}
			
        }

        // check for clicks
        if (inputObjects.Count > 0)
        {
            if (Input.touchCount > 0 ||
                Input.GetMouseButton(0) ||
                Input.GetMouseButton(1) ||
                Input.GetMouseButton(2) ||
                Input.GetMouseButtonDown(0) ||
                Input.GetMouseButtonDown(1) ||
                Input.GetMouseButtonDown(2) ||
                Input.GetMouseButtonUp(0) ||
                Input.GetMouseButtonUp(1) ||
                Input.GetMouseButtonUp(2))
            {												
				if ((!(mobile && multiDrag)) && OTDragObject.isDragging)
				{
					if (mobile)
						for (int t=0; t<Input.touches.Length; t++)
							if (Input.touches[t].fingerId == OTDragObject.dragObjects[0].finger)
							{
								_touch = Input.touches[t];
								break;
							}
					
					DragControl(OTDragObject.dragObjects[0].dragObject);
				}
				else
				{							
	                if (Input.touchCount > 0)
					{
						List<int> fingers = new List<int>();
						for (int t=0; t<Input.touches.Length; t++)
						{
							_touch = Input.touches[t];
							if (mobile && multiDrag && OTDragObject.dragObjects.Count>0)
							{
								OTDragObject o = OTDragObject.ByFinger(touch.fingerId);
								if (o!=null && o.dragObject!=null && o.dragging)
									DragControl(o.dragObject);
							}
							
							if (_touch.phase !=  TouchPhase.Ended && _touch.phase !=  TouchPhase.Canceled)
								fingers.Add(touch.fingerId);
							
	                    	HandleInput(touch.position);
							
						}
						
						if (mobile && multiDrag && OTDragObject.dragObjects.Count>0)
						{
							if (Input.touches.Length==0)
								OTDragObject.Clear();
							else
							{								
								int i=0;
								while (i<OTDragObject.dragObjects.Count)
								{
									if (OTDragObject.dragObjects[i].dragging && !fingers.Contains(OTDragObject.dragObjects[i].finger))
										EndDragObject(i);
									else
										i++;
								}
							}
						}							
					}
	                else
	                    HandleInput(Input.mousePosition);                     
				}
            }
			else
			{
				if (mobile && Input.touchCount == 0)
				{					
					while (OTDragObject.dragObjects.Count>0)
						EndDragObject(0);
					OTDragObject.Clear();
				}
			}
        }

		if (maybeDrag && !Input.GetMouseButton(maybeButton))
			maybeDrag = false;
		
		
        // calculate fps every 100ms
        fpsTime += Time.deltaTime;
        if (fpsTime >= 0.25f)
        {
            _fps = (_fps + (int)1 / Time.deltaTime)/2;
            fpsTime = 0;
        }
		
		
		if (controllers.Count > 0)
        {
            for (int c = 0; c < controllers.Count; c++)
            {
                OTController co = controllers[c];
                if (co.enabled)
                    co.Update(Time.deltaTime);
            }
        }
		
		if (debug)
			OTDebug.Update();
		
    }

    bool _IsRegistered(OTObject o)
    {
        return lookup.ContainsKey(o.name);
    }

    void _RegisterLookup(OTObject o, string oldName)
    {
        if (objects.Contains(o))
        {
            if (lookup.ContainsKey(oldName.ToLower()) && lookup[oldName.ToLower()] == o)
                lookup.Remove(oldName.ToLower());
            if (lookup.ContainsKey(o.name.ToLower()))
                lookup.Remove(o.name.ToLower());
            lookup.Add(o.name.ToLower(), o);
        }
    }

    void _Register(OTObject o)
    {
        if (!objects.Contains(o))
            objects.Add(o);
        if (!lookup.ContainsKey(o.name.ToLower()))
            lookup.Add(o.name.ToLower(), o);
    }

    void _RegisterContainer(OTContainer container)
    {
        if (!containerList.Contains(container))
            containerList.Add(container);
        if (!containers.ContainsKey(container.name.ToLower()))
            containers.Add(container.name.ToLower(), container);
        else
        {
            if (containers[container.name.ToLower()] != container)
                Debug.LogError("More than one SpriteContainer with name '" + container.name + "'");
        }
		
		
		foreach (Transform child in transform)
		{
			if (child.name.ToLower() == "containers")
			{
				container.transform.parent = child.transform;
				break;
			}
		}
		
    }


    void _RegisterContainerLookup(OTContainer container, string oldName)
    {
        if (containerList.Contains(container))
        {
            if (containers.ContainsKey(oldName.ToLower()) && containers[oldName.ToLower()] == container)
                containers.Remove(oldName.ToLower());
            if (containers.ContainsKey(container.name.ToLower()))
                containers.Remove(container.name.ToLower());
            containers.Add(container.name.ToLower(), container);
        }
    }

    OTContainer _ContainerByName(string name)
    {
        if (containers.ContainsKey(name.ToLower()))
            return containers[name.ToLower()];
        else
            return null;
    }
    OTObject _ObjectByName(string name)
    {
        if (lookup.ContainsKey(name.ToLower()))
            return lookup[name.ToLower()];
        else
            return null;
    }

    void _Print(string msg)
    {
        if (debug)
			OTDebug.Message(msg);
    }


    void _RegisterAnimation(OTAnimation animation)
    {
        if (!animationList.Contains(animation))
            animationList.Add(animation);
        if (!animations.ContainsKey(animation.name.ToLower()))
            animations.Add(animation.name.ToLower(), animation);
        else
        {
            if (animations[animation.name.ToLower()] != animation)
                Debug.LogError("More than one Animation with name '" + animation.name + "'");
        }
		
		foreach (Transform child in transform)
		{
			if (child.name.ToLower() == "animations")
			{
				animation.transform.parent = child.transform;
				break;
			}
		}
				
		
    }

    void _RegisterAnimationLookup(OTAnimation animation, string oldName)
    {
        if (animationList.Contains(animation))
        {
            if (animations.ContainsKey(oldName.ToLower()) && animations[oldName.ToLower()] == animation)
                animations.Remove(oldName.ToLower());
            if (animations.ContainsKey(animation.name.ToLower()))
                animations.Remove(animation.name.ToLower());
            animations.Add(animation.name.ToLower(), animation);
        }
    }

    OTAnimation _AnimationByName(string name)
    {
        if (animations.ContainsKey(name.ToLower()))
            return animations[name.ToLower()];
        else
            return null;
    }

    void SetInputTo(OTObject o, bool value)
    {
        bool inputTo = inputObjects.Contains(o);
        if (!value && inputTo)
        {
            inputObjects.Remove(o);
        }
        else
        {
            if (value && !inputTo)
                inputObjects.Add(o);
        }
    }
    void _InputTo(OTObject o)
    {
        SetInputTo(o, true);
    }
    void _NoInputTo(OTObject o)
    {
        SetInputTo(o, false);
    }

    void _PreFabricate(string objectProtoType, int numberOfInstances)
    {
        List<GameObject> gObjects;
        string proto = objectProtoType.ToLower();
        GameObject pool = null;
        if (!objectPool.ContainsKey(proto))
        {
            gObjects = new List<GameObject>();
            objectPool.Add(proto, gObjects);
            GameObject pools = GetChild(gameObject, "ObjectPools");
            pool = GetChild(pools, objectProtoType);
            objectPoolContainer.Add(proto, pool);
            objectPoolIndexer.Add(proto, 0);
        }
        else
        {
            gObjects = objectPool[proto];
            pool = objectPoolContainer[proto];
        }
        int index = objectPoolIndexer[proto];
        while(gObjects.Count<numberOfInstances)
        {
            GameObject g = _CreateObject(proto, false);
            g.SetActiveRecursively(false);
            g.name = objectProtoType + "-" + (++index);
            if (pool!=null)
                g.transform.parent = pool.transform;
            OTObject o = g.GetComponent<OTObject>();
            if (o != null)
                o.name = g.name;
            gObjects.Add(g);
        }
        objectPoolIndexer[proto] = index;
    }

    GameObject GetChild(GameObject parent, string childName)
    {
        Transform t = parent.transform.Find(childName);
        if (t == null)
        {
            GameObject g = new GameObject();
            g.name = childName;
            g.transform.parent = parent.transform;
            t = g.transform;
        }
        return t.gameObject;
    }

    void _ToObjectPool(string poolName, GameObject g)
    {
        g.SetActiveRecursively(false);
        string _poolName = poolName.ToLower();
        List<GameObject> gObjects;
        GameObject pool = null;
        if (!objectPool.ContainsKey(_poolName))
        {
            gObjects = new List<GameObject>();
            GameObject pools = GetChild(gameObject, "ObjectPools");
            pool = GetChild(pools, poolName);
            objectPool.Add(_poolName, gObjects);
            objectPoolContainer.Add(_poolName, pool);
        }
        else
        {
            gObjects = objectPool[_poolName];
            pool = objectPoolContainer[_poolName];
        }
        if (pool!=null)
            g.transform.parent = pool.transform;
        gObjects.Add(g);
    }

    GameObject _CreateObject(string objectProtoType)
    {
        return _CreateObject(objectProtoType, Application.isPlaying);
    }

    GameObject _CreateObject(string objectProtoType, bool fromPool)
    {
        string proto = objectProtoType.ToLower();
        if (OTObjectType.lookup.ContainsKey(proto))
        {
            if (!fromPool || !objectPooling)
            {
                var g = Instantiate(OTObjectType.lookup[proto]) as GameObject;
                g.name = OTObjectType.lookup[proto].name;
                OTObject o = g.GetComponent<OTObject>();
                if (o != null)
                    o.protoType = objectProtoType;
                else
                    gameObjectProtoTypes.Add(g.GetInstanceID(), proto);
                if (g.renderer != null)
				{
					if (!(o is OTSprite))
                    	g.renderer.enabled = true;
					else
                    	(o as OTSprite).InvalidateSprite();
				}
                return g;
            }
            else
            {
                if (!objectPool.ContainsKey(proto))
                    _PreFabricate(proto, 1);
                List<GameObject> gObjects = objectPool[proto];
                if (gObjects.Count > 0)
                {
                    GameObject g = gObjects[0];
                    gObjects.RemoveAt(0);

                    OTObject o = g.GetComponent<OTObject>();
					GameObject gproto = OTObjectType.lookup[proto];
					if (gproto!=null)
					{
                    	OTObject oproto = gproto.GetComponent<OTObject>();
						if (o!=null && oproto!=null)
							o.Assign(oproto);
						else
						{
							g.transform.position = gproto.transform.position;
							g.transform.localScale = gproto.transform.localScale;
							g.transform.rotation = gproto.transform.rotation;								
						}
					}
                    g.transform.parent = null;
                    g.SetActiveRecursively(true);
					g.SendMessage("StartUp",null,SendMessageOptions.DontRequireReceiver);
                    if (g.renderer != null)
                        g.renderer.enabled = true;
                    return g;
                }
                else
                {
                    int index = (++objectPoolIndexer[proto]);
                    GameObject g = _CreateObject(objectProtoType, false);
                    g.name = objectProtoType + "-" + index;
                    OTObject o = g.GetComponent<OTObject>();
                    if (o != null)
                        o.name = g.name;
                    objectPoolIndexer[proto] = index;
                    return g;
                }
            }
        }
        return null;
    }

    void _RemoveObject(OTObject o)
    {
        if (objects.Contains(o))
        {
            string lname = o.name.ToLower();
            if (lookup.ContainsKey(lname))
                lookup.Remove(lname);
            if (objects.Contains(o))
                objects.Remove(o);
            if (inputObjects.Contains(o))
                inputObjects.Remove(o);
			if (persistantObjects.Contains(o))
				persistantObjects.Remove(o);
        }
        o.gameObject.SetActiveRecursively(false);
    }

    void _RemoveObject(GameObject g)
    {
        OTObject o = g.GetComponent<OTObject>();
        if (o != null)
            _RemoveObject(o);
        else
            g.SetActiveRecursively(false);
    }

    void _RemoveContainer(OTContainer container)
    {
        if (containerList.Contains(container))
        {
            string lname = container.name.ToLower();
            if (containers.ContainsKey(lname))
                containers.Remove(lname);
            if (containerList.Contains(container))
                containerList.Remove(container);
        }
    }
    void _RemoveAnimation(OTAnimation animation)
    {
        if (animationList.Contains(animation))
        {
            string lname = animation.name.ToLower();
            if (animations.ContainsKey(lname))
                animations.Remove(lname);
            if (animationList.Contains(animation))
                animationList.Remove(animation);
        }
    }

    void _DestroyObject(OTObject o, string pool)
    {
		if (o==null) return;
        _RemoveObject(o);
        if (pool != "" && objectPooling)
        {
            o.Dispose();
            _ToObjectPool(pool, o.gameObject);
        }
        else
        {
            if (o.gameObject != null)
			{
				if (o.passive)
					o.passive = false;
                Destroy(o.gameObject);
			}
        }
    }

    void _DestroyObject(OTObject o)
    {		
		if (o==null) return;
        _DestroyObject(o, o.protoType);
    }

    void _DestroyObject(GameObject g)
    {
		if (g==null) return;
        OTObject o = g.GetComponent<OTObject>();
        if (o != null)
            _DestroyObject(o, o.protoType);
        else
        {
            _RemoveObject(g);
            string pool = "";
            if (gameObjectProtoTypes.ContainsKey(g.GetInstanceID()))
                pool = gameObjectProtoTypes[g.GetInstanceID()];

            if (pool != "" && objectPooling)
                _ToObjectPool(pool, g);
            else
               Destroy(g);
        }
    }

    void _DestroyContainer(OTContainer container)
    {
        _RemoveContainer(container);
        if (container.gameObject != null)
            Destroy(container.gameObject);
    }

    void _DestroyAnimation(OTAnimation animation)
    {
        _RemoveAnimation(animation);
        if (animation.gameObject != null)
            Destroy(animation.gameObject);
    }

    void _DestroyAll()
    {
        while (objects.Count > 0)
            _DestroyObject(objects[0]);
        while (containerList.Count > 0)
            _DestroyContainer(containerList[0]);
        while (animationList.Count > 0)
            _DestroyAnimation(animationList[0]);
    }

    void createLookups()
    {
        int o = 0;

        while (o < objects.Count)
        {
            if (objects[o] != null)
            {
                _RegisterLookup(objects[o], objects[o].name);
                o++;
            }
            else
                objects.RemoveAt(o);
        }
    }

    void createAnimationLookups()
    {
        int o = 0;
        while (o < animationList.Count)
        {
            if (animationList[o] != null)
            {
                _RegisterAnimationLookup(animationList[o], animationList[o].name);
                o++;
            }
            else
                animationList.RemoveAt(o);
        }
    }

    void createContainerLookups()
    {
        int o = 0;
        while (o < containerList.Count)
        {
            if (containerList[o] != null)
            {
                _RegisterContainerLookup(containerList[o], containerList[o].name);
                o++;
            }
            else
                containerList.RemoveAt(o);
        }
    }

    void _RegisterForClick(OTObject o)
    {
        if (!inputObjects.Contains(o))
            inputObjects.Add(o);
    }
	
	void _ClearMaterials(string name)
	{			
		if (materialLookup.Count>0)
		{		
			List<KeyValuePair<string, Material>> toRemove = new List<KeyValuePair<string, Material>>();
			foreach(KeyValuePair<string ,Material> entry in materialLookup)
			{
			    if (entry.Key.IndexOf(name) == 0)
					toRemove.Add(entry);
			}
			
			for (int l=0; l<toRemove.Count; l++)
			{
				materialLookup.Remove(toRemove[l].Key);
				materialCount.Remove(toRemove[l].Value);
				DestroyImmediate(toRemove[l].Value);
			}
			
		}
	}

    
    Material _GetMaterial(string name, Color tintColor, float alpha)
    {
        for (int i = 0; i < materials.Length; i++)
        {
            OTMatRef mref = materials[i];
            if (mref.name.ToLower() == name.ToLower())
            {
                Material mat = mref.material;
                if (mref.fieldColorTint != "")
                    mat.SetColor(mref.fieldColorTint, tintColor);
                if (mref.fieldAlphaChannel != "")
                    mat.SetFloat(mref.fieldAlphaChannel, alpha);
                else
                    if (mref.fieldAlphaColor != "")
                    {
                        Color alphaColor = mat.GetColor(mref.fieldAlphaColor);
                        alphaColor.a = alpha;
                        mat.SetColor(mref.fieldAlphaColor, alphaColor);
                    }
                return mat;
            }
        }
        return null;
    }

    void _MatInc(Material mat, string matName)
    {
        if (mat == null) return;
						
		if (!materialLookup.ContainsKey(matName.ToLower()))
			materialLookup.Add(matName.ToLower(),mat);		
		
        if (materialCount.ContainsKey(mat))									
            materialCount[mat]++;
        else
            materialCount.Add(mat, 1);
									
		OTDebug.Message("inc++ ("+materialCount[mat]+") mat ["+matName+"]", "ot-mat");		
		
    }

    void _MatDec(Material mat, string matName)
    {
        if (mat == null) return;
        if (materialCount.ContainsKey(mat))
        {
            materialCount[mat]--;
			OTDebug.Message("dec-- ("+materialCount[mat]+") mat ["+matName+"]", "ot-mat");			
            if (materialCount[mat] == 0)
            {
				OTDebug.Message("rem mat ["+matName+"]", "ot-mat");
                materialCount.Remove(mat);
				if (materialLookup.ContainsKey(matName.ToLower()))
                	materialLookup.Remove(matName.ToLower());
                if (Application.isPlaying)				
                    Destroy(mat);
                else
                    DestroyImmediate(mat);
            }
        }
    }

    void _RegisterMaterial(string name, Material mat)
    {
        string lname = name.ToLower();
        if (!materialLookup.ContainsKey(lname))
            materialLookup.Add(lname, mat);
    }

    Material _LookupMaterial(string name)
    {
        string lname = name.ToLower();
        if (materialLookup.ContainsKey(lname))
            return materialLookup[lname];
        else
            return null;
    }
	
	int dirtyChecksUpdateCycles = 0;
	bool runTimeCreationMode = false;
	void _RuntimeCreationMode()	
	{
		runTimeCreationMode = true;
		dirtyChecksUpdateCycles = 0;
		dirtyChecks = true;
	}	
	
    
    OTController _Controller(System.Type controllerType, string name)
    {
        name = name.ToLower();
        for (int c = 0; c < controllers.Count; c++)
        {
            if (controllers[c].GetType() == controllerType)
            {
                if (name == "")
                    return controllers[c];
                else
                    if (controllers[c].name == name)
                        return controllers[c];
            }
        }
        return null;
    }
    /// <summary>
	/// Get a Controller from OT with a specific type and with a specific name
    /// </summary>
    /// <param name="controllerType">Type of controller to find</param>
    /// <param name="name">Name of controller to find</param>
    /// <returns>Controller found and null if none was found</returns>
    public static  OTController Controller(System.Type controllerType, string name)
    {
		if (!isValid) return null;
		return instance._Controller(controllerType, name);
	}
    /// <summary>
    /// Get first Controller from OT with a specific type
    /// </summary>
    /// <param name="controllerType">Type of controller to find</param>
    /// <returns>Controller found and null if none was found</returns>
    public static OTController Controller(System.Type controllerType)
    {
		if (!isValid) return null;
        return instance._Controller(controllerType, "");
    }
    /// <summary>
    /// Get a Controller from OT with a specific type and with a specific name
    /// </summary>
    /// <param name="controllerType">Type of controller to find</param>
    /// <param name="name">Name of controller to find</param>
    /// <returns>Controller found and null if none was found</returns>
    public static OTController Controller(string controllerType, string name)
    {
		if (!isValid) return null;
        return instance._Controller(System.Type.GetType(controllerType), name);
    }
    /// <summary>
    /// Get first Controller from OT with a specific type
    /// </summary>
    /// <param name="controllerType">Type of controller to find</param>
    /// <returns>Controller found and null if none was found</returns>
    public OTController Controller(string controllerType)
    {
		if (!isValid) return null;
        return instance._Controller(System.Type.GetType(controllerType), "");
    }
    
    void _AddController(OTController c)
    {
        if (!controllers.Contains(c))
            controllers.Add(c);
    }
	/// <summary>
    /// Adds a controller to OT
    /// </summary>
    /// <param name="c">Controller to add</param>
    public static void AddController(OTController c)
    {
		if (isValid) 
        	instance._AddController(c);
    }
	
	void _RemoveController(OTController c)
    {
        if (controllers.Contains(c))
            controllers.Remove(c);
    }
    /// <summary>
    /// Removes a controller from OT
    /// </summary>
    /// <param name="c">Controller to remove</param>
    public static void RemoveController(OTController c)
    {
		if (isValid) 
        	instance._RemoveController(c);
    }
		
	void OnGUI()
	{
		if (debug && OTDebug.showing)
			OTDebug.DisplayGUI();
	}			
	
	void OnLevelWasLoaded(int level)
	{
		for (int o = 0; o<persistantObjects.Count; o++)
		{
			OTObject obj = persistantObjects[o];
			if (obj!=null && obj.gameObject!=null)
			{
				_Register(obj);			
				if (obj.registerInput)
					_InputTo(obj);
			}
		}
		_inputCameras = new Camera[] {};
	}			
	
}

class OTDragObject {
	
	public bool dragging = false;
	
	public static bool isDragging
	{
		get
		{
			for (int i=0; i<dragObjects.Count; i++)
				if (dragObjects[i].dragging)
					return true;
			return false;
		}
	}

	public Vector2 position
	{
		get
		{
			return _position;			
		}
		set
		{
			_position = value;
		}		
	}
	
	
	public int finger
	{
		get
		{
			return _finger;			
		}
		set
		{
			_finger = value;
			if (!fingerLookup.ContainsKey(_finger))
				fingerLookup.Add(_finger,this);
		}		
	}
	
	public OTObject dragObject
	{
		get
		{
			return _dragObject;
		}
		set
		{
			_dragObject = value;
			if (!objectLookup.ContainsKey(_dragObject))
				objectLookup.Add(_dragObject,this);
		}
		
	}
	
	public static List<OTDragObject> dragObjects = new List<OTDragObject>();
	static Dictionary<int,OTDragObject> fingerLookup = new Dictionary<int, OTDragObject>();
	static Dictionary<OTObject,OTDragObject> objectLookup = new Dictionary<OTObject, OTDragObject>();
	
	int _finger = -1;
	OTObject _dragObject = null;
	Vector2 _position;
	
	public static OTDragObject New(int finger)
	{
		OTDragObject o = new OTDragObject();
		o.finger = finger;
		dragObjects.Add(o);
		return o;
	}

	public static OTDragObject New(OTObject dragObject)
	{
		Clear();
		OTDragObject o = new OTDragObject();
		o.dragObject = dragObject;
		dragObjects.Add(o);
		return o;
	}
		
	public static void Clear()
	{
		dragObjects.Clear();	
		fingerLookup.Clear();
		objectLookup.Clear();			
	}
	
	public static OTDragObject ByFinger(int fingerId)
	{
		if (fingerLookup.ContainsKey(fingerId))
			return fingerLookup[fingerId];
		else
			return null;
	}
	
	public static OTDragObject ByObject(OTObject dragObject)
	{
		if (objectLookup.ContainsKey(dragObject))
			return objectLookup[dragObject];
		else
			return null;
	}
	
	public static bool Dragging(OTObject dragObject)
	{
		OTDragObject o = ByObject(dragObject);
		return (o!= null && o.dragging);
	}
	
	public static void Remove(OTDragObject o)
	{
		if (objectLookup.ContainsKey(o.dragObject))
			objectLookup.Remove(o.dragObject);
		if (o.finger!=-1 && fingerLookup.ContainsKey(o.finger))
			fingerLookup.Remove(o.finger);
		
		if (dragObjects.Contains(o))
			dragObjects.Remove(o);
		
		if (dragObjects.Count == 0)
			Clear();
		
	}
	
}


/// <summary>
/// OT debug class
/// </summary>
/// <remarks>
/// This class is used to send debug messages to the Orthello framework. These
/// message can be viewed using normal GUI by toggling the messages on/off
/// The Key-code for the toggle or the doubleTap-location for a mobile device 
/// can be configured.
/// </remarks>
public class OTDebug
{

	/// <summary>
	/// Message type enumeration
	/// </summary>
	public enum MessageType
	{
		Error, Warning, Message
	}	

	/// <summary>
	/// Gets or sets the key to toggle the debug info
	/// </summary>
	public static string toggleKey
	{
		get
		{
			return _toggleKey;			
		}
		set
		{
			_toggleKey = value;
			keys = new string[]{};
		}
	}

	static List<OTDebug> debugs
	{
		get
		{
			return _debugs;
		}
	}
	
	/// <summary>
	/// Gets or sets the maximum number of lines of debug info that will be kept
	/// </summary>
	public static int maxLines
	{
		get
		{
			return _maxLines;
		}
		set
		{
			_maxLines = value;
			while (debugs.Count>_maxLines)
				debugs.RemoveAt(debugs.Count-1);				
		}
	}
	
	/// <summary>
	/// Gets a value indicating whether the debug info is showing.
	/// </summary>
	public static bool showing
	{
		get
		{
			return _showing;
		}
	}

	/// <summary>
	/// Gets or sets the number of fingers that will toggle
	/// the debug info on a mobile device
	/// </summary>
	public static int touchCount
	{
		get
		{
			return _touchCount;
		}
		set
		{
			_touchCount = value;
		}
	}
	
	/// <summary>
	/// Gets or sets the number of seconds then fingers
	/// must touch the screen before the debug info will be toggled
	/// </summary>
	public static string messageGroup
	{
		get
		{
			return _messageGroup;
		}
		set
		{
			_messageGroup = value;
			if (value!="")
				_messageGroups = new List<string>(_messageGroup.Split(','));
			else
				_messageGroups = new List<string>();							
		}
	}
	
	/// <summary>
	/// Gets or sets the number of seconds then fingers
	/// must touch the screen before the debug info will be toggled
	/// </summary>
	public static float touchTime
	{
		get
		{
			return _touchTime;
		}
		set
		{
			_touchTime = value;
		}
	}
		
	static List<OTDebug> _debugs = new List<OTDebug>();
	static int _maxLines = 150;
	static string _toggleKey = "shift+d";
	static int _touchCount = 2;
	static float _touchTime = .5f;
	static bool _showing = false;
	static string _messageGroup = "";
	static List<string> _messageGroups = new List<string>();
	
	public System.DateTime time ;
	public MessageType messageType = MessageType.Message;
	public string message = "";
		
	static void _Debug(MessageType messageType, string message)
	{
		OTDebug d = new OTDebug();		
		d.time = System.DateTime.Now;
		d.message = message;
		d.messageType = messageType;
		
		debugs.Insert(0,d);
		
		while (debugs.Count>_maxLines)
			debugs.RemoveAt(debugs.Count-1);				
	}
	
	
	public static void Show()
	{
		_showing = true;
	}
	
	public static void Hide()
	{
		_showing = true;
	}

	static string[] keys = new string[]{};
	static bool ToggleKey()
	{
		if (!Input.anyKeyDown && !Input.anyKey)
			return false;
		
		if (keys.Length == 0)
			keys = toggleKey.ToLower().Split('+');
		
		bool toggle = false;
		for (int k=0; k<keys.Length; k++)
		{
			if (keys[k] == "ctrl")
			{
				if (keys.Length == 1)
				  toggle = (Input.GetKeyDown(KeyCode.LeftControl)||Input.GetKeyDown(KeyCode.RightControl));
				else
				  toggle = (Input.GetKey(KeyCode.LeftControl)||Input.GetKey(KeyCode.RightControl));
			}
			else
			if (keys[k] == "alt")
			{
				if (keys.Length == 1)
				  toggle = (Input.GetKeyDown(KeyCode.LeftAlt)||Input.GetKeyDown(KeyCode.RightAlt));
				else
				  toggle = (Input.GetKey(KeyCode.LeftAlt)||Input.GetKey(KeyCode.RightAlt));
			}
			else
			if (keys[k] == "shift")
			{
				if (keys.Length == 1)
				  toggle = (Input.GetKeyDown(KeyCode.LeftShift)||Input.GetKeyDown(KeyCode.RightShift));
				else
				  toggle = (Input.GetKey(KeyCode.LeftShift)||Input.GetKey(KeyCode.RightShift));
			}
			else
			{
				if (k == keys.Length-1)
					toggle = Input.GetKeyDown(keys[k]);
				else
					toggle = Input.GetKey(keys[k]);
			}
			

			if (!toggle) 
				return false;
		}
		return toggle;
	}
	
	static bool canTouch = true;
	static float touchTimer = 0;
	public static void Update()
	{
		if (!OT.debug) return;
		
		if (OT.mobile)
		{
			if (Application.platform == RuntimePlatform.Android &&
				Input.GetKey(KeyCode.Escape))
			{
				Application.Quit();
				return;
			}
			
			if (Input.touches.Length==touchCount && canTouch)
			{
				touchTimer += Time.deltaTime;
				if (touchTimer > touchTime)
				{
					_showing = !_showing;				
					canTouch = false;
				}
			}
			else
			{
				if (Input.touches.Length == 0)
				{
					canTouch = true;
					touchTimer = 0;
				}
			}
		}
		else
		{
			if (ToggleKey())
				_showing = !showing;
		}						
	}
	
	public static void Message(string message, string group)
	{
		if (!OT.debug) return;
		if (group == "" || _messageGroups.Contains(group))
		{
			if (Application.isEditor)
				Debug.Log(message);
			OTDebug._Debug(MessageType.Message,message);
		}
	}
	public static void Message(string message)
	{
		Message(message,"");
	}
	
	public static void Error(string message)
	{
		if (!OT.debug) return;
		if (Application.isEditor)
			Debug.LogError(message);
		OTDebug._Debug(MessageType.Error,message);
	}
	public static void Warning(string message)
	{
		if (!OT.debug) return;
		if (Application.isEditor)
			Debug.LogWarning(message);
		OTDebug._Debug(MessageType.Warning,message);
	}
	
	public static void Clear()
	{
		debugs.Clear();
	}
	
	static Vector2 scrollPos = Vector2.zero;
	public static void DisplayGUI()
	{
		GUI.skin.label.normal.textColor = new Color(.9f,.5f,.2f);
		GUIStyle label = new GUIStyle(GUI.skin.label);
		label.normal.textColor = Color.yellow;
		GUI.Box(new Rect(10,10,Screen.width/2, Screen.height-20),"Orthello - Debug - Messages");
		GUI.Box(new Rect(15,35,(Screen.width/2)-10, Screen.height-80),"");
		int py = 40;
		scrollPos = GUI.BeginScrollView(new Rect(15,40,(Screen.width/2)-10, Screen.height - 90),scrollPos, new Rect(15,40,(Screen.width/2)-30 , debugs.Count * 20));
		for (int m=0; m<debugs.Count; m++)
		{
			GUI.Label(new Rect(20,py,(Screen.width/2)-20,25), debugs[m].time.ToString("H:mm:ss")+" - ");
			if (debugs[m].message.IndexOf("@")==0)
				GUI.Label(new Rect(120,py,(Screen.width/2)-20,25), debugs[m].message, label);
			else
				GUI.Label(new Rect(120,py,(Screen.width/2)-20,25), debugs[m].message);
			py+=20;
		}
		GUI.EndScrollView();
		if (GUI.Button(new Rect(20,Screen.height-40,50,20),"Clear"))
			OTDebug.Clear();
		
		GUI.Label(new Rect(80,Screen.height-40,100,20),"Time scale :", label);
		Time.timeScale = GUI.HorizontalSlider(new Rect(165,Screen.height-34,100,20),Time.timeScale,0f,10f);
		string ts = GUI.TextField(new Rect(272,Screen.height-40,40,20),""+(int)Time.timeScale);
		try{
			Time.timeScale = (int)System.Convert.ToDecimal(ts);
		}
		catch(System.Exception)
		{
		}		
		GUI.Label(new Rect(320,Screen.height-40,100,20),"OTObjects :", label);
		GUI.Label(new Rect(395,Screen.height-40,100,20),""+OT.objectCount);
		GUI.Label(new Rect(420,Screen.height-40,100,20),"FPS :", label);
		GUI.Label(new Rect(460,Screen.height-40,100,20),""+(int)OT.fps);
			
	}
		
}