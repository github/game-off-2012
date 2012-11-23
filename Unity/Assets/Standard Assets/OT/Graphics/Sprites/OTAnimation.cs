using UnityEngine;
using System.Collections;
using System.Collections.Generic;
 
/// <summary>
/// To store one animations
/// </summary>
/// <remarks>
/// This object can hold one or more animations, contained in OTAnimationFramesets. 
/// Using an OTAnimatingSprite, you can play the entire animation or just one animation frameset.
/// 
/// Because of its multi frameset character, this object can hold many animations that can span across 
/// multiple spritesheets/atlases.
/// </remarks>
[ExecuteInEditMode]
public class OTAnimation : MonoBehaviour
{
    
    public string _name = "";
    
    public float _fps = 30;
    
    public float _duration = 1;
    /// <summary>
    /// Array with animation frameset data.
    /// </summary>
    /// <remarks>
    /// An animation consists of one or more animation framesets. This way it is easy to span an
    /// animation over more than one container. It is even possible to repeat containers and/or use different 
    /// start- and end-frames. 
    /// <br></br><br></br>
    /// By programmaticly playing only parts of an animation, one could even put all animation sequences in one
    /// animation object and control manually what sequences will be played.
    /// </remarks>
    public OTAnimationFrameset[] framesets;
	
    bool registered = false;
    bool dirtyAnimation = true;
    Frame[] frames = { };
    List<OTContainer> containers = new List<OTContainer>();
    bool _isReady = false;
    float _fps_ = 30;
    float _duration_ = 1;
    float _framesetSize = 0;

    
    protected string _name_ = "";

    /// <summary>
    /// Frames per second
    /// </summary>
    public float fps
    {
        get
        {
            return _fps;
        }
        set
        {
            _fps = value;
            Update();
        }
    }

    /// <summary>
    /// Duration of this animation
    /// </summary>
    public float duration
    {
        get
        {   
			return _duration;
        }
        set
        {
            _duration = value;
            Update();
        }
    }

