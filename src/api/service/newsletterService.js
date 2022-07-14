import {INSTANCE as api} from "../controller/apiController";

const prefix = "/newsletter"

export function addToNewsletter(mail){
    return api.post(prefix, mail)
}