import {v4 as uuid} from "uuid";
import {INSTANCE as api} from "../controller/apiController";

const prefix = "/users"

export function login(user, pass) {
    return api.post(prefix + "/login", {email: user, password: pass})
}

export function nuevoUsuario(user) {
    return api.post(prefix + "/registration", {user})
}

export function recuperarUsuario(email) {
    let token = uuid()
    return api.post(prefix + "/reset",{email:email, token:token})
}

export function validarToken(token){
    return api.post(prefix + "/usertoken", {token:token})
}

export function recuperarContrasena(token, password){
    return api.post(prefix + "/password", {token, password})
}

export function getUsuarioById(id){
    return api.get(prefix + "/userById/" + id)
}

export function updateUsuario(user){
    return api.put(prefix + "/update", user)
}