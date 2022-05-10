import React, { useState, useRef } from 'react';
import "./infoReceta.css"
import dataReceta from '../../../api/recetas.json'
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import useUser from "../../../hooks/useUser";


const NewReceta = (props) => {


let recetaLimpia = {
        "id": null,
        "titulo": "",
        "user" : {
          "id": null,
          "nombre": "",
          "imagen": "",
          "mail": "",
          "telefono": ""
        },
        "descripcion": "",
        "imagenes": [""],
        "dificultad": null,
        "categorias": [""],
        "rating": null,
        "tiempoPreparacion": 0,
        "tiempoElaboracion": 0,
        "porciones": "",
        "ingredientes": [
          {
            "cantidad": "",
            "ingrediente": ""
          }
        ],
        "pasos": [
          {
            "orden": 0,
            "paso": ""
          }
        ]
    }

const categorias= ["CAKE","CHOCOLATE CAKE","AMERICAN", "CHOCOLATE", "COCONUT", "COFFEE", "CREAM CHEESE", "MAKE AHEAD", "DESSERT"];
const [recetas, setRecetas] = useState([...dataReceta]);
const [recetaDialog, setMensaje] = useState(false);
const [receta, setReceta] = useState(recetaLimpia);
const [submitted, setSubmitted] = useState(false);
const toast = useRef(null);



const guardarProducto = () => {
    setSubmitted(true);

    if (receta.titulo.trim()) {
        let listaRecetas = [...recetas];
        let recetaNueva = { ...receta };
        if (receta.id) {
            const index = findIndexById(receta.id);

            listaRecetas[index] = recetaNueva;
            toast.current.show({ severity: 'success', summary: 'Perfecto', detail: 'Receta modificada', life: 3000 });
        }
        else {
            recetaNueva.id = createId();
            recetaNueva.image = '';
            listaRecetas.push(recetaNueva);
            toast.current.show({ severity: 'success', summary: 'Perfecto', detail: 'Receta creada', life: 3000 });
        }

        setRecetas(listaRecetas);
        setMensaje(false);
        setReceta(recetaLimpia);
    }
}


const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < recetas.length; i++) {
        if (recetas[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

const createId = () => { 
    let id = '';
    for (let i = 0; i < 4; i++) {
        id += Math.floor(Math.random() * 5);
    }
    return id;
}


const cargarCamposReceta = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let recipe = { ...receta };
    recipe[`${name}`] = val;

    setReceta(recipe);
}

const cargarCamposNumericos = (e, name) => {
    const val = e.value || 0;
    let recipe = { ...receta };
    recipe[`${name}`] = val;

    setReceta(recipe);
}

const [selectedCategories, setSelectedCategories] = useState(receta.categorias.slice(1,3));

const onCategoryChange = (e) => {
    let recipe = { ...receta };
    let _selectedCategories = [...selectedCategories];

    if (e.checked) {
        _selectedCategories.push(e.value);
    }
    else {
        for (let i = 0; i < _selectedCategories.length; i++) {
            const selectedCategory = _selectedCategories[i];

            if (selectedCategory.key === e.value.key) {
                _selectedCategories.splice(i, 1);
                break;
            }
        }
    }
    setSelectedCategories(_selectedCategories);
    recipe.categorias = _selectedCategories;
    setReceta(recipe);
}

    return (
        
            <div className={"info-receta-container"}>
                <Toast ref={toast} />
                        <div className={"info-receta-details-item"}>
                            <span>Título de la receta</span>
                            <InputText id="titulo" value={receta.titulo} onChange={(e) => cargarCamposReceta(e, 'titulo')} required autoFocus className={classNames({ 'p-invalid': submitted && !receta.titulo })} />
                            {submitted && !receta.titulo && <small className="p-invalid">El nombre es obligatorio</small>}
                        </div>
                    <div className={"info-receta-container-card info-receta-details"}>
                        <div className={"info-receta-details-item"}>
                            <label>Descripción</label>
                            <InputTextarea id="descripcion" value={receta.descripcion} onChange={(e) => cargarCamposReceta(e, 'descripcion')} required rows={3} cols={20} />
                        </div>
                
                        <div className={"info-receta-details-item"}>
                            <span>Dificultad</span>
                            <Rating id="dificultad" value={receta.dificultad} cancel={false} onChange={(e) => cargarCamposReceta(e, 'dificultad')}/>
                        </div>
                        <div className={"info-receta-details-item"}>
                            <span>Preparación</span>
                            <b><InputNumber id="tiempoPreparacion" value={receta.tiempoPreparacion} onValueChange={(e) => cargarCamposNumericos(e, 'tiempoPreparacion')} integeronly/></b>
                        </div>
                        <div className={"info-receta-details-item"}>
                            <span>Elaboración</span>
                            <b><InputNumber id="tiempoElaboracion" value={receta.tiempoElaboracion} onValueChange={(e) => cargarCamposNumericos(e, 'tiempoElaboracion')} integeronly /></b>
                        </div>
                        <div className={"info-receta-details-item"}>
                            <span>Categoría</span>
                            <div className={"info-receta-categorias"}>
                                {
                                    categorias.map((categoria) => {
                                        return (
                                            <div key={categoria} className="field-checkbox">
                                                <Checkbox inputId={categoria} name="categoria" value={categoria} onChange={onCategoryChange} checked={selectedCategories.some((item) => item.key === categoria)} disabled={categoria === 'R'} />
                                                <label htmlFor={categoria}>{categoria}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                        <div>
                            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={guardarProducto} />   
                        </div>
            </div>

        );
    
}
export default NewReceta;


