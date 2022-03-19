import {useContext} from "react";
import UserContext from "../contexts/UserContext";

export default () => {
    const context = useContext(UserContext);

    return context;
}