import {InputText} from "primereact/inputtext";
import {Link} from "react-router-dom";
import React, {useRef, useState} from "react";
import axios from "axios";
import useUser from "../../../../hooks/useUser";
import {Button} from "primereact/button";
import {Captcha} from "primereact/captcha";
import {resetPassword} from "../../../../api/controller/apiController";
import {Toast} from "primereact/toast";

const RememberPage = (props) => {
    const toast = useRef()

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [username, setUsername] = useState('');
    const [captcha, setCaptcha] = useState(false)

    function startResetProcess() {
        if (username && captcha) {
            resetPassword(username).then((res) => {
                toast.current.show({
                    severity:"success",
                    summary:"¡Exito!",
                    detail:"Recibiras instrucciones via mail para recuperar tu cuenta.",
                    life:3000
                })
            }).catch(() => {
                toast.current.show({
                    severity:"error",
                    summary:"Error",
                    detail:"Ocurrió un error. Intentá de nuevo mas tarde.",
                    life:3000
                })
            })
        }
    }


return(
    <div>
        <Toast ref={toast}/>
        <div className="p-fluid login-dialog-input-field-container">
            <div className="p-field">
                <InputText keyfilter={"email"} className={`login-dialog-input ${error ? "p-invalid" : ""}`} value={username} onChange={(e) => setUsername(e.target.value)} placeholder={"E-mail"}/>
            </div>
            <Captcha siteKey={"6LdGdNkgAAAAAFbmajrTqFAleWkgB4w-6p5szbfb"}
                     onResponse={() => setCaptcha(true)}
                     onExpire={() => setCaptcha(false)}/>
        </div>
        <div className={"login-dialog-footer-container"}>
            <span className={`login-dialog-error-message ${!error ? "hidden" : ""}`}>
                <small id="username2-help" className="p-error p-d-block p-ml-auto">{errorMessage}</small>
            </span>
            <div className={"login-dialog-sign-up-text p-mt-2"}>
                    <small><span className={"clickable"}  onClick={() => props.setActionType('login')}>Ingresar al sitio</span></small>
            </div>
            <div className={"login-dialog-sign-up-text p-mt-2"}>
                    <small>No tenes cuenta? <span className={"clickable"}  onClick={() => props.setActionType('register')}>Hacé click aquí</span></small>
            </div>
            <br/>
            <div className={"login-dialog-footer"} >
                <Button label="Login" className="p-button-rounded" onClick={() => startResetProcess()} />
                <Button label="Cancelar" className="p-button-rounded p-button-secondary" onClick={() => props.ocultar()} />
            </div>
        </div>
    </div>
)
}

export default RememberPage;