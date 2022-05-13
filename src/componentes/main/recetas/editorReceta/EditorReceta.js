import NewReceta from "../NewReceta";
import {useParams} from "react-router-dom";

export default function EditorReceta() {
    const navigate = useParams()
    return (
        <div>
            <NewReceta id={navigate.id}/>
        </div>
    )
}