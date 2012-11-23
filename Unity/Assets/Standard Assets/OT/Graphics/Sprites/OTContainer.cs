using UnityEngine;
using System.Collections;
using System.Collections.Generic;
 
/// <summary>
/// Provides base functionality to handle textures with multiple image frames.
/// </summary>
[ExecuteInEditMode]
public class OTContainer : MonoBehaviour
{
    
    public string _name = "";
    bool registered = false;
	        		
    protected bool dirtyContainer = true;    
    protected string _name_ = "";	

    /// <summary>
    /// Stores texture data of a specific container frame.
    /// </summary>
    public struct Frame
    {
        /// <summary>
        /// This frame's name
        /// </summary>
        public string name;
        /// <summary>
        /// This frame's image scale modifier
        /// </summary>
        public Vector2 size;
        /// <summary>
        /// This frame's original image size
        /// </summary>
        public Vector2 imageSize;
        /// <summary>
        /// This frame's world position offset modifier
        /// </summary>
        public Vector2 offset;
        /// <summary>
        /// This frame's world rotation modifier
        /// </summary>
        public float rotation;
        /// <summary>
        /// Texture UV coordinates (x/y).
        /// </summary>
        public Vector2[] uv;
        /// <summary>
        /// Mesh vertices used when OffsetSizing = false (Atlas)
        /// </summary>
        public Vector3[] vertices;
		/// <summary>
		/// The index of the frame
		/// </summary>
		public int index;
    }
			
    Frame[] frames = { };

    /// <summary>
    /// Name of the container
    /// </summary>
    new public string name
    {
        get
        {
            return _name;
        }
        set
        {
            string old = _name;
            _name = value;
            gameObject.name = _name;
            if (OT.isValid)
            {
                _name_ = _name;
                OT.RegisterContainerLookup(this, old);
            }
        }
    }
    /// <summary>
    /// Container ready indicator.
    /// </summary>
    /// <remarks>
    /// Container frame data or container texture can only be accessed when a container is ready.
    /// Be sure to check this when retrieving data programmaticly.
    /// </remarks>
    public bool isReady
    {
        get
        {
            return frames.Length > 0;
        }
    }
    /// <summary>
    /// Number of frames in this container.
    /// </summary>
    public int frameCount
    {
        get
        {
            return frames.Length;
        }
    }
    /// <summary>
    /// Overridable virtal method to provide a container's texture
    /// </summary>
    /// <returns>Container's texture</returns>
    public virtual Texture GetTexture()
    {
        return null;
    }
    /// <summary>
    /// Overridable virtal method to provide the container's frames
    /// </summary>
    /// <returns>Container's array of frames</returns>
    protected virtual Frame[] GetFrames()
    {
        return new Frame[] { };
    }
		
    /// <summary>
    /// Return the frame number by its name or -1 if it doesn't exist. 
    /// </summary>
    public virtual int GetFrameIndex(string inName)
    {
		Frame frame = FrameByName(inName);
		if (frame.name==inName)
			return frame.index;
		else
			return -1;		
    }
	
	
	protected void Awake()
	{
#if UNITY_EDITOR
		if (!Application.isPlaying)
			UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
#endif				
	}

    // Use this for initialization
    
    protected void Start()
    {
        // initialize attributes
        // initialize attributes
        _name_ = name;
        if (name == "")
		{
            name = "Container (id=" + this.gameObject.GetInstanceID() + ")";
#if UNITY_EDITOR
			if (!Application.isPlaying)
				UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
#endif										
		}

        RegisterContainer();
    }

    /// <summary>
    /// Retrieve a specific container frame.
    /// </summary>
    /// <remarks>
    /// The container frame contains data about each frame's texture offset and UV coordinates. The texture offset and scale 
    /// is used when this frame is mapped onto a single sprite. The UV coordinates are used when this images has to be mapped onto 
    /// a multi sprite mesh ( a SpriteBatch for example ).
    /// <br></br><br></br>
    /// When the index is out of bounce, an IndexOutOfRangeException  will be raised.
    /// </remarks>
    /// <param name="index">Index of container frame to retrieve. (starting at 0)</param>
    /// <returns>Retrieved container frame.</returns>
    public Frame GetFrame(int index)
    {
        if (frames.Length > index)
            return frames[index];
        else
        {
            throw new System.IndexOutOfRangeException("Frame index out of bounds ["+index+"]");
        }
    }
	
    void RegisterContainer()
    {
        if (OT.ContainerByName(name) == null)
        {
            OT.RegisterContainer(this);
            gameObject.name = name;
            registered = true;
        }
        if (_name_ != name)
        {
            OT.RegisterContainerLookup(this, _name_);
            _name_ = name;
            gameObject.name = name;
        }

        if (name != gameObject.name)
        {
            name = gameObject.name;
            OT.RegisterContainerLookup(this, _name_);
            _name_ = name;
 #if UNITY_EDITOR
			if (!Application.isPlaying)
				UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
#endif		
       }
    }	
		
	Dictionary<string, Frame> frameByName = new Dictionary<string, Frame>();
	public Frame FrameByName(string frameName)
	{
		if (frameByName.ContainsKey(frameName))
			return frameByName[frameName];
		if (frameByName.ContainsKey(frameName+".png"))
			return frameByName[frameName+".png"];
		if (frameByName.ContainsKey(frameName+".gif"))
			return frameByName[frameName+".gif"];
		if (frameByName.ContainsKey(frameName+".jpg"))
			return frameByName[frameName+".jpg"];
		return new Frame();
	}
	
	
    // Update is called once per frame
    
    protected void Update()
    {

        if (!OT.isValid) return;

        if (!registered || !Application.isPlaying)
            RegisterContainer();

        if (frames.Length == 0 && !dirtyContainer)
            dirtyContainer = true;

        if (dirtyContainer || !isReady)
        {
            frames = GetFrames();
			frameByName.Clear();
			for (int f=0; f<frames.Length; f++)
			{
				frames[f].index = f;			
				if (!frameByName.ContainsKey(frames[f].name))
					frameByName.Add(frames[f].name,frames[f]);
			}
			
			// remove all cached materials for this container
			OT.ClearMaterials("spc:"+name.ToLower());
			List<OTSprite> sprites = OT.ContainerSprites(this);
			for (int s=0; s<sprites.Count; s++)
				sprites[s].GetMat();
					
            dirtyContainer = false;
        }
    }

    void OnDestroy()
    {
        if (OT.isValid)
            OT.RemoveContainer(this);
    }
	
	public virtual void Reset()
	{
		dirtyContainer = true;
		Update();
	}

}