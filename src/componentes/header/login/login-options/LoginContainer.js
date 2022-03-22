import React from "react";
import LoginPage from "./LoginPage";
import RegisterUser from "./RegisterUser";
import {AdvancedImage} from "@cloudinary/react";
import {getImagen} from "../../../imagen/getImagenCloud";

const LoginContainer = (props) => {
    if (props.actionType === "register") {
        return (
            <div className={"login-dialog-content-container"}>
                <AdvancedImage cldImg={getImagen("logo_full_vertical")} className={"login-dialog-logo"}/>
                <div className={"login-dialog-header-text"}>
                    <h2>Crear cuenta</h2>
                </div>
                <RegisterUser actionType={props.actionType} setActionType={(e) => props.setActionType(e)}
                              username={props.username} password={props.password}
                              setUsername={(e) => props.setUsername(e)} setPassword={(e) => props.setPassword(e)}
                              ocultar={() => props.ocultar()}/>
            </div>
        )
    } else if (props.actionType === "login") {
        return (
            <div className={"login-dialog-content-container"}>
                <AdvancedImage cldImg={getImagen("logo_full_vertical")}/>
                <div className={"login-dialog-header-text"}>
                    <h2>Acceder al sitio</h2>
                </div>
                <LoginPage actionType={props.actionType} setActionType={(e) => props.setActionType(e)}
                           username={props.username} password={props.password}
                           setUsername={(e) => props.setUsername(e)} setPassword={(e) => props.setPassword(e)}
                           ocultar={() => props.ocultar()}/>
            </div>
        )
    }
}

export default LoginContainer;