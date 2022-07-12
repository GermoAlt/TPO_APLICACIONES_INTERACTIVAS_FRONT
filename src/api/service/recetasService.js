import {INSTANCE as api} from "../controller/apiController";

const prefix = "/recipes"

export function createReceta(receta){
    return api.post(prefix + "/recipe", receta)
}

export function updateReceta(receta){
    return api.put(prefix + "/recipe/" + receta.id, receta).then(r => {
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