import dataReceta from '../../../api/json/recetas.json'
import dataReviews from '../../../api/json/calificaciones.json'
import {useParams} from "react-router-dom";
import "./infoReceta.css"
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {useEffect, useState} from "react";
import {Carousel} from "primereact/carousel";
import {Rating} from "primereact/rating";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {Editor} from "primereact/editor";
import {Navigation} from "swiper";
import {SwiperSlide, Swiper} from "swiper/react";
import {Panel} from "primereact/panel";
import {SpeedDial} from "primereact/speeddial";

import { getRecipe } from '../../../api/controller/apiController';

export default function InfoReceta() {
    useEffect(() => {
        window.scrollTo(0,0)
    }, []);
    const [errorClass, setErrorClass] = useState("")
    const [mostrarEditor, setMostrarEditor] = useState(false)
    const [newRatingText, setNewRatingText] = useState("")
    const [newRatingValue, setNewRatingValue] = useState(0)
    const [reviews, setReviews] = useState([...dataReviews]);
    const params = useParams()
    //const receta = dataReceta.find(item => String(item.id) === navigate.id)

    const [receta, setReceta] = useState({});

    useEffect(() => {
        getRecipe(params.id).then(res => {
            console.log(res.data);
            setReceta(res.data.recipe);
        }).catch(err => {
            console.log("Error: ", err);
        })
    },[])

    const submitReview = (e) => {
        // autor luego cambia por la data del user dinamico
        e.preventDefault();
        let newReview = {
            "id": reviews.length,
            "autor":
              {
                "id": 3312,
                "nombre": "Mariana Suarez",
                "mail": "marianasuarez@gmail.com",
                "telefono": "5491164856165"
              },
            "calificacion": newRatingValue,
            "comentarios": newRatingText
        }
        setReviews([...reviews,newReview]);
    }

    const imagenTemplate = (imagen) => {
        return(
            <SwiperSlide key={Math.floor(Math.random() * 1010).toString()}>
                <div className={`info-receta-imagen-carousel ${errorClass}`}>
                    <AdvancedImage cldImg={getImagen("receta/"+imagen).roundCorners(byRadius(25))}
                                   plugins={[responsive({steps:1})]} onError={(e) => {
                        setErrorClass(" image-not-found")
                        mostrarError(e)
                    }}/>
                </div>
            </SwiperSlide>
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

    return (
        <div className={"info-receta-container"}>
            <div className={"gourmetic-card info-receta-titulo"}>
                {receta.titulo}
            </div>
            <div className={"gourmetic-card info-receta-descripcion"}>
                {receta.descripcion}
            </div>
            <div className={"info-receta-central-panel"}>
                {
                    receta.imagenes && receta.imagenes.length === 1 ?
                        <div className={`info-receta-imagen ${errorClass}`}>
                            <AdvancedImage cldImg={getImagen("receta/"+receta.imagenes[0])}
                                           plugins={[responsive({steps:1})]} onError={(e) => {
                                setErrorClass("image-not-found")
                                mostrarError(e)
                            }}/>
                        </div>
                    :
                    <div className={"gourmetic-card info-receta-carousel-container"}>
                        <Swiper navigation={true} modules={[Navigation]} className={"info-receta-carousel"}>
                            {receta.imagenes && receta.imagenes.map(imagen => {return imagenTemplate(imagen)})}
                        </Swiper>
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
                    <h1>Ingredientes</h1>
                    <ul className={"info-receta-list"}>
                        {buildIngredients(receta.ingredientes)}
                    </ul>
                </div>
                <div className={"gourmetic-card info-receta-pasos"}>
                    <h1>Pasos</h1>
                    <ol className={"info-receta-list"}>
                        {buildSteps(receta.pasos)}
                    </ol>
                </div>
            </div>
            <div className={"info-receta-container-calificaciones"}>
                <div className={"info-recetas-nueva-calificacion gourmetic-card"}>
                    <div className={"info-recetas-calificaciones-header"}>
                        <h1>Reviews</h1>
                        <div className={"info-recetas-nueva-calificacion-button-container"}>
                            <Button icon={mostrarEditor?"":"pi pi-plus"} label={mostrarEditor?"Cancelar":"Nueva calificación"}
                                onClick={() => setMostrarEditor(!mostrarEditor)} className={mostrarEditor?"p-button-danger":""} />
                        </div>
                    </div>
                    <Panel toggleable collapsed={!mostrarEditor} headerTemplate={<div/>} onToggle={() => setMostrarEditor(!mostrarEditor)}>
                        <div className={"info-receta-calificacion-nueva-rating"}>
                            <Rating cancel={false} value={newRatingValue}
                                    onChange={(e) => setNewRatingValue(e.target.value)}/>
                        </div>
                        <Editor placeholder={"Escribe aqui tu calificación"} value={newRatingText}
                                onTextChange={(e) => setNewRatingText(e.htmlValue.toString().split("<p>")[1].split("</p>")[0])}
                                headerTemplate={header}/>
                        <div className={"info-receta-calificacion-nueva-submit"}>
                            <Button label={"Enviar calificación"} onClick={(e) => submitReview(e)} style={{alignSelf: "flex-end"}}/>
                        </div>
                    </Panel>
                </div>
                <div className={"info-receta-container-calificaciones"}>
                    {buildReviews(reviews)}
                </div>
            </div>
        </div>
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
    return categorias? categorias.map(categoria => (
        <Tag key={Math.floor(Math.random() * 1010).toString()} value={categoria} rounded />
    )) : <></>
}

function buildIngredients(ingredientes){
    return ingredientes ? ingredientes.map(ingrediente => (
        <li key={Math.floor(Math.random() * 1010).toString()}>
            <b>{ingrediente.cantidad}</b> {ingrediente.ingrediente}
        </li>
    )) : <></>
}

function mostrarError(e){
    e.target.src="https://icons.iconarchive.com/icons/webalys/kameleon.pics/256/Food-Dome-icon.png"
}

function buildSteps(pasos){
    return pasos ? pasos.map(paso => (
        <li key={Math.floor(Math.random() * 1010).toString()}>
            {paso.paso}
        </li>
    )) : <></>
}

function buildReviews(calificaciones) {
    //get reviews by receta => despues agregar de nuevo el idReceta para pegarle a la api
    //const calificaciones = dataReviews;
    return calificaciones ? calificaciones.map(calificacion => (
            <div className={"gourmetic-card info-receta-calificacion"} key={calificacion.id}>
                <Rating value={calificacion.calificacion} readOnly stars={5} cancel={false} disabled className={"override-opacity"}/>
                <b>{calificacion.autor.nombre}</b>
                {calificacion.comentarios}
            </div>
        )
    ) : <div></div>
}

