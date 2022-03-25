import dataReceta from '../../../api/recetas.json'
import {useParams} from "react-router-dom";
import "./infoReceta.css"
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import {fill} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {useState} from "react";

export default function InfoReceta() {
    const navigate = useParams()
    const receta = dataReceta.find(item => String(item.id) === navigate.id)
    return (
        <div className={"info-receta-container"}>
            <div className={"info-receta-container-card info-receta-titulo"}>
                {receta.titulo}
            </div>
            {receta.imagen ?
                <div className={"info-receta-container-card info-receta-imagen"}>
                    <AdvancedImage cldImg={getImagen("receta/"+receta.imagen).roundCorners(byRadius(25))} plugins={[responsive({steps:1})]}/>
                </div>
                :null
            }
            <div className={"info-receta-container-card info-receta-descripcion"}>
                {receta.descripcion}
            </div>
            <div className={"info-receta-container-card info-receta-ingredientes"}>
                <ul>
                    {buildIngredients(receta.ingredientes)}
                </ul>
            </div>
            <div className={"info-receta-container-card info-receta-pasos"}>
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

function buildSteps(pasos){
    return pasos.map(paso => (
        <li>
            {paso.paso}
        </li>
    ))
}