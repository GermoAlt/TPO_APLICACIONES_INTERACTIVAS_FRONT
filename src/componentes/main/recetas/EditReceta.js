import React, {useState, useEffect} from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import dataReceta from '../../../api/json/recetas.json'
import dataReviews from '../../../api/json/calificaciones.json'
import {useParams} from "react-router-dom";
import "./infoReceta.css"
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {Carousel} from "primereact/carousel";
import {Rating} from "primereact/rating";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {Editor} from "primereact/editor";
import { InputText } from 'primereact/inputtext';

import { getRecipe } from '../../../api/controller/apiController';

export default function EditReceta() {
    const [errorClass, setErrorClass] = useState("")
    const [mostrarEditor, setMostrarEditor] = useState(false)
    const [newRatingText, setNewRatingText] = useState("")
    const [newRatingValue, setNewRatingValue] = useState(0)
    const [reviews, setReviews] = useState([...dataReviews]);
    const params = useParams()
    //const receta = dataReceta.find(item => String(item.id) === navigate.id)
    const [edit, setEdit] = useState(dataReceta);
    const [receta, setReceta] = useState({});
    const [data, setData] = useState({});

    useEffect(() => {
        console.log(params)
        getRecipe(params.id).then(res => {
            console.log(res.data);
            setReceta(res.data.recipe);
            setData(res.data.recipe)
        }).catch(err => {
            console.log("Error: ", err);
        })
    },[])

    const imagenTemplate = (imagen) => {
        return(
            <div className={`info-receta-imagen${errorClass}`}>
                <AdvancedImage cldImg={getImagen("receta/"+imagen).roundCorners(byRadius(25))}
                               plugins={[responsive({steps:1})]} onError={(e) => {
                    setErrorClass(" image-not-found")
                    mostrarError(e)
                }}/>
            </div>
        )
    }

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"/>
                <button className="ql-italic" aria-label="Italic"/>
                <button className="ql-underline" aria-label="Underline"/>
            </span>
        );
    }

    const header = renderHeader();
    
    
    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={"info-receta-container"}>
                <div className={"new-receta-details-item"}>
                    <Editor value={receta.titulo} onChange={handleChange}></Editor>
                </div>
                <div className={"gourmetic-card info-receta-descripcion"}>
                    <InputText value={receta.descripcion} onChange={handleChange}></InputText>
                </div>
                <div className={"info-receta-central-panel"}>
                    {
                        receta.categorias && receta.categorias.length !== 1 ?
                            <div className={`info-receta-imagen ${errorClass}`}>
                                <AdvancedImage cldImg={getImagen("receta/"+receta.imagenes[0])}
                                            plugins={[responsive({steps:1})]} onError={(e) => {
                                    setErrorClass("image-not-found")
                                    mostrarError(e)
                                }}/>
                            </div>
                        :
                        <div className={"gourmetic-card info-receta-carousel-container"}>
                            {receta.imagenes ? 
                            <Carousel  className={"info-receta-carousel"} value={receta.imagenes} numVisible={1} numScroll={1} itemTemplate={imagenTemplate}/> 
                            : <></>}
                        </div>
                    }

                    <div className={"gourmetic-card info-receta-details"}>
                        <div className={"info-receta-details-item"}>
                            <span>Dificultad</span>
                            <Rating value={receta.dificultad} readOnly stars={5} cancel={false} disabled className={"override-opacity"}/>
                        </div>
                        <div className={"info-receta-details-item"}>
                            <span>Preparación</span>
                            <b>{buildTime(receta.tiempoPreparacion)}</b>
                        </div>
                        <div className={"info-receta-details-item"}>
                            <span>Elaboración</span>
                            <b>{buildTime(receta.tiempoElaboracion)}</b>
                        </div>
                        <div className={"info-receta-details-item"}>
                            <span>Categorias</span>
                            <div className={"info-receta-categorias"}>
                                {buildCategories(receta.categorias)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"info-receta-central-panel"}>
                    <div className={"gourmetic-card info-receta-ingredientes"}>
                        <h3>Ingredientes</h3>
                        <ul className={"info-receta-list"}>
                            {buildIngredients(receta.ingredientes)}
                        </ul>
                    </div>
                    <div className={"gourmetic-card info-receta-pasos"}>
                        <h3>Pasos</h3>
                        <ol className={"info-receta-list"}>
                            {buildSteps(receta.pasos)}
                        </ol>
                    </div>
                </div>
            </div>
        </form>
    )
}



function buildTime(tiempoEnMinutos){
    const hours = Math.floor(tiempoEnMinutos / 60);
    const minutes = tiempoEnMinutos % 60;
    let res = ""
    if (hours !== 0){
        res += hours + " hr" + (hours > 1 ? "s " : " ")
    }
    if (minutes !== 0) {
        res += minutes + " min"
    }
    return res
}

function buildCategories(categorias) {
    return categorias ? categorias.map(categoria => (
        <Tag key={categoria} value={categoria} rounded />
    )) : <></>
}

function buildIngredients(ingredientes){
    return ingredientes ? ingredientes.map(ingrediente => (
        <li key={ingrediente}>
            <b>{ingrediente.cantidad}</b> {ingrediente.ingrediente}
        </li>
    )) : <></>
}

function mostrarError(e){
    e.target.src="https://png.pngtree.com/png-vector/20190917/ourmid/pngtree-not-found-line-icon-vectors-png-image_1737850.jpg"
}

function buildSteps(pasos){
    return pasos ? pasos.map(paso => (
        <li key={paso.orden}>
            {paso.paso}
        </li>
    )): <></>
}


