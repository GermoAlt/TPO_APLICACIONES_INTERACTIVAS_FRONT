import React from "react";
import "./footer.css"
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../imagen/getImagenCloud";
import {scale} from "@cloudinary/url-gen/actions/resize";
import {Adjust} from "@cloudinary/url-gen/actions/adjust";
import {Link} from "react-router-dom";
import useUser from "../../hooks/useUser";

export default function Footer() {

    const {user, setUser} = useUser()
    return (
        <div className={"footer-container"}>
            <div className={"footer-logo-container"}>
                <Link to={"/"}>
                    <AdvancedImage cldImg={getImagen("logo_full_horizontal")
                        .adjust(Adjust.replaceColor("#FFFFFF").fromColor().tolerance())
                        } className={"footer-logo"}/>
                </Link>
            </div>
            <div className={"footer-link-section"}>
                <div className={"footer-link-subsection gourmetic-card"}>
                    <Link to={""}>
                        Postres
                    </Link>
                    <Link to={""}>
                        Ensaladas
                    </Link>
                    <Link to={""}>
                        Sopa
                    </Link>
                    <Link to={""}>
                        Guisos
                    </Link>
                    <Link to={""}>
                        Carnes
                    </Link>
                    <Link to={""}>
                        Sin  gluten
                    </Link>
                    <Link to={""}>
                        Vegetariano
                    </Link>
                </div>
                <div className={"footer-link-subsection gourmetic-card"}>
                    <Link to={"/"}>
                        Inicio
                    </Link>
                    <Link to={"/resultados"}>
                        Buscar
                    </Link>
                    {user.tipo !== "guest" ?
                        <Link to={"/profile"}>
                            Perfil
                        </Link>
                        : ""
                    }
                    {user.tipo !== "guest" ?
                        <Link to={"/receta/new"}>
                            Nueva receta
                        </Link>
                        : ""
                    }
                </div>
            </div>
        </div>
    )
}

