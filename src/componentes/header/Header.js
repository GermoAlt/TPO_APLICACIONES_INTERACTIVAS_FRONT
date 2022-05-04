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
            <Link to={"/"}>
                <AdvancedImage cldImg={getImagen("logo_full_horizontal").resize(scale().width(300))} plugins={[responsive({steps: [400, 300]})]}/>
            </Link>
        </React.Fragment>
    );


    const rightContents = (
        <React.Fragment>
            <Browser />
            {/*<Link to={"/instructor/nuevo"}>*/}
            {/*    <Button label={"Publicar"} icon="pi pi-plus" className="p-button-rounded p-mr-20"style={{textDecoration: 'none'}}/>*/}
            {/*</Link>*/}
            {/*{user.tipo && user.tipo === "instructor" ?*/}
            {/*    <Link to={"/experienciasPendientes"}>*/}
            {/*        <Button label={"Paquetes abiertos"} icon="pi pi-calendar" className="p-button-rounded p-mr-20" />*/}
            {/*    </Link>*/}
            {/*: null}*/}
            <Login/>
        </React.Fragment>
    );


    return (
        <div className="app-header p-d-flex">
            <Toolbar left={leftContents} right={rightContents} />
        </div>
    );
}