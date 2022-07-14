import React, {useRef, useState} from "react";
import "./footer.css"
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../imagen/getImagenCloud";
import {scale} from "@cloudinary/url-gen/actions/resize";
import {Adjust} from "@cloudinary/url-gen/actions/adjust";
import {Link} from "react-router-dom";
import useUser from "../../hooks/useUser";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {agregarNewsletter} from "../../api/controller/apiController";
import {Toast} from "primereact/toast";

export default function Footer() {
    const {user, setUser} = useUser()
    const [mail, setMail] = useState("")
    const toast = useRef(null)

    function suscribirNewsletter(){
        agregarNewsletter(mail).then(r => {
            toast.current.show({
                severity:"success",
                summary:"¡Te suscribiste con éxito!",
                detail:"Ahora estarás al tanto de todas nuestras novedades",
                life:3000
            })
        }).catch(() => {
            toast.current.show({
                severity:"error",
                summary:"Error al suscribirte",
                detail:"Ocurrió un error. Intentá de nuevo mas tarde.",
                life:3000
            })
        })
    }

    return (
        <footer className={"footer-container"}>
            <Toast ref={toast}/>
            <div className={"footer-logo-container"}>
                <Link to={"/"}>
                    <AdvancedImage cldImg={getImagen("logo_full_horizontal")
                        .adjust(Adjust.replaceColor("#FFFFFF").fromColor().tolerance())
                        } className={"footer-logo"}/>
                </Link>
            </div>
            <div className={"footer-link-section"}>
                <div className={"footer-link-subsection gourmetic-card"} style={{display:"flex", justifyContent:"space-between", alignItems:"stretch"}}>
                    <p style={{color:"white"}}>¡Suscribite a nuestro newsletter!</p>
                    <InputText placeholder={"E-mail"} value={mail} onChange={(e) => setMail(e.target.value)}/>
                    <Button label={"Suscribirme"} onClick={() => suscribirNewsletter()}></Button>
                </div>
                <div className={"footer-link-subsection gourmetic-card"}>
                    <Link to={"/resultados/?filterBy=Categoria&val=Postre"}>
                        Postres
                    </Link>
                    <Link to={"/resultados/?filterBy=Categoria&val=Ensaladas"}>
                        Ensaladas
                    </Link>
                    <Link to={"/resultados/?filterBy=Categoria&val=Sopas"}>
                        Sopas
                    </Link>
                    <Link to={"/resultados/?filterBy=Categoria&val=Guisos"}>
                        Guisos
                    </Link>
                    <Link to={"/resultados/?filterBy=Categoria&val=Carne"}>
                        Carne
                    </Link>
                    <Link to={"/resultados/?filterBy=Categoria&val=Sin gluten"}>
                        Sin gluten
                    </Link>
                    <Link to={"/resultados/?filterBy=Categoria&val=Vegetariano"}>
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
        </footer>
    )
}

