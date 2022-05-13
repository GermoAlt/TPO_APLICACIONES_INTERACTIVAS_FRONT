import Banner from "./banner/Banner";
import {AdvancedImage} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import Login from "../../header/login/Login";
import React, {useEffect, useState} from "react";
import "./home.css"
import RecipeList from "../busqueda/RecipeList";
import {Button} from "primereact/button";
import Browser from "../../header/browser/Browser";
import {Dropdown} from "primereact/dropdown";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function Home() {
    useEffect(() => {
        window.scrollTo(0,0)
    }, []);
    const categorias = ["Pasta", "Carne", "Postre", "Ensalada",
        "Sopas", "Guisos", "Carnes", "Sin Gluten", "Vegetariano", "Mariscos"]
    const [categoria, setCategoria] = useState()
    const navigate = useNavigate()

    function redirectCategoria(categoria){
        navigate("/resultados?filterBy=Categoria&val="+categoria)
    }

    return (
        <div className={"home-container"}>
            <Banner/>
            <div className={"home-banner-container gourmetic-card home-card-reverse-wrap"}>
                <div className={"home-banner-content-container"}>
                    <h1 className={"gourmetic-font home-banner-title"}>
                        Necesitas inspiración para tu proxima cena?
                    </h1>
                    <h3 className={"home-banner-subtitle"}>
                        Aprovechá todas las recetas que personas como vos ya cargaron!
                    </h3>
                    <div style={{marginLeft:"-10px"}}>
                        <Browser />
                    </div>
                </div>
                <div className={"home-banner-content-image"}>
                    <AdvancedImage cldImg={getImagen("logo_no_text")}/>
                </div>
            </div>
            <div className={"home-banner-container gourmetic-card"}>
                <div className={"home-banner-content-image"}>
                    <AdvancedImage cldImg={getImagen("logo_no_text")}/>
                </div>
                <div className={"home-banner-content-container"}>
                    <h1 className={"gourmetic-font home-banner-title"}>
                        Creo que tengo ganas de un plato de...
                    </h1>
                    <h3 className={"home-banner-subtitle"}>
                        Usá nuestras categorías para encontrar exactamente lo que buscás!
                    </h3>
                    <Dropdown placeholder={"Filtrá por categorías"} onChange={(e)=> redirectCategoria(e.value)} value={categoria} options={categorias}/>
                </div>
            </div>
            <div className={"gourmetic-card"}>
                <h1>Destacados</h1>
            </div>
            <RecipeList rows={3}/>
        </div>
    )
}