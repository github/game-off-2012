using UnityEngine;
using System.Collections;

public class GameManager : MonoBehaviour {
    //SETTINGS/VARIABLES - PERSISTANT THROUGH EACH SCENE
    public int Score = 0;
    public float LifeSpan = 0;

    //Currently unused (but need to implement sometime in the future)
    public int CurrentLevel = 0;
    public bool Paused = false;
    public int LivesLeft = 3;
    public bool ShowHints = true;
    public bool Sound = true;
    public int SoundEffectsVolume = 11; //out of 11
    public int SoundMusicVolume = 11; //out of 11
    public float SoundMusicActualVolume = 1f; //out of 1 (percent based)
    public int SoundMusicMaxVolume = 11;

    void Awake()
    {
        DontDestroyOnLoad(this);
    }
}
