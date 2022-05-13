import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import RecipeList from './RecipeList';
import Browser from "../../header/browser/Browser";

export default function PanelBusqueda() {
    const params = useParams()
    const [browsed,setBrowsed] = useState(params.browsed || "");
    useEffect(() => {
        window.scrollTo(0,0)
    }, []);

    useEffect(() => {
        setBrowsed(params.browsed || "");
    },[params.browsed])


    return (
        <div className="grid profile-container">
            <div className="col-12 gourmetic-card" >
                <div className="col-12 flex flex-wrap justify-content-center recipes-title">
                    {browsed === "" ? <Browser/> : "Resultados de búsqueda: " + browsed}
                </div>
            </div>
            <div className="col-12 gourmetic-card" >
                <div className="col-12">
                    <RecipeList browsed={browsed} />
                </div>
            </div>
        </div>
    )
}