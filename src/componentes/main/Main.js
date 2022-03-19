import {Route, Routes} from "react-router-dom";
import Home from "./home/Home";

export default function Main(){
    return (
        <div>
            <Routes>
                <Route exact path={"/"} element={<Home/>}/>
            </Routes>
        </div>
    )
}