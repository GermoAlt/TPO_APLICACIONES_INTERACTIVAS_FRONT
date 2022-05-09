import React from "react";
import "./footer.css"
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../imagen/getImagenCloud";
import {scale} from "@cloudinary/url-gen/actions/resize";
import {Adjust} from "@cloudinary/url-gen/actions/adjust";
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <div className={"footer-container"}>
            <div className={"footer-logo-container"}>
                <Link to={"/"}>
                    <AdvancedImage cldImg={getImagen("logo_full_horizontal")
                        .adjust(Adjust.replaceColor("#FFFFFF"))
                        } className={"footer-logo"}/>
                </Link>
            </div>
            <div className={"footer-link-section gourmetic-card"}>
                <Link to={""}>
                    sasdasdas
                </Link>
            </div>
            <div className={"footer-link-section gourmetic-card"}>

            </div>
        </div>
    )
}