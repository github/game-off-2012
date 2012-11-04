using UnityEngine;
using System.Collections;

public class PlayerGui : MonoBehaviour
{
    private HealthAndLifeRelated _playerLifeScript;
    private GameManager _gameManager;
    private bool _hasManager = false;

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

    }
}
