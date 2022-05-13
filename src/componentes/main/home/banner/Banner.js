import React, {useState} from "react";
import './banner.css'
import {AdvancedImage} from "@cloudinary/react";
import {getImagen} from "../../../imagen/getImagenCloud";
import Login from "../../../header/login/Login";
import {Button} from "primereact/button";
import useUser from "../../../../hooks/useUser";

export default function Banner(props){
    const {user, changeUser} = useUser();

    if (user.tipo === "guest"){
        return (
            <div className={"home-banner-container gourmetic-card"}>
                <AdvancedImage cldImg={getImagen("logo_no_text")} />
                <div className={"home-banner-content-container"}>
                    <h1>
                        texto titulo ejemplo
                    </h1>
                    <h3>
                        texto subtitulo ejemplo
                    </h3>
                    <Login/>
                </div>
            </div>
        )
    } else {
        return (
            <div className={"home-banner-container gourmetic-card"}>
                <AdvancedImage cldImg={getImagen("logo_no_text")}/>
                <div className={"home-banner-content-container"}>
                    <h1>
                        texto titulo ejemplo
                    </h1>
                    <h3>
                        texto subtitulo ejemplo
                    </h3>
                    <Button label={"Publicar mi receta"} icon={"pi pi-plus"} className={"p-button-rounded"}/>
                </div>
            </div>
        )
    }
}