import axios from "axios";
import {login as userLogin, recuperarUsuario}  from "../service/userService";
import {createReceta} from "../service/recetasService";

export const INSTANCE = getInstance()

function getInstance() {
    return axios.create({
        baseURL: 'http://localhost:3600',
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            'Content-Type': 'application/json'
        }
    })
}

/* USUARIOS */
export function login(user,pass){
    userLogin(user, pass)
}

export function getUser(userId){

}

export function newUser(data) {

}

export function resetPassword(email) {
    recuperarUsuario(email)
}

export function getReceta(recetaId){

}

export function getRecetas(){

}

export function getRecetasByUser(userId){

}

export function crearReceta(receta) {
    createReceta(receta)
}

export function updateReceta(receta) {

}

export function deleteReceta(receta) {

}

export function getCalificacionesByReceta(recetaId){

}

export function createCalificacion(){

}

export function getCategorias(){

}