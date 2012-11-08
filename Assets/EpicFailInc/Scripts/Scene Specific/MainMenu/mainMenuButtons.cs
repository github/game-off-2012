using UnityEngine;
using System.Collections;

public class mainMenuButtons : MonoBehaviour {


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
        Application.LoadLevel("Level_1");
    }
}