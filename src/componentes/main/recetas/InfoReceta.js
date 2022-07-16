import {useNavigate, useParams} from "react-router-dom";
import "./infoReceta.css"
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {useEffect, useState} from "react";
import {Rating} from "primereact/rating";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {Editor} from "primereact/editor";
import {Navigation} from "swiper";
import {SwiperSlide, Swiper} from "swiper/react";
import {Panel} from "primereact/panel";

import {createCalificacion, getCalificacionesByRecipe, getRecipe} from '../../../api/controller/apiController';
import useUser from "../../../hooks/useUser";
import {updateReceta} from "../../../api/service/recetasService";

export default function InfoReceta() {
    useEffect(() => {
        window.scrollTo(0,0)
    }, []);
    const {user} = useUser()
    const navigate = useNavigate()
    const [errorClass, setErrorClass] = useState("")
    const [mostrarEditor, setMostrarEditor] = useState(false)
    const [newRatingText, setNewRatingText] = useState("")
    const [newRatingValue, setNewRatingValue] = useState(1)
    const [reviews, setReviews] = useState([]);
    const params = useParams()

    const [receta, setReceta] = useState({});

    useEffect(() => {
        getRecipe(params.id).then(res => {
            setReceta(res.data.recipe);
            getCalificacionesByRecipe(params.id).then(res => {
                setReviews(res.data.calificaciones)
            })
        }).catch(err => {
            console.log("Error: ", err);
        })
    },[])

    const submitReview = (e) => {
        e.preventDefault();
        let autor = {}
        autor._id = user._id
        autor.nombre = user.nombre
        autor.email = user.email
        autor.telefono = user.telefono
        autor.idFoto = user.idFoto
        let newReview = {
            "idReceta": params.id,
            "autor": autor,
            "puntuacion": newRatingValue,
            "comentario": newRatingText
        }
        createCalificacion(newReview, user.jwt).then((res) => {
            setReviews([...reviews, newReview])
            updateReceta(receta, user.jwt).then()
        })

        receta.rating.push(newRatingValue)
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
            </span>
        );
    }

    const header = renderHeader();

    return (
        <div className={"info-receta-container"}>
            <div className={"gourmetic-card info-receta-titulo"}>
                {receta.titulo}

            {user._id && receta.autor && receta.autor._id === user._id ?
                <div>
                    <Button icon={"pi pi-pencil"} onClick={()=>navigate("edit")}/>
                </div>
                : null
            }
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
                        <h1>Calificaciones</h1>
                        <div className={"info-recetas-nueva-calificacion-button-container"}>
                            {user._id && receta.autor && user._id !== receta.autor._id ?
                                <Button icon={mostrarEditor ? "" : "pi pi-plus"}
                                        label={mostrarEditor ? "Cancelar" : "Nueva calificación"}
                                        onClick={() => setMostrarEditor(!mostrarEditor)}
                                        className={mostrarEditor ? "p-button-danger" : ""}/>
                                : null
                            }
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
    return calificaciones.length > 0 ? calificaciones.map(calificacion => (
            <div className={"gourmetic-card info-receta-calificacion"} key={calificacion._id}>
                <Rating value={calificacion.puntuacion} readOnly stars={5} cancel={false} disabled className={"override-opacity"}/>
                <b>{calificacion.autor.nombre}</b>
                {calificacion.comentario}
            </div>
        )
    ) : <div className={"gourmetic-card info-receta-calificacion"} >
        <p>No hay calificaciones. ¡Compartí tu opinion!</p>
        </div>
}

