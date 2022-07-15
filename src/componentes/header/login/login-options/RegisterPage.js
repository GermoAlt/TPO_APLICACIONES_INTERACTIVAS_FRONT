import axios from "axios";
import {InputText} from "primereact/inputtext";
import {Link} from "react-router-dom";
import React, {useRef, useState} from "react";
import useUser from "../../../../hooks/useUser";
import {Button} from "primereact/button";
import {Captcha} from "primereact/captcha";
import {newUser} from "../../../../api/controller/apiController";
import {Toast} from "primereact/toast";

const RegisterPage = (props) => {
    const toast = useRef()
    const [error, setError] = useState(false);
    const {user, changeUser} = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState("")
    const [numero, setNumero] = useState("")
    const [errorMessage, setErrorMessage] = useState("");

    const createUser = () => {
        const createdUser = {}
        createdUser.email = username
        createdUser.password = password
        createdUser.nombre = nombre
        createdUser.telefono = numero
        createdUser.idFoto = "no_pfp_image"

        newUser(createdUser).then((res) => {
            localStorage.setItem('token', res.data.token)
            toast.current.show({
                severity:"success",
                summary:"¡Exito!",
                detail:"Tu cuenta fue creada con exito",
                life:3000
            })
            let user = res.data.user
            user.jwt = res.data.token
            changeUser(user)
            props.ocultar();
        }).catch((e) => {
            toast.current.show({
                severity:"error",
                summary:"Error",
                detail:"Error al crear cuenta",
                life:3000
            })
        })
    }

    return(
        <div>
            <Toast ref={toast}/>
            <div className="p-fluid login-dialog-input-field-container">
                <div className="p-field">
                    <InputText keyfilter={"email"} className={`login-dialog-input ${error ? "p-invalid" : ""}`} value={username} onChange={(e) => setUsername(e.target.value)} placeholder={"E-mail"}/>
                </div>
                <div className="p-field">
                    <InputText className={`login-dialog-input ${error ? "p-invalid" : ""}`} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"Contraseña"}/>
                </div>
                <div className="p-field">
                    <InputText keyfilter={/^[^#<>*!?¡¨[\]{}^;:_=)(/&%$"]+$/} className={`login-dialog-input ${error ? "p-invalid" : ""}`} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={"Nombre"}/>
                </div>
                <div className="p-field">
                    <InputText keyfilter={/^[\d-]/} className={`login-dialog-input ${error ? "p-invalid" : ""}`} value={numero} onChange={(e) => setNumero(e.target.value)} placeholder={"Teléfono"}/>
                </div>
                <Captcha siteKey={"6LdGdNkgAAAAAFbmajrTqFAleWkgB4w-6p5szbfb"} />
            </div>
            <div className={"login-dialog-footer-container"}>
                <span className={`login-dialog-error-message ${!error ? "hidden" : ""}`}>
                    <small id="username2-help" className="p-error p-d-block p-ml-auto">{errorMessage}</small>
                </span>
                <div className={"login-dialog-sign-up-text p-mt-2"}>
                    <small>Ya tenes cuenta? <span className={"clickable"} onClick={() => props.setActionType('login')}>Hacé click aquí</span></small>
                </div>
                <div className={"login-dialog-sign-up-text p-mt-2"}>
                    <small>Olvidaste tu cuenta? <span className={"clickable"} onClick={() => props.setActionType('remember')}>Hacé click aquí</span></small>
                </div>
                <br/>
                <div className={"login-dialog-footer"}>
                    <Button label="Registrarse" className="p-button-rounded" onClick={() => createUser()} />
                    <Button label="Cancelar" className="p-button-rounded p-button-secondary" onClick={() => props.ocultar()} />
                </div>
            </div>
        </div>
    )

}

export default RegisterPage;