using UnityEngine;
using System.Collections;

public class MainMenuButton : MonoBehaviour {

    void OnMouseEnter()
    {
        renderer.material.color = Color.black;
    }

    void OnMouseExit()
    {
        renderer.material.color = Color.white;
    }

    void OnMouseUp()
    {
        Destroy(GameObject.FindGameObjectWithTag("Manager"));
        Application.LoadLevel("MainMenu");
    }
}
