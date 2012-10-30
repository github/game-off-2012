using UnityEngine;
using System.Collections;

public class Movement : MonoBehaviour
{
    public int PlayerSpeed = 3;

	// Use this for initialization
	void Start () {
	
	}

    void Update()
    {
        float moveInput = Input.GetAxis("Horizontal") * Time.deltaTime * PlayerSpeed;
        if (moveInput != 0)
        {
            transform.localRotation = new Quaternion(0, moveInput < 0 ? 180 : 0, 0, 0); //Stops user from rotating, allows for changing directions
        }
        transform.Translate(0,0,-(Mathf.Abs(moveInput)));
    }
}
