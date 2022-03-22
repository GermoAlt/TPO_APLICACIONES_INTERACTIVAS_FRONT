import {Route, Routes} from "react-router-dom";
import Home from "./home/Home";
import InfoReceta from "./recetas/InfoReceta";

export default function Main(){
    return (
        <div>
            <Routes>
                <Route exact path={"/"} element={<Home/>}/>
                <Route path={"/receta/:id"} element={<InfoReceta/>}/>
            </Routes>
        </div>
    )
}