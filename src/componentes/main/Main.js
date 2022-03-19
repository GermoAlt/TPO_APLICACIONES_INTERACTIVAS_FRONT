import {Route, Routes} from "react-router-dom";
import Home from "./home/Home";
import Profile from "./perfil/Profile";

export default function Main(){
    return (
        <div>
            <Routes>
                <Route exact path={"/"} element={<Home/>}/>
                <Route exact path={"/profile"} element={<Profile/>}/>
            </Routes>
        </div>
    )
}