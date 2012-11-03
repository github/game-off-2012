using UnityEngine;
using System.Collections;

public class LoadScoreLifeSpan : MonoBehaviour
{
    public TextMesh LifeSpan;
    public TextMesh Score;

    private GameManager _gameManager;

	// Use this for initialization
	void Start () {
        var manager = GameObject.FindGameObjectWithTag("Manager");
        if (manager != null)
        {
            _gameManager = (GameManager)manager.GetComponent("GameManager");
            LifeSpan.text = "Life span: " + Mathf.Floor(_gameManager.LifeSpan) + " seconds";
            Score.text = "Final Score: " + _gameManager.Score;
        }
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
