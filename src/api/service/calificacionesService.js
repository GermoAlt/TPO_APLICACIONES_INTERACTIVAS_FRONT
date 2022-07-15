import {INSTANCE as api, instanceToken as tokenApi} from "../controller/apiController";

const prefix = "/calificaciones"

export function getReviewsByRecipe(id){
    return api.get(prefix + "/recipe/" + id)
}

export function createReview(token, review){
    return tokenApi(token).post(prefix, review)
}