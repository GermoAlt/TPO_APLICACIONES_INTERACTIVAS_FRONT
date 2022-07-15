import './login.css'

import React, {useContext, useState} from "react";
import { Dialog } from 'primereact/dialog';
import AuthButton from "./AuthButton";
import LoginContainer from "./login-options/LoginContainer";

const Login = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const [actionType, setActionType] = useState("login");


    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }

    const onClick = (name) => {
       dialogFuncMap[`${name}`](true);
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    return (
        <div className={"login"}>
            <AuthButton onClick={onClick}/>
            <Dialog className={"login-dialog"} visible={displayBasic} onHide={() => onHide('displayBasic')} position={"center"}
                    resizable={false} draggable={false} blockScroll={true} dismissableMask closable={false} showHeader={false}>
                <LoginContainer actionType={actionType} setActionType={(e) => setActionType(e)}
                                ocultar={() => onHide('displayBasic')}/>
            </Dialog>
        </div>
    );
}

export default Login;