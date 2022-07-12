import {Button} from "primereact/button";
import {crearRecipe, login} from "../../api/controller/apiController";
import dataReceta from "../../api/json/recetas.json"

export default function DevPanel(){
    return (
        <main style={{display:"flex",flexDirection:"column", gap:10 + "px"}}>
            <Button onClick={() => loginDev()} label={"test login"}></Button>
            <Button onClick={() => createReceta()} label={"test create receta"}></Button>
        </main>
    )
}

function loginDev (){
    login("user", "pass").then(r => {console.log(r)})
}

function createReceta(){
    dataReceta = dataReceta[0]
    dataReceta.estado = "borrador"
    console.log(dataReceta)
    crearRecipe(dataReceta)
}