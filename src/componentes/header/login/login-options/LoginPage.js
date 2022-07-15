import {InputText} from "primereact/inputtext";
import React, {useRef, useState} from "react";
import useUser from "../../../../hooks/useUser";
import {Button} from "primereact/button";
import {login} from "../../../../api/controller/apiController";
import {Toast} from "primereact/toast";

const LoginPage = (props) => {
    const [error, setError] = useState(false);
    const {user, changeUser} = useUser();
    const [errorMessage, setErrorMessage] = useState("");
    const toast = useRef()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const validateLogin = () => {
        login(username, password).then((res) => {
            if(res.status === 200){
                handleSuccessfulLogin(res)
            } else {
                showErrorMessage(res)
            }
        }).catch((e) => {
            showErrorMessage(e)
        })
    }

    const handleSuccessfulLogin = (response) => {
        let user = response.data.loginUser.user
        user.jwt = response.data.loginUser.token
        changeUser(user)
        localStorage.setItem('token', user.jwt)
        setError(false);
        props.ocultar();
    }


    const showErrorMessage = (err) => {
        toast.current.show({
            severity:"error",
            summary:"Login incorrecto",
            detail:err.response.data.message,
            life:3000
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
        </div>
        <div className={"login-dialog-footer-container"}>
            <span className={`login-dialog-error-message ${!error ? "hidden" : ""}`}>
                <small id="username2-help" className="p-error p-d-block p-ml-auto">{errorMessage}</small>
            </span>
            <div className={"login-dialog-sign-up-text p-mt-2"}>
                    <small><span className={"clickable"}  onClick={() => props.setActionType('remember')}>Olvidé mi contraseña</span></small>
            </div>
            <div className={"login-dialog-sign-up-text p-mt-2"}>
                    <small>No tenes cuenta? <span className={"clickable"}  onClick={() => props.setActionType('register')}>Hacé click aquí</span></small>
            </div>
            <br/>
            <div className={"login-dialog-footer"} >
                <Button label="Login" className="p-button-rounded" onClick={() => validateLogin()} />
                <Button label="Cancelar" className="p-button-rounded p-button-secondary" onClick={() => props.ocultar()} />
            </div>
        </div>
    </div>
)
}

export default LoginPage;