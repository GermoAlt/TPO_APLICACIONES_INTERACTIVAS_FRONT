import axios from "axios";
import {InputText} from "primereact/inputtext";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import useUser from "../../../../hooks/useUser";
import {Button} from "primereact/button";

const RegisterUser = (props) => {
    const [error, setError] = useState(false);
    const {user, changeUser} = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState("")
    const [numero, setNumero] = useState("")
    const [errorMessage, setErrorMessage] = useState("");

    const createUser = () => {
        axios.post("http://localhost:8000/api/users/create", {
            "username": username,
            "password": password,
            "tipo": "user"
        })
            .then(e => {
                console.log(e)
        })
            .catch(error => {
                console.log(error)
            })
    }

    return(
        <div>
            <div className="p-fluid login-dialog-input-field-container">
                <div className="p-field">
                    <InputText keyfilter={"email"} className={`login-dialog-input ${error ? "p-invalid" : ""}`} value={username} onChange={(e) => setUsername(e.target.value)} placeholder={"E-mail"}/>
                </div>
                <div className="p-field">
                    <InputText keyfilter={/[^\s]/} className={`login-dialog-input ${error ? "p-invalid" : ""}`} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"Contraseña"}/>
                </div>
                <div className="p-field">
                    <InputText  className={`login-dialog-input ${error ? "p-invalid" : ""}`} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={"Nombre"}/>
                </div>
                <div className="p-field">
                    <InputText className={`login-dialog-input ${error ? "p-invalid" : ""}`} value={numero} onChange={(e) => setNumero(e.target.value)} placeholder={"Teléfono"}/>
                </div>
            </div>
            <div className={"login-dialog-footer-container"}>
                <span className={`login-dialog-error-message ${!error ? "hidden" : ""}`}>
                    <small id="username2-help" className="p-error p-d-block p-ml-auto">{errorMessage}</small>
                </span>
                <div className={"login-dialog-sign-up-text p-mt-2"}>
                    <small>Ya tenes cuenta? <span className={"clickable"} onClick={() => props.setActionType('login')}>Hacé click aquí</span></small>
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

export default RegisterUser;