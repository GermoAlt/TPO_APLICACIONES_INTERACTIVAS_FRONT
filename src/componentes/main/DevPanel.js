import {Button} from "primereact/button";
import {crearRecipe, login} from "../../api/controller/apiController";
import dataReceta from "../../api/json/recetas.json"
import useUser from "../../hooks/useUser";

export default function DevPanel(){

    const {user, setUser} = useUser()

    function loginDev (){
        login("user", "pass").then(r => {console.log(r)})
    }

    function createReceta(){
        const receta = dataReceta[0]
        receta.estado = "borrador"
        crearRecipe(receta, user.jwt).then(res => console.log(res))
    }

    return (
        <div style={{display:"flex",flexDirection:"column", gap:10 + "px"}}>
            <Button onClick={() => loginDev()} label={"test login"}></Button>
            <Button onClick={() => createReceta()} label={"test create receta"}></Button>
        </div>
    )
}

