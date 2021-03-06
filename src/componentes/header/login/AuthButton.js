import React, {useEffect, useRef} from "react";
import { Button } from "primereact/button";
import {TieredMenu} from "primereact/tieredmenu"
import {Link, useNavigate} from "react-router-dom";
import classNames from "classnames";
import useUser from "../../../hooks/useUser";



const AuthButton = props => {
    const menu = useRef(null);
    const {user, changeUser} = useUser();
    const storedUser = localStorage.getItem('user');
    useEffect(() => {
        if(storedUser) changeUser(JSON.parse(storedUser));
    }, [typeof(storedUser)])

    const items = [
        {
            label:'Mi perfil',
            template: (item, options) => {
                return userOptionTemplate("pi-user", "/profile", item, options)
            }
        },
        {
            label:'Buscar receta',
            template: (item, options) => {
                return userOptionTemplate("pi-search", "/resultados", item, options)
            }
        },
        {
            label:'Subir receta',
            template: (item, options) => {
                return userOptionTemplate("pi-plus", "/receta/new", item, options)
            }
        },
        {
            label:'Log out',
            command: () => {
                changeUser({tipo:"guest"})
            },
            template: (item, options) => {
                return logoutTemplate("pi-power-off", "", item, options)
            }
        }
    ];

    const handleLogout = () => {
        changeUser({tipo:"guest"})
        localStorage.clear()
    }

    const adminOptionTemplate = (icon, path, nameClass, item, options) => {
        return (
            <div className={` ${nameClass} ${user.tipo === "admin" ? "" : "hidden"}`}>
                <Link to={`${path}`} className={`p-menuitem-link`}>
                    <span className={classNames(options.iconClassName, `pi pi-fw ${icon}`)}/>
                    <span className={options.labelClassName}>{item.label}</span>
                </Link>
            </div>
        )
    }



    const userOptionTemplate = (icon, path, item, options) => {
        return (
            <div className={`p-menuitem`}>
                <Link to={`${path}`} className={"p-menuitem-link"}>
                    <span className={classNames(options.iconClassName, `pi pi-fw ${icon}`)}/>
                    <span className={options.labelClassName}>{item.label}</span>
                </Link>
            </div>
        )
    }

    const logoutTemplate = (icon, path, item, options) => {
        return (
            <div className={`login-dropdown-option-logout-container`}>
                <Button label="Logout" icon="pi pi-sign-out" className="login-dropdown-option-logout p-button-danger p-button-text" onClick={() => handleLogout()}/>
            </div>
        )
    }
    if (user._id) {
        return (
            <div>
                <TieredMenu model={items} className={"pull-left"} popup ref={menu} />
                <Button icon="pi pi-user" label={"Hola " + user.nombre.split(" ")[0]}
                        className="p-button-rounded button-login p-mr-2"
                        onClick={(event) => menu.current.toggle(event)} />
            </div>
        )
    } else {
        return <Button label="Login" icon="pi pi-user" className="p-button-rounded button-login p-mr-2" onClick={() => props.onClick('displayBasic')} />
    }
}

export default AuthButton;