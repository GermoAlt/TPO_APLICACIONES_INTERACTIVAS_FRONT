import dataReceta from '../../../api/recetas.json'
import {useParams} from "react-router-dom";
import "./infoReceta.css"

export default function InfoReceta() {
    const navigate = useParams()
    const receta = dataReceta.find(item => String(item.id) === navigate.id)
    return (
        <div className={"info-receta-container"}>
            <div className={"info-receta-container-card info-receta-titulo gourmetic-font"}>
                {receta.titulo}
            </div>
            {receta.imagen ?
                <div className={"info-receta-container-card info-receta-imagen"}>
                    {receta.imagen}
                </div>
                :null
            }
            <div className={"info-receta-container-card info-receta-descripcion"}>
                {receta.descripcion}
            </div>
            <div className={"info-receta-container-card info-receta-ingredientes"}>
                {buildIngredients(receta.ingredientes)}
            </div>
            <div className={"info-receta-container-card info-receta-pasos"}>
                {buildSteps(receta.pasos)}
            </div>
        </div>
    )
}

function buildIngredients(ingredientes){
    return ingredientes.map(ingrediente => (
        <div>
            {ingrediente.cantidad} {ingrediente.ingrediente}
        </div>
    ))
}

function buildSteps(pasos){
    return pasos.map(paso => (
        <div>
            {paso.orden} {paso.paso}
        </div>
    ))
}