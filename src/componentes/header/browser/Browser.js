import React, {useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { useNavigate } from "react-router-dom";

const Browser = () => {
    let navigate = useNavigate();
    const [browsed, setBrowsed] = useState("");
    const handleBrowse = () => {
        navigate(`/resultados/${browsed}`);
    }

    return (
        <div className="xs:col-3 col-10">
            <div className="p-inputgroup">
                <InputText placeholder="Buscar recetas" value={browsed} onChange={(e) => setBrowsed(e.target.value)}/>
                <Button icon="pi pi-search" onClick={() => handleBrowse()}/>
            </div>
        </div>
    );
}

export default Browser;