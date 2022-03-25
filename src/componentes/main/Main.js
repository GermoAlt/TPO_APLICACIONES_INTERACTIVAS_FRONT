import {Route, Routes} from "react-router-dom";
import Home from "./home/Home";
import InfoReceta from "./recetas/InfoReceta";
import Profile from "./perfil/Profile";

export default function Main(){
    return (
        <div className={"main-content-container"}>
            <Routes>
                <Route exact path={"/"} element={<Home/>}/>
                <Route path={"/receta/:id"} element={<InfoReceta/>}/>
                <Route exact path={"/profile"} element={<Profile/>}/>
            </Routes>
        </div>
    )
}