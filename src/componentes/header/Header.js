import './header.css'

import React from "react";
import { Toolbar } from 'primereact/toolbar';
import { Link } from 'react-router-dom'
import classNames from "classnames";
import Login from "./login/Login";
import Browser from './browser/Browser';
import useUser from "../../hooks/useUser";
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../imagen/getImagenCloud";
import {scale} from "@cloudinary/url-gen/actions/resize";

export default function Header(props) {
    const {user, setUser} = useUser()

    const menuItemTemplate = (icon, path, item, options) => {
        return (
            <li className={"p-menuitem"}>
                <Link to={`${path}`} className={"p-menuitem-link"}>
                    <span className={classNames(options.iconClassName, `pi pi-fw ${icon}`)}/>
                    <span className={options.labelClassName}>{item.label}</span>
                </Link>
            </li>
        )
    }


    const menuCategories = [
        {
            "label": "Inicio",
            template: (item, options) => {
                return menuItemTemplate("pi-home", "/", item, options);
            }
        },
        {
            "label": "Artículos",
            "icon": "pi pi-fw pi-th-large",
            "items": [
                {
                    "label": "Cuadernos",
                    template: (item, options) => {
                        return menuItemTemplate("pi-book", "/articulos/cuadernos", item, options);
                    }
                },
                {
                    "label": "Carpetas",
                    template: (item, options) => {
                        return menuItemTemplate("pi-envelope", "/articulos/carpetas", item, options);
                    }
                },
                {
                    "label": "Escritura",
                    template: (item, options) => {
                        return menuItemTemplate("pi-pencil", "/articulos/escritura", item, options);
                    }
                },
                {
                    "label": "Insumos de Oficina",
                    template: (item, options) => {
                        return menuItemTemplate("pi-paperclip", "/articulos/insumos", item, options);
                    }
                },
                {
                    "label": "Otros",
                    template: (item, options) => {
                        return menuItemTemplate("pi-print", "/articulos/otros", item, options);
                    }
                }
            ]
        },
        {
            "label": "Nuevo artículo",
            template: (item, options) => {
                return menuItemTemplate("pi-plus", "/nuevo", item, options);
            }
        }]

    const leftContents = (
        <React.Fragment>
            <div className={"header-logo-container"}>
                <Link to={"/"}>
                    <AdvancedImage cldImg={getImagen("logo_full_horizontal")} className={"header-logo"}/>
                </Link>
            </div>
        </React.Fragment>
    );


    const rightContents = (
        <React.Fragment>
            <Browser />
            <Login/>
        </React.Fragment>
    );


    return (
        <header style={{width:100 + "%"}}>
            <div className="app-header visible p-d-flex">
                <Toolbar left={leftContents} right={rightContents} />
            </div>
            <div style={{visibility:"hidden"}} className="app-header p-d-flex">
                <Toolbar left={leftContents} right={rightContents} />
            </div>
        </header>
    );
}