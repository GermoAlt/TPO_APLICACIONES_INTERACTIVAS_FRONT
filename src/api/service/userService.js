import {v4 as uuid} from "uuid";
import {INSTANCE as api} from "../controller/apiController";

const prefix = "/users"

export function login(user, pass) {
    api.post(prefix + "/login", {email: user, password: pass}).then(r  =>{
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
    api.post(prefix + "/registration", {user})
}

export function recuperarUsuario(email) {
    api.post(prefix + "/reset",{email:email, token:uuid})
}