    /// <summary>
    /// Animation name for lookup purposes.
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
                OT.RegisterAnimationLookup(this, old);
            }
        }
    }

    /// <summary>
    /// Stores data of a specific animation frame.
    /// </summary>
    public struct Frame
    {
        /// <summary>
        /// Frame's container
        /// </summary>
        public OTContainer container;
        /// <summary>
        /// Frame's container index
        /// </summary>
        public int frameIndex;
        //public Vector2 movement;
        //public float rotation;
        //public Vector2 scale;
    }

    /// <summary>
    /// Animation ready indicator.
    /// </summary>
    public bool isReady
    {
        get
        {
            return _isReady;
        }
    }

    
    public OTAnimationFrameset GetFrameset(string pName)
    {
        if (pName == "") return null;
        for (int f = 0; f < framesets.Length; f++)
        {
            if (framesets[f].name.ToLower() == pName.ToLower())
                return framesets[f];
        }
        return null;
    }

    
    public float GetDuration(OTAnimationFrameset frameset)
    {
        if (frameset != null)
        {
            return (frameset.singleDuration != 0) ?
                frameset.singleDuration : frameset.frameCount / fps;
        }
        else
            return duration;
    }

    /// <summary>
    /// Number of frames in this animation.
    /// </summary>
    public int frameCount
    {
        get
        {
            return frames.Length;
        }
    }

    /// <summary>
    /// Get number of frames in this animaation
    /// </summary>
    /// <remarks>
    /// If no <see cref="OTAnimationFrameset" /> is provided the number of frames of the entire animation is returned. If an OTAnimationFrameset is provided
    /// this method will return the number of frames of that particular frameset.
    /// </remarks>
    /// <param name="frameset">Get number of frames of a perticular animation frameset.</param>
    /// <returns>number of frames</returns>
    public int GetFrameCount(OTAnimationFrameset frameset)
    {
        if (frameset != null)
            return frameset.frameCount;
        else
            return frameCount;
    }

    int GetIndex(float time, int direction, OTAnimationFrameset frameset)
    {
        int index = 0;
        int fc = GetFrameCount(frameset);
        index = (int)Mathf.Floor((float)fc * (time / GetDuration(frameset)));
        while (index > fc - 1) index -= fc;
        if (direction == -1) index = fc - 1 - index;
        return index;
    }
	
    /// <summary>
    /// Retrieve the animation frame that is active at a specific time.
    /// </summary>
    /// <param name="time">Animation time in seconds.</param>
    /// <param name="direction">Animation direction, 1 = forward, -1 = backward</param>
    /// <param name="frameset">The animation frameset of which a frame is requested</param>
    /// <returns>Retrieved animation frame.</returns>
    public Frame GetFrame(float time, int direction, OTAnimationFrameset frameset)
    {
        if (frames.Length == 0)
        {
            return new Frame();
        }
        else
        {
            if (frameset != null)
            {
                return frames[frameset.startIndex+GetIndex(time, direction, frameset)];
            }
            else
			{
                return frames[GetIndex(time, direction, null)];
			}
        }
    }
	
	
	protected void Awake()
	{
#if UNITY_EDITOR
		if (!Application.isPlaying)
			UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
#endif				
	}

	
    // Use this for initialization
    void Start()
    {
        _duration_ = _duration;
        _fps_ = _fps;

        _name_ = name;
        if (name == "")
		{
            name = "Animation (id=" + this.gameObject.GetInstanceID() + ")";
#if UNITY_EDITOR
		if (!Application.isPlaying)
			UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
#endif							
		}
        RegisterAnimation();
    }

    
    protected Frame[] GetFrames()
    {
        List<Frame> frames = new List<Frame>();
        if (framesets.Length > 0)
        {
            int index = 0;
            for (int f = 0; f < framesets.Length; f++)
            {
                OTAnimationFrameset fs = framesets[f];
                fs.startIndex = index;
                index += fs.frameCount;

                int[] framesetFrames = fs.frameNumbers;

                foreach (int frameIndex in framesetFrames)
                {
                    Frame curFrame = new Frame();
                    curFrame.container = fs.container;
                    curFrame.frameIndex = frameIndex;
                    frames.Add(curFrame);
                }
            }
        }
        return frames.ToArray();
    }

    void RegisterAnimation()
    {
        if (OT.AnimationByName(name) == null)
        {
            OT.RegisterAnimation(this);
            gameObject.name = name;
            registered = true;
        }
        if (_name_ != name)
        {
            OT.RegisterAnimationLookup(this, _name_);
            _name_ = name;
            gameObject.name = name;
        }
        if (name != gameObject.name)
        {
            name = gameObject.name;
            OT.RegisterAnimationLookup(this, _name_);
            _name_ = name;
#if UNITY_EDITOR
			if (!Application.isPlaying)
				UnityEditor.PrefabUtility.RecordPrefabInstancePropertyModifications(this);
#endif		
			
        }
    }

    bool Ready()
    {
        if (!isReady)
        {
            _isReady = true;
            for (int f = 0; f < framesets.Length; f++)
            {
                OTAnimationFrameset fs = framesets[f];
                if (fs.container != null && !fs.container.isReady) _isReady = false;
            }
        }
        return _isReady;
    }

    void CheckEditorSettings()
    {
        if (frameCount == 0 && framesets.Length > 0 && !dirtyAnimation)
        {
            dirtyAnimation = true;
        }

        if (framesets.Length > 0)
        {
            if (_framesetSize != framesets.Length)
            {
                _framesetSize = framesets.Length;
                dirtyAnimation = true;
            }

            int _frameCount = 0;
            for (int f = 0; f < framesets.Length; f++)
            {
                OTAnimationFrameset fs = framesets[f];
                if (fs.container != null)
                {
                    if (f <= containers.Count - 1 && containers[f] != fs.container)
                    {
                        dirtyAnimation = true;
                    }

                    if (f <= containers.Count - 1)
                    {
                        if (containers[f] != fs.container)
                        {
                            dirtyAnimation = true;
                        }
                        containers[f] = fs.container;
                    }
                    else
                    {
                        containers.Add(fs.container);
                        dirtyAnimation = true;
                    }
					
					if (fs.container!=null)
						fs._containerName = fs.container.name;

                    if (fs.container.isReady)
                    {
                        if (fs.startFrame < 0) fs.startFrame = 0;
                        else
                            if (fs.startFrame >= fs.container.frameCount) fs.startFrame = fs.container.frameCount - 1;
                        if (fs.endFrame < 0) fs.endFrame = 0;
                        else
                            if (fs.endFrame >= fs.container.frameCount) fs.endFrame = fs.container.frameCount - 1;

                        _frameCount += fs.frameCount;
                    }
                }
                else
                {
					if (fs._containerName=="")
					{
                      fs.startFrame = -1;
                      fs.endFrame = -1;
					}
                }

                if (fs.playCount < 1) fs.playCount = 1;

            }

            if (frames != null)
            {
                if (_frameCount != frames.Length)
                {
                    dirtyAnimation = true;
                }
            }

            while (framesets.Length < containers.Count)
                containers.RemoveAt(containers.Count - 1);

        }
    }

    // Update is called once per frame
    void Update()
    {
        if (!OT.isValid || !Ready()) return;

        if (!registered || !Application.isPlaying)
            RegisterAnimation();

        if (Application.isEditor || OT.dirtyChecks)
            CheckEditorSettings();

        if (dirtyAnimation)
        {
			bool isOk = true;
            for (int f = 0; f < framesets.Length; f++)
            {
                OTAnimationFrameset fs = framesets[f];
				if (fs.container == null && fs._containerName!="")
				{
					OTContainer c = OT.ContainerByName(fs._containerName);
					if (c!=null && c.isReady) 
						fs.container = c;					
					else
					{
						isOk = false;
						break;
					}						
				}
			}
			
			if (isOk)
			{
	            frames = GetFrames();
	            dirtyAnimation = false;
	            _fps = frames.Length / _duration;
	            _fps_ = _fps;
			}
        }

        if (Application.isEditor || OT.dirtyChecks)
        {
            if (_duration > 0)
            {
                if (_duration_ != _duration)
                {
                    _duration_ = _duration;
                    _fps = frames.Length / _duration;
                    _fps_ = _fps;
                }
            }

            if (_fps > 0)
            {
                if (_fps_ != _fps)
                {
                    _fps_ = _fps;
                    _duration = frames.Length / _fps;
                    _duration_ = _duration;
                }
            }
        }
    }
	
	public virtual void Reset()
	{
		dirtyAnimation=true;
		Update();		
	}

    void OnDestroy()
    {
        if (OT.isValid)
            OT.RemoveAnimation(this);
    }

}
