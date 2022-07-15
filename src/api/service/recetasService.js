import {INSTANCE as api, instanceToken as apiToken} from "../controller/apiController";

const prefix = "/recipes"

export function createReceta(receta, token){
    return apiToken(token).post(prefix + "/recipe", receta)
}

export function updateReceta(receta, token){
    return apiToken(token).put(prefix + "/recipe/" + receta._id, receta).then(r => {
        console.log(r)
    })
}

export function getRecetas(){
    return api.get(prefix + "/recipes")
}

export function getRecetaById(id){
    return api.get(prefix + "/recipe/" + id)
}

export function getRecetasByUser(id){
    return api.get(prefix + "/recipes/" + id)
}

export function deleteReceta(id){
    return api.delete(prefix + "/recipe/" + id)
}