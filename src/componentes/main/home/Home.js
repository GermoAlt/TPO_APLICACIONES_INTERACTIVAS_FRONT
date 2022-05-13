import Banner from "./banner/Banner";
import {AdvancedImage} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import Login from "../../header/login/Login";
import React from "react";
import "./home.css"
import RecipeList from "../busqueda/RecipeList";

export default function Home() {
    return (
        <div className={"home-container"}>
            <Banner/>
            <div className={"home-banner-container gourmetic-card home-card-reverse-wrap"}>
                <div className={"home-banner-content-container"}>
                    <h1>
                        texto titulo ejemplo
                    </h1>
                    <h3>
                        texto subtitulo ejemplo
                    </h3>
                    <Login/>
                </div>
                <AdvancedImage cldImg={getImagen("logo_no_text")} />
            </div>
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
            <RecipeList rows={3}/>
        </div>
    )
}