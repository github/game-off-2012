using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[ExecuteInEditMode]
public class OTSounds : MonoBehaviour {
		
	public bool	 mute = false;
	public float volume = 1f;
	
	static OTSounds _instance;
	public static OTSounds instance
	{
		get
		{
			return _instance;
		}
	}
	
	public OTSoundClip[] soundClips;
	
	public Dictionary<string,OTSoundClip> lookup = new Dictionary<string, OTSoundClip>();
	public List<OTSound> sounds = new List<OTSound>();
	
	void Awake()
	{
		_instance = this;	
		if (Application.isPlaying)
		{
			if (soundClips!=null)
			{
				for (int i=0; i<soundClips.Length; i++)
				{
					soundClips[i].Load();
					if (!lookup.ContainsKey(soundClips[i].name.ToLower()))						
						lookup.Add(soundClips[i].name.ToLower(),soundClips[i]);
				}						
			}
		}
	}
				
	// Update is called once per frame
	void Update () {		
		if (volume<0) volume = 0;
		if (volume>1) volume = 1;
		if (Application.isPlaying)
		{		
			float vol = (mute)?0:volume;
			if (vol!=AudioListener.volume)
				AudioListener.volume = vol;			
		}	
							
		int s = 0;
		while (s<sounds.Count)
		{
			OTSound sound = sounds[s];	
			if (!sound.ready)
				continue;
						
			if (sound.tick == 0)				
			{
				// lets skip first tick so sound will be started on 2nd tick
				// and we have a tick to setup the sound
				sound.tick++;				
				continue;
			}
			
			// lets start play the sound if no delay on this 2nd tick
			if (sound.tick == 1 && !sound._boolMessage(OTSound.MessageType.HasDelay))
				sound._boolMessage(OTSound.MessageType.Play);
			
			sound.tick++;							
			if (sound._boolMessage(OTSound.MessageType.HasDelay))
			{
				sound._boolMessage(OTSound.MessageType.Wait,Time.deltaTime);
				if (!sound._boolMessage(OTSound.MessageType.HasDelay))
					sound._boolMessage(OTSound.MessageType.Play);
			}
			else
			{
				sound._boolMessage(OTSound.MessageType.Playing,Time.deltaTime);
				if (!sound.isPlaying)
				{
					if (!sound._boolMessage(OTSound.MessageType.Repeat))
					{
						sound._boolMessage(OTSound.MessageType.Destroy);
						continue;						
					}
				}
				else
				{
					if (sound._boolMessage(OTSound.MessageType.Expired))
					{
						sound._boolMessage(OTSound.MessageType.Destroy);
						continue;						
					}
				}
			}
			s++;
		}
		
	}
}

public class OTSound
{
	public float time = 0;
	public int tick = 0;

	// sound settings
	int	  count = 1;
	float delay = 0;
	float duration = 0;	
	float fadeIn = 0;
	float fadeOut = 0;
	
	// private attributes
	OTSoundClip soundClip;
	AudioSource source;
	GameObject gameObject = null;
	bool firstPlay = true;

	int	  _count = 1;
	float _delay = 0;
	float _duration = 0;
	float _volume = 1;
	float _pan = 0;
	float _pitch = 1;
	string _name = "";
	
	static List<OTSound> sounds
	{
		get
		{
			return OTSounds.instance.sounds;
		}
	}

	public string name
	{
		get
		{
			return _name;
		}
	}
	
	/// <summary>
	/// Indicates if the sound is valid
	/// </summary>
	public bool valid
	{
		get
		{
			return (found && ready);
		}			
	}

	/// <summary>
	/// Indicates if the sound was found (by name)
	/// </summary>
	public bool found
	{
		get
		{
			return (soundClip != null);
		}			
	}
	/// <summary>
	/// Indicates if the sound is ready to be played
	/// </summary>
	public bool ready
	{
		get
		{
			return (soundClip != null && soundClip.ready && source!=null);
		}			
	}
	
	/// <summary>
	/// Indicates if this sound is playing
	/// </summary>
	public bool isPlaying
	{
		get
		{
			return (ready && source.isPlaying);
		}
	}

	void InitSound()
	{		
		gameObject = new GameObject();						
		gameObject.name = "Orthello sound "+soundClip.name;
		source = gameObject.AddComponent<AudioSource>();
		
		tick = 0;
		time = 0;
		count = _count;
		delay = _delay;		
		duration = _duration;
		source.clip = soundClip.clip;		
		source.pan = _pan;
		source.pitch = _pitch;
		source.volume = _volume;							
		
		if (count == -1)
			source.loop = true;
		
		sounds.Add(this);
	}
	
	public OTSound(string name)
	{
		_name = name.ToLower();
		if (OTSounds.instance.lookup.ContainsKey(_name))
			 soundClip = OTSounds.instance.lookup[_name];	
		
		if (soundClip !=null)
			InitSound();
	}

		
	public enum MessageType { Expired, HasDelay, Wait, Playing, Play, Destroy, Repeat };	
	public bool _boolMessage(MessageType mt, float val)
	{
		if (!ready)
			return false;
		
		switch(mt)
		{
			case MessageType.Expired:
				return (duration>0 && time > duration);

			case MessageType.HasDelay:
				return (delay > 0);			
			
			case MessageType.Wait:
				delay -= val;
				break;
			
			case MessageType.Playing:
				time += val;
			
				if (fadeIn!=0)
				{
					if (time > fadeIn && time < duration - fadeOut)
					{
						if (source.volume!=1)
							source.volume = 1;
					}
					else
					if (time < fadeIn)
						source.volume = (time / fadeIn) * _volume;
				}
			
				if (fadeOut!=0)
				{
					if (time > duration - fadeOut)
						source.volume = _volume - ((time - (duration - fadeOut))/fadeOut);								
				}
			
				break;
			
			case MessageType.Play:
			
				if (firstPlay)
				{					
					firstPlay = false;				
					if (duration == 0 && count>-1)
						duration = count * (source.clip.length / ((source.pitch>0)?source.pitch:1));					
				}
			
				if (source.isPlaying)
					source.Stop();
				source.Play();
				break;
			
			case MessageType.Destroy:	
						
				if (source.isPlaying)
					source.Stop();
				if (gameObject!=null)
				{
					OT.Destroy(gameObject);
					gameObject = null;
				}
				if (sounds.Contains(this))
					sounds.Remove(this);
				firstPlay = true;
				break;
			
			case MessageType.Repeat:
				count--;
				if (count == 0)
					return false;
				else
				{
					source.Play();
					return true;
				}				
		}
		return true;
	}	
	public bool _boolMessage(MessageType mt)
	{
		return _boolMessage(mt,0);
	}
	
	/// <summary>
	/// Stop the sound
	/// </summary>
	public void Stop()
	{
		_boolMessage(MessageType.Destroy);
	}
	
	
	OTSound Clone()
	{
		OTSound s = new OTSound(_name);
		s.Count(_count);
		s.Pan(_pan);
		s.Pitch(_pitch);
		s.Delay(_delay);
		s.Volume(_volume);
		s.Duration(_duration);
		s.FadeIn(fadeIn);
		s.FadeOut(fadeOut);	
		return s;
	}

	/// <summary>
	/// Plays the sound
	/// </summary>
	/// <param name='clone'>
	/// If true, a new sound instance (clone) is launched and played
	/// If flase, the current sound is played or stopped and re-played
	/// </param>
	public OTSound Play(bool clone)
	{
		if (clone)
		{
			OTSound s = Clone();
			s.Play(false);
			return s;
		}
		else
		{
			_boolMessage(MessageType.Destroy);
			InitSound();			
			return this;
		}
	}
	/// <summary>
	/// (Re)-plays the sound
	/// </summary>
	public OTSound Play()
	{
		return Play(false);
	}
	/// <summary>
	/// Plays the sound as a new instance (clone)
	/// </summary>
	public OTSound PlayClone()
	{
		return Play(true);
	}
	/// <summary>
	/// Sets this sound in idle state
	/// </summary>
	public void Idle()
	{
		_boolMessage(MessageType.Destroy);
	}
	
	/// <summary>
	/// Sets the sound source pitch value
	/// </summary>
	public OTSound Pitch(float val)
	{
		_pitch = val;
		if (source!=null) 
			source.pitch = val;
		return this;
	}
	/// <summary>
	/// Sets the sound source pan value
	/// </summary>
	public OTSound Pan(float val)
	{
		_pan = val;
		if (source!=null) 
			source.pan = val;
		return this;
	}
	/// <summary>
	/// Sets the number of times the sound will be played
	/// </summary>
	public OTSound Count(int val)
	{
		_count = val;
		count = val;
		if (val == -1 && source!=null)
			source.loop = true;
		return this;
	}
	/// <summary>
	/// Sets sound volume
	/// </summary>
	public OTSound Volume(float val)
	{
		_volume = val;
		if (source!=null) 
			source.volume = val;
		return this;
	}
	/// <summary>
	/// Sound will be looping
	/// </summary>
	public OTSound Loop()
	{
		return Count(-1);
	}
	/// <summary>
	/// Sets sound delay
	/// </summary>
	public OTSound Delay(float val)
	{
		_delay = val;
		delay = val;
		return this;
	}
	/// <summary>
	/// Sets volume FadeIn Time
	/// </summary>
	public OTSound FadeIn(float time)
	{
		fadeIn = time;		
		if (source!=null) 
			source.volume = 0;
		return this;
	}
	/// <summary>
	/// Sets volume FadeIn Time
	/// </summary>
	public OTSound FadeOut(float time)
	{
		fadeOut = time;
		return this;
	}
	/// <summary>
	/// Sets sound duration
	/// </summary>
	public OTSound Duration(float val)
	{
		_duration = val;
		duration = val;
		return this;
	}
	
}

[System.Serializable]
public class OTSoundClip
{	
	public string name;
	public AudioClip clip;
	public string url = "";
	
	public bool ready
	{
		get
		{
			if (url!="")
				return clip.isReadyToPlay;
			else
				return true;
		}
	}
	
	public void Load()
	{
		if (url!="")
		{
 			WWW wwwRequest = new WWW(url);
        	clip = wwwRequest.GetAudioClip(false,true);
		}
	}
	
}
