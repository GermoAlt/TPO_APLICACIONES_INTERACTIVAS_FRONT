import {Button} from "primereact/button";
import {login} from "../../api/controller/apiController";

export default function DevPanel(){
    return (
        <main>
            <Button onClick={() => loginDev()} label={"test login"}></Button>
        </main>
    )
}

function loginDev (){
    login("user", "pass")
}