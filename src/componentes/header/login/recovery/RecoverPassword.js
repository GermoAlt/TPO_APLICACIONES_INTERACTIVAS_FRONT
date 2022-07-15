import React, {useEffect, useState} from "react";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";
import {validarToken} from "../../../../api/service/userService";

export default function RecoverPassword(){
    const navigate = useNavigate()
    const [errorToken, setErrorToken] = useState(false)
    useEffect(()=>{
        validarToken(navigate.token).then(r => {
            console.log()
        }).catch(e => {
            setErrorToken(true)
        })
    }, [])
    return(
        <div>
            {
                errorToken === true ?
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"15px", padding:"15px"}} className={"gourmetic-card"}>
                    <h1>Recuperar cuenta</h1>
                    <p>Ingresa una contraseña nueva para recuperar el acceso a tu cuenta:</p>
                    <label>Nueva contraseña</label>
                    <Password id={"new-password"} feedback toggleMask></Password>
                    <label>Confirmar contraseña</label>
                    <Password id={"confirm-password"} toggleMask></Password>
                    <Button label={"Cambiar"} icon={"pi pi-check"}></Button>
                </div>
             :
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"15px", padding:"15px"}} className={"gourmetic-card"}>
                        <h1>Recuperar cuenta</h1>
                        <p>Ocurrió un error. Vuelva a iniciar el proceso de reseteo.</p>
                    </div>
            }
        </div>
    )
}