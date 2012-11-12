using UnityEngine;
using System.Collections;

public class Explode : MonoBehaviour {
    public bool IsLit = true;
    public int TimeToExplodeInSeconds = 3;
    public int NumberOfBombs = 1;

    private float _time;
    private GameObject _explosion;

    //Explosion scores
    public int DestructableWallPoints = 10;

    //Private
    private GameManager _gameManager;
    private bool _hasManager = false;


	// Use this for initialization
	void Start ()
	{
	    _explosion = transform.GetChild(0).gameObject;
	    GameObject manager = GameObject.FindGameObjectWithTag("Manager");
	    if (manager != null)
	    {
	        _gameManager = (GameManager) manager.GetComponent("GameManager");
	        _hasManager = true;
	    }
	}
	
	// Update is called once per frame
	void Update ()
	{
        if (IsLit)
        {
            _time += Time.deltaTime;
            if (_time >= TimeToExplodeInSeconds)
            {
                IsLit = false;
                transform.GetChild(1).gameObject.active = false;
                executeCollision();
                StartCoroutine(explode());
                transform.localScale = new Vector3(0,0,0);
            }
        }
	}

    IEnumerator explode()
    {

        yield return new WaitForSeconds(1);
        Destroy(transform.gameObject);
    }

    void executeCollision()
    {
        _explosion.active = true;
        var explosionPower = 300 * NumberOfBombs;
        var explosionRadius = 2 * NumberOfBombs;

        Debug.Log(NumberOfBombs);

        var colliders = Physics.OverlapSphere( transform.position, explosionRadius );
        foreach (var hit in colliders)
        {
            if (hit.rigidbody && hit.rigidbody != transform.rigidbody)
            {
                switch(hit.gameObject.tag)
                {
                    case "DestructableWall":
                        var wall = (DestructableWalls)hit.gameObject.GetComponent(typeof(DestructableWalls));
                        if (wall != null)
                        {
                            wall.Destruct();
                        }
                        if (_hasManager) _gameManager.Score += DestructableWallPoints;
                        break;
                    default:
                        hit.rigidbody.AddExplosionForce(explosionPower, transform.position, explosionRadius);
                        break;
                }
            }
        }
    }
}

