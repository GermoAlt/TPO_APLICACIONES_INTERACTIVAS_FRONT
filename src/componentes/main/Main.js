import {Route, Routes} from "react-router-dom";
import Home from "./home/Home";
import InfoReceta from "./recetas/InfoReceta";
import Profile from "./perfil/Profile";
import PanelBusqueda from "./busqueda/PanelBusqueda";
import NewReceta from "./recetas/NewReceta";
import EditorReceta from "./recetas/editorReceta/EditorReceta";
import DevPanel from "./DevPanel";

export default function Main(){
    return (
        <div className={"main-content-container"}>
            <Routes>
                <Route path={"/receta/new"} element={<NewReceta/>}/>
                <Route path={"/receta/:id"} element={<InfoReceta/>}/>
                <Route path={"/receta/:id/edit"} element={<EditorReceta/>}/>
                <Route path={"/profile"} element={<Profile/>}/>
                <Route path={"/resultados/"} element={<PanelBusqueda/>} />
                <Route path={"/resultados/:browsed"} element={<PanelBusqueda/>} />
                <Route path={"/dev-panel"} element={<DevPanel/>} />
                <Route path={"/"} element={<Home/>}/>
            </Routes>
        </div>
    )
}