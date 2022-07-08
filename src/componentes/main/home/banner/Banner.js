import React, {useState} from "react";
import './banner.css'
import {AdvancedImage} from "@cloudinary/react";
import {getImagen} from "../../../imagen/getImagenCloud";
import Login from "../../../header/login/Login";
import {Button} from "primereact/button";
import useUser from "../../../../hooks/useUser";
import {useNavigate} from "react-router-dom";

export default function Banner(props){
    const {user, changeUser} = useUser();
    const navigate = useNavigate()

    function redirectToNew() {
        navigate("/receta/new")
    }

    if (user.tipo === "guest"){
        return (
            <div className={"home-banner-container gourmetic-card"}>
                <div className={"home-banner-content-image"}>
                    <AdvancedImage cldImg={getImagen("logo_no_text")}/>
                </div>
                <div className={"home-banner-content-container"}>
                    <h1 className={"gourmetic-font home-banner-title"}>
                        ¿A que esperás para sumarte?
                    </h1>
                    <h3 className={"home-banner-subtitle"}>
                        ¡Registrate ahora y unite a nuestra comunidad de amantes de la comida!
                    </h3>
                    <Login/>
                </div>
            </div>
        )
    } else {
        return (
            <div className={"home-banner-container gourmetic-card"}>
                <div className={"home-banner-content-image"}>
                    <AdvancedImage cldImg={getImagen("logo_no_text")}/>
                </div>
                <div className={"home-banner-content-container"}>
                    <h1 className={"gourmetic-font home-banner-title"}>
                        Animate a compartir tus recetas!
                    </h1>
                    <h3 className={"home-banner-subtitle"}>
                        Queremos que nos cuentes la famosa receta de tu abuela!
                    </h3>
                    <Button label={"Publicar mi receta"} icon={"pi pi-plus"} className={"p-button-rounded"}
                            onClick={()=>redirectToNew()}/>
                </div>
            </div>
        )
    }
}