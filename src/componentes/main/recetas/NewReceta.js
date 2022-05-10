import React, { useState, useRef } from 'react';
import "./newReceta.css"
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
const [selectedCategories, setSelectedCategories] = useState(categorias.slice(0,0));
const [checked, setChecked] = useState(false);



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


const [stepList, setStepList] = useState([{ orden: 1, paso: '' }]);

const handleInputChange = (e, index) => {
    const prueba = e.value;
    let recipe = { ...receta };
    const { name, value } = e.target;
    const list = [...stepList];
    list[index][name] = value;
    setStepList(list);
    recipe.pasos = list;
    setReceta(recipe);
};

  const handleRemove = index => {
    const list = [...stepList];
    list.splice(index, 1);
    setStepList(list);
  };

  const handleAdd = (cant) => {
    let nroOrden= cant+1;
    setStepList([...stepList, { orden: nroOrden , paso: '' }]);
  };

    return (
        
            <div className={"new-receta-container"}>
                <Toast ref={toast} />
                        <div className={"new-receta-details-item"}>
                            <span>Título de la receta</span>
                            <InputText id="titulo" value={receta.titulo} onChange={(e) => cargarCamposReceta(e, 'titulo')} required autoFocus className={classNames({ 'p-invalid': submitted && !receta.titulo })} />
                            {submitted && !receta.titulo && <small className="p-invalid">El nombre es obligatorio</small>}
                        </div>
                    <div className={"new-receta-container-card new-receta-details"}>
                        <div className={"new-receta-details-item"}>
                            <label>Descripción</label>
                            <InputTextarea id="descripcion" value={receta.descripcion} onChange={(e) => cargarCamposReceta(e, 'descripcion')} required rows={3} cols={20} />
                            {submitted && !receta.descripcion && <small className="p-invalid">La descripción es obligatoria</small>}
                        </div>
                
                        <div className={"new-receta-details-item"}>
                            <span>Dificultad</span>
                            <Rating id="dificultad" value={receta.dificultad} cancel={false} onChange={(e) => cargarCamposReceta(e, 'dificultad')}/>
                        </div>
                        <div className={"new-receta-details-item"}>
                            <span>Preparación</span>
                            <b><InputNumber id="tiempoPreparacion" placeholder='Cantidad de minutos' onValueChange={(e) => cargarCamposNumericos(e, 'tiempoPreparacion')} integeronly/></b>
                        </div>
                        <div className={"new-receta-details-item"}>
                            <span>Elaboración</span>
                            <b><InputNumber id="tiempoElaboracion" placeholder='Cantidad de minutos' value={receta.tiempoElaboracion} onValueChange={(e) => cargarCamposNumericos(e, 'tiempoElaboracion')} integeronly /></b>
                        </div>
                    </div>
                    <div className={"new-receta-container-card new-receta-details"}>
                                <div className={"new-receta-details-item"}>
                                    <span>Categoría</span>
                                    <div className={"new-receta-categorias"}>
                                        {
                                            categorias.map((categoria) => {
                                                return (
                                                    <div key={categoria} className="field-checkbox">
                                                        <Checkbox inputId={categoria} name="categoria" value={categoria} onChange={onCategoryChange} checked={selectedCategories.some((item) => item === categoria)} />
                                                        <label htmlFor={categoria}>{categoria}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                        <div className={"new-receta-details-item"}>
                            <span>Pasos de preparación</span>
                            {stepList.map((x, i) => {
                                    return (
                                    <div>
                                        <InputText readOnly
                                            name="orden"
                                            placeholder="Número de orden"
                                            value={x.orden}
                                            onChange={(e) => handleInputChange(e, i)}
                                        />
                                        <InputText
                                            name="paso"
                                            placeholder="Explicación del paso"
                                            value={x.paso}
                                            onChange={(e) => handleInputChange(e, i)}
                                        />
                                        <div>
                                        {stepList.length !== 1 && (
                                            <Button className="mr10" onClick={() => handleRemove(i)} icon ="pi pi-minus-circle"/>
                                        )}
                                        {stepList.length - 1 === i && (
                                          <Button onClick={() => handleAdd(stepList.length)} icon="pi pi-plus-circle"/>
                                        )}
                                        </div>
                                    </div>
                                );
                            })}
                            
                        </div>                   
                    </div>

                        <div>
                            <Button onClick={guardarProducto}>Guardar</Button>  
                        </div>


            </div>

        );
    
}
export default NewReceta;


