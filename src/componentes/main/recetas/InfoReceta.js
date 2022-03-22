import dataReceta from '../../../api/recetas.json'
import {useParams} from "react-router-dom";

export default function InfoReceta() {
    const navigate = useParams()
    const receta = dataReceta.find(item => String(item.id) === navigate.id)
    console.log(receta)
    return (
        <div className={"info-receta"}>
            <div className={"info-receta-titulo"}>
                {receta.titulo}
            </div>
            <div className={"info-receta-descripcion"}>
                {receta.descripcion}
            </div>
            <div className={"info-receta-ingredientes"}>

            </div>
            <div className={"info-receta-pasos"}>

            </div>
        </div>
    )
}