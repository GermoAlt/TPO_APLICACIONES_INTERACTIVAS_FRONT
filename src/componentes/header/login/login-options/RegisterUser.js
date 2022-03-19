import axios from "axios";
import {InputText} from "primereact/inputtext";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import useUser from "../../../../hooks/useUser";
import {Button} from "primereact/button";

const RegisterUser = (props) => {
    const [error, setError] = useState(false);
    const {user, changeUser} = useUser();
    const [errorMessage, setErrorMessage] = useState("");

    const createUser = () => {
        axios.post("http://localhost:8000/api/users/create", {
            "username": props.username,
            "password": props.password,
            "tipo": "user"
        })
            .then(e => {
                console.log(e)
        })
            .catch(error => {
                console.log(error)
            })
    }

    // const validateEmail = () => {
    //     return props.username.match("^\S+@\S+$");
    // }

    return(
        <div>
            <div className="p-fluid">
                <small id="username1-help" className="p-d-block p-mb-1">Email</small>
                <div className="p-field">
                    <InputText keyfilter={"email"} className={`login-dialog-input ${error ? "p-invalid" : ""}`} value={props.username} onChange={(e) => props.setUsername(e.target.value)} placeholder={"Usuario"}/>
                </div>
                <small id="username1-help" className="p-d-block p-mb-1">Contraseña</small>
                <div className="p-field">
                    <InputText keyfilter={/[^\s]/} className={`login-dialog-input ${error ? "p-invalid" : ""}`} type={"password"} value={props.password} onChange={(e) => props.setPassword(e.target.value)} placeholder={"Contraseña"}/>
                </div>
            </div>
            <div className={"login-dialog-footer-container"}>
                <span className={`login-dialog-error-message ${!error ? "hidden" : ""}`}>
                    <small id="username2-help" className="p-error p-d-block p-ml-auto">{errorMessage}</small>
                </span>
                <div className={"login-dialog-sign-up-text  p-mt-2"}>
                    <small>Ya tenes cuenta? <span className={"clickable"} onClick={() => props.setActionType('login')}>Hacé click aquí</span></small>
                </div>
                <div className={"login-dialog-footer"}>
                    <Button label="Registrarse" className="p-button-rounded p-mt-2 p-button-text" onClick={() => createUser()} />
                    <Button label="Cancelar" className="p-button-rounded p-mt-2 p-button-secondary p-button-text" onClick={() => props.ocultar()} />
                </div>
            </div>
        </div>
    )

}

export default RegisterUser;