import {InputText} from "primereact/inputtext";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import axios from "axios";
import useUser from "../../../../hooks/useUser";
import {Button} from "primereact/button";

const LoginPage = (props) => {
    const [error, setError] = useState(false);
    const {user, changeUser} = useUser();
    const [errorMessage, setErrorMessage] = useState("");
    const [shake, setShake] = useState(false);
    const username = props.username;
    const password = props.password;

    const validateLogin = () => {
        const userData = {username, password}
                    handleSuccessfulLogin("admin")
        // axios.post("http://localhost:8080/api/usuario/login", userData)
        //     .then(res => {
        //         if(res.data.tipo) {
        //             handleSuccessfulLogin(res.data)
        //         } else {
        //             // showErrorMessage(res.data)
        //             handleSuccessfulLogin("admin")
        //         }
        //     })
        //     .catch(err => {
        //         showErrorMessage("Error de ingreso. Vuelva a intentar en unos minutos.")
        //     })
    }

    const handleSuccessfulLogin = (response) => {
        let user = {}
        if(username.substring(0,1) === "a"){
            user = {
                name: "",
                tipo: "instructor"
            }
        } else {
            user = {
                name: "Pedro",
                tipo: "cliente"
            }
        }
        changeUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        setError(false);
        props.ocultar();
    }


    const showErrorMessage = (err) => {
        setErrorMessage(err);
        setError(true);
    }

    // const triggerShake = () => {
    //     console.log(shake)
    //     setShake(true);
    //     console.log(shake)
    //     setTimeout(500, setShake(false))
    //     console.log(shake)
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
                    <small>No tenes cuenta? <span className={"clickable"}  onClick={() => props.setActionType('register')}>Hacé click aquí</span></small>
            </div>
            <br/>
            <div className={"login-dialog-footer"} >
                <Button label="Login" className="p-button-rounded p-mt-2 p-button-text"style={{backgroundColor: "#775094"}} onClick={() => validateLogin()} />
                <Button label="Cancelar" className="p-button-rounded p-mt-2 p-button-secondary p-button-text" style={{backgroundColor: "#434343", marginLeft: "10px"}}onClick={() => props.ocultar()} />
            </div>
        </div>
    </div>
)
}

export default LoginPage;