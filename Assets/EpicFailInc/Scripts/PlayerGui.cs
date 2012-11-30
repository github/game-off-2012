using System.Globalization;
using UnityEngine;
using System.Collections;

public class PlayerGui : MonoBehaviour
{
    public Transform Ammunition;
    public Texture2D Icon;
    
    private HealthAndLifeRelated _playerLifeScript;
    private GameManager _gameManager;
    private bool _hasManager;
    private MergeBombDialogue _mergeBombDialog;

    void Start()
    {
        // find the current instance of the player script:
        _playerLifeScript = (HealthAndLifeRelated)GameObject.FindGameObjectWithTag("Player").GetComponent("HealthAndLifeRelated");
        GameObject manager = GameObject.FindGameObjectWithTag("Manager");
        if (manager != null)
        {
            _gameManager = (GameManager)manager.GetComponent("GameManager");
            _hasManager = true;
        }
        _mergeBombDialog = new MergeBombDialogue(Icon, this);
    }

    void OnGUI()
    {
        var statusText = "Health: " + _playerLifeScript.CurrentHealth + "/" + _playerLifeScript.MaxHealth + " (" +
                         (int) (((float) _playerLifeScript.CurrentHealth/(float) _playerLifeScript.MaxHealth)*100) +
                         "%)";
        if (_hasManager)
        {
            statusText += "\nScore:" + _gameManager.Score;
        }
        GUI.Box(new Rect(10, 10, 200, 40), statusText);

        _mergeBombDialog.DoWork();
    }

    public void FireMergedBomb(int HowManyToMerge)
    {
        //Need to do it here because this here's a monobehavior (not supposed to "new" those), as well as being able to get things like the amunition variable
        var playerTransform = GameObject.FindGameObjectWithTag("Player").transform;
        var temp = (Transform)Instantiate(Ammunition, new Vector3(playerTransform.position.x, playerTransform.position.y, playerTransform.position.z), Quaternion.identity);
        var explosionScript = (Explode)temp.gameObject.GetComponent(typeof(Explode));
        explosionScript.NumberOfBombs = HowManyToMerge;
        temp.GetChild(0).gameObject.active = false;
        var downScale = .53f;
        temp.localScale = new Vector3(temp.localScale.x * HowManyToMerge * downScale, temp.localScale.y * HowManyToMerge * downScale, temp.localScale.z * HowManyToMerge * downScale);
    }
}

public class MergeBombDialogue
{
    private bool _showLayover = false;
    private int _bombs = 2;
    private const int MIN_BOMBS = 2;
    private const int MAX_BOMBS = 5;
    private readonly Texture2D _icon;
    private readonly PlayerGui _parent;

    public MergeBombDialogue(Texture2D icon, PlayerGui parent)
    {
        _icon = icon;
        _parent = parent;
    }

    public void Show()
    {
        _showLayover = true;
    }

    public void Hide()
    {
        _showLayover = false;
    }

    public void DoWork()
    {
        if (GUI.Button(new Rect(Screen.width - 60, 10, 50, 50), _icon))
        {
            Show();
        }

        if (_showLayover)
        {
            GUI.BeginGroup(new Rect(Screen.width/2 - 50, Screen.height/2 - 50, 120, 100));
            GUI.Box(new Rect(0, 0, 120, 100), "Merge Bombs"); //(0,0)
            DecrementBombCountButton(1);
            GUI.Box(new Rect(50, 30, 20, 20), _bombs.ToString(CultureInfo.InvariantCulture)); // (50,30)
            IncrementBombCountButton(1);
            OkButton(); //(10, 60)
            CloseButton(); //(50, 60)
            GUI.EndGroup();
        }
    }

    void CloseButton()
    {
        if (GUI.Button(new Rect(50, 60, 60, 30), "Cancel"))
        {
            Hide();
        }
    }

    void OkButton()
    {
        if (GUI.Button(new Rect(10, 60, 35, 30), "OK"))
        {
            _parent.FireMergedBomb(_bombs);
            Hide();
        }
    }

    void IncrementBombCountButton(int howMuch)
    {
        if (GUI.Button(new Rect(80, 30, 30, 20), ">"))
        {
            _bombs = Mathf.Clamp(_bombs + howMuch, MIN_BOMBS, MAX_BOMBS);
        }
    }

    void DecrementBombCountButton(int howMuch)
    {
        if (GUI.Button(new Rect(10, 30, 35, 20), "<"))
        {
            _bombs = Mathf.Clamp(_bombs - howMuch, MIN_BOMBS, MAX_BOMBS);
        }
    }
}
