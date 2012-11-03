using UnityEngine;
using System.Collections;

public class PlayerGui : MonoBehaviour
{
    private HealthAndLifeRelated _playerLifeScript;
    private GameManager _gameManager;

    void Start()
    {
        // find the current instance of the player script:
        _playerLifeScript = (HealthAndLifeRelated)GameObject.FindGameObjectWithTag("Player").GetComponent("HealthAndLifeRelated");
        _gameManager = (GameManager)GameObject.FindGameObjectWithTag("Manager").GetComponent("GameManager");
    }

    void OnGUI()
    {
        var statusText = "Health: " + _playerLifeScript.CurrentHealth + "/" + _playerLifeScript.MaxHealth + " (" +
                         (int) (((float) _playerLifeScript.CurrentHealth/(float) _playerLifeScript.MaxHealth)*100) +
                         "%)";
        if(_gameManager != null)
        {
            statusText += "\nScore:" + _gameManager.Score;
        }

        GUI.Box(new Rect(10, 10, 200, 40), statusText);

    }
}
