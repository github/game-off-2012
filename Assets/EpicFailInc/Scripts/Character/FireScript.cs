using UnityEngine;
using System.Collections;

public class FireScript : MonoBehaviour
{
    public Transform ammunition;
    public int speed = 1000;
    public float fireRateInSeconds = 1.0f;

    //Private
    private float time = 0.0f;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update ()
	{
	    time += Time.deltaTime;

        float fireInput = Input.GetAxis("Fire1");
        if (fireInput > 0 && time >= fireRateInSeconds)
        {
            time = 0.0f;
            var temp = (Transform)Instantiate(ammunition,new Vector3(transform.position.x, transform.position.y+(transform.localScale.y+0.5f), transform.position.z),Quaternion.identity);
            temp.GetChild(0).gameObject.active = false;
            temp.rigidbody.AddForce(-transform.forward * speed);
        }
	    
	}
}
