using UnityEngine;
using System.Collections;

public class Movement : MonoBehaviour
{
    public float PlayerSpeed = 3;
    public int MaxVelocity = 10;
    public Camera MainCamera;
    public Camera SecondaryCamera;

    private Vector3 _targetVelocity;

    // Use this for initialization
    private void Start()
    {
        _targetVelocity = new Vector3(0, 0, MaxVelocity);

    }

    private void FixedUpdate()
    {
        float moveInput = Input.GetAxisRaw("Horizontal");
        if (moveInput > 0) moveInput = 1;
        else if (moveInput < 0) moveInput = -1;
        else moveInput = 0;
        if (moveInput != 0)
        {
            transform.localRotation = new Quaternion(0, moveInput < 0 ? 180 : 0, 0, 0); //Stops user from rotating, allows for changing directions
        }
        var requiredAcceleration = _targetVelocity.z - Mathf.Abs(rigidbody.velocity.z);
        var forceToAdd = new Vector3(rigidbody.velocity.x, rigidbody.velocity.y,
                                     Mathf.Clamp(requiredAcceleration*PlayerSpeed*moveInput*-1, -_targetVelocity.z,
                                                 _targetVelocity.z));
        rigidbody.AddForce(forceToAdd);
    }

    private void Update()
    {
        bool moveInput = Input.GetKeyUp("c");
        if(moveInput)
        {
            if (MainCamera != null && SecondaryCamera != null)
            {
                MainCamera.gameObject.active = SecondaryCamera.gameObject.active;
                SecondaryCamera.gameObject.active = !SecondaryCamera.gameObject.active;
            }
        }
    }

}