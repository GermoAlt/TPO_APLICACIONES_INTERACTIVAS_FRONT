import dataReceta from '../../../api/recetas.json'
import {useParams} from "react-router-dom";
import "./infoReceta.css"
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import {fill} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {useState} from "react";


export default function InfoReceta() {
    const [errorClass, setErrorClass] = useState("")
    const navigate = useParams()
    const receta = dataReceta.find(item => String(item.id) === navigate.id)
    return (
        <div className={"info-receta-container"}>
            <div className={"info-receta-container-card info-receta-titulo"}>
                {receta.titulo}
            </div>
            <div className={`info-receta-container-card info-receta-imagen ${errorClass}`}>
                <AdvancedImage cldImg={getImagen("receta/"+receta.imagenes[0]).roundCorners(byRadius(25))}
                               plugins={[responsive({steps:1})]} onError={(e) => {
                                   setErrorClass("image-not-found")
                                   mostrarError(e)
                }}/>
            </div>
            <div className={"info-receta-container-card info-receta-descripcion"}>
                {receta.descripcion}
            </div>
            <div className={"info-receta-container-card info-receta-ingredientes"}>
                <h1>Ingredientes</h1>
                <ul>
                    {buildIngredients(receta.ingredientes)}
                </ul>
            </div>
            <div className={"info-receta-container-card info-receta-pasos"}>
                <h1>Pasos</h1>
                <ol>
                    {buildSteps(receta.pasos)}
                </ol>
            </div>
        </div>
    )
}

function buildIngredients(ingredientes){
    return ingredientes.map(ingrediente => (
        <li>
            <b>{ingrediente.cantidad}</b> {ingrediente.ingrediente}
        </li>
    ))
}

function mostrarError(e){
    e.target.src="https://png.pngtree.com/png-vector/20190917/ourmid/pngtree-not-found-line-icon-vectors-png-image_1737850.jpg"
}

function buildSteps(pasos){
    return pasos.map(paso => (
        <li>
            {paso.paso}
        </li>
    ))
}