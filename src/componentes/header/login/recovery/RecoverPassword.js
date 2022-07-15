import React, {useEffect, useRef, useState} from "react";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {recoverPassword, validateToken} from "../../../../api/controller/apiController";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Toast} from "primereact/toast";
import useUser from "../../../../hooks/useUser";

export default function RecoverPassword(){
    const [searchParams, ] = useSearchParams();
    const navigate = useNavigate()
    const toast = useRef()

    const {user, changeUser} = useUser()

    const [errorToken, setErrorToken] = useState(false)
    const [passwordNueva, setPasswordNueva] = useState("")
    const [confirmPasswordNueva, setConfirmPasswordNueva] = useState("")

    useEffect(()=> {
        validateToken(searchParams.get("uuid")).catch(e => {
            setErrorToken(false)
        })
    }, [])

    const resetAction = () => {
        if(passwordNueva !== "" && passwordNueva === confirmPasswordNueva) {
            recoverPassword(searchParams.get("uuid"), passwordNueva).then((res) => {
                console.log(res)
                changeUser(res.data.user.user)
                localStorage.setItem("token", res.data.user.token)
                navigate("/")
            }).catch((e) => {
                console.log(e)
                toast.current.show({
                    severity:"error",
                    summary:"Error",
                    detail:e.message,
                    life:3000
                })
            })
        } else {
            toast.current.show({
                severity:"error",
                summary:"Error",
                detail: passwordNueva === ""? "Ingrese su nueva contraseña" : "Los campos no coinciden",
                life:3000
            })
        }
    }

    return(
        <div>
            <Toast ref={toast}/>
            {
                !errorToken ?
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"15px", padding:"15px"}} className={"gourmetic-card"}>
                        <h1>Recuperar cuenta</h1>
                        <p>Ingresa una contraseña nueva para recuperar el acceso a tu cuenta</p>
                        <label>Nueva contraseña</label>
                        <Password id={"new-password"} feedback toggleMask value={passwordNueva} onChange={(e) => {setPasswordNueva(e.target.value)}}/>
                        <label>Confirmar contraseña</label>
                        <Password id={"confirm-password"} toggleMask value={confirmPasswordNueva} onChange={(e) => {setConfirmPasswordNueva(e.target.value)}}/>
                        <Button label={"Cambiar"} icon={"pi pi-check"} onClick={()=>{resetAction()}}></Button>
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