using UnityEngine;
using System.Collections;

public class Movement : MonoBehaviour
{
    public float PlayerSpeed = 3;
    public int MaxVelocity = 10;
    public Camera MainCamera;
    public Camera SecondaryCamera;

    private Vector3 _targetVelocity;
    private GameManager _gameManager;

    // Use this for initialization
    private void Start()
    {
        _targetVelocity = new Vector3(0, 0, MaxVelocity);
        var manager = GameObject.FindGameObjectWithTag("Manager");
        if (manager != null)
        {
            _gameManager = (GameManager)manager.GetComponent("GameManager");
        }
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
            }else
            {
                Debug.Log("Error, camera missing. First camera missing? "+(MainCamera == null).ToString() + "; Secondary camera missing? "+(SecondaryCamera == null).ToString());
            }
        }
    }

    void levelUp()
    {
        if(_gameManager != null)
        {
            _gameManager.LevelUp();
        }
    }

    void OnTriggerEnter(Collider collision)
    {
        if (collision.gameObject.tag == "Finish")
        {
            levelUp();
        }
    }
}