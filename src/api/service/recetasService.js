import {INSTANCE as api} from "../controller/apiController";

const prefix = "/recipes"

export function createReceta(receta){
    api.post(prefix + "/recipe", receta)
}