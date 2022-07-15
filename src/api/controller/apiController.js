import axios from "axios";
import {
    getUsuarioById,
    login as userLogin,
    nuevoUsuario, recuperarContrasena,
    recuperarUsuario,
    updateUsuario, validarToken
} from "../service/userService";
import {
    createReceta,
    deleteReceta,
    getRecetaById,
    getRecetas,
    getRecetasByUser,
    updateReceta
} from "../service/recetasService";
import {addToNewsletter} from "../service/newsletterService";

export const INSTANCE = getInstance()
export function instanceToken(token){
    return axios.create({
        baseURL: 'http://localhost:3600',
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            'Content-Type': 'application/json',
            'token': token
        }
    })
}

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
    return userLogin(user, pass)
}

export function getUser(userId){
    return getUsuarioById(userId)
}

export function newUser(data) {
    return nuevoUsuario(data)
}

export function updateUser(user) {
    return updateUsuario(user)
}

export function resetPassword(email) {
    return recuperarUsuario(email)
}

export function validateToken(token) {
    return validarToken(token)
}

export function recoverPassword(token, password) {
    return recuperarContrasena(token, password)
}

export function getRecipe(recetaId){
    return getRecetaById(recetaId)
}

export function getRecipes(){
    return getRecetas()
}

export function getRecipesByUser(userId){
    return getRecetasByUser(userId)
}

export function crearRecipe(receta, token) {
    return createReceta(receta, token)
}

export function updateRecipe(receta) {
    return updateReceta(receta)
}

export function deleteRecipe(id) {
    return deleteReceta(id)
}

export function getCalificacionesByRecipe(recetaId){

}

export function createCalificacion(){

}

export function getCategorias(){

}

export function agregarNewsletter(mail){
    return addToNewsletter()
}