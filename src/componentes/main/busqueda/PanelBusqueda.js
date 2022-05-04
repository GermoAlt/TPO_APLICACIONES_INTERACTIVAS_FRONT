import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import RecipeList from './RecipesList';

export default function PanelBusqueda() {
    const params = useParams()
    const [browsed,setBrowsed] = useState(params.browsed);

    return (
        <div className="grid">
            <div className="col-12 info-receta-container-card" >
                <div className="col-12 flex flex-wrap justify-content-center recipes-title">
                    Resultados de búsqueda: {browsed}
                </div>
                <br />
                <div className="col-12">
                    <RecipeList browsed={browsed} />
                </div>
            </div>
        </div>
    )
}