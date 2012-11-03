using UnityEngine;
using System.Collections;

public class Explode : MonoBehaviour {
    public bool isLit = true;
    public int timeToExplodeInSeconds = 3;

    private float time;
    private GameObject explosion;


	// Use this for initialization
	void Start ()
	{
	    explosion = transform.GetChild(0).gameObject;
	}
	
	// Update is called once per frame
	void Update ()
	{
        if (isLit)
        {
            time += Time.deltaTime;
            if (time >= timeToExplodeInSeconds)
            {
                isLit = false;
                transform.GetChild(1).gameObject.active = false;
                executeCollision();
                StartCoroutine(explode());
                transform.transform.localScale = new Vector3(0,0,0);
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
        explosion.active = true;
        var explosionPower = 500;
        var explosionRadius = 5;

        var colliders = Physics.OverlapSphere( transform.position, explosionRadius );
        foreach (var hit in colliders)
        {
            if (hit.rigidbody && hit.rigidbody != transform.rigidbody)
            {
                switch(hit.gameObject.tag)
                {
                    case "DestructableWall":
                        Destroy(hit.gameObject);
                        break;
                    default:
                        hit.rigidbody.AddExplosionForce(explosionPower, transform.position, explosionRadius);
                        break;
                }
            }
        }
    }
}

