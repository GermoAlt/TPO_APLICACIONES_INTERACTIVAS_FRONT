import {v4 as uuid} from "uuid";
import {INSTANCE as api} from "../controller/apiController";

export function login(user, pass) {
    api.post("/login", {email: user, password: pass}).then(r  =>{
        switch (r.status) {
            case 200:
                console.log("login exitoso")
                break
            default:
                console.log("error de login")
                break
        }
    })
}

export function nuevoUsuario(user) {
    api.post("/registration", {user})
}

export function recuperarUsuario(email) {
    api.post("/reset",{email:email, token:uuid})
}