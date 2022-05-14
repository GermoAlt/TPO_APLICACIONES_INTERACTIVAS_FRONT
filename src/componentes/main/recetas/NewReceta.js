import React, { useState, useRef } from 'react';
import "./newReceta.css"
import dataReceta from '../../../api/recetas.json'
import {AdvancedImage, responsive} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


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

    const categorias= ["Postre", "Ensalada", "Sopa", "Guiso", "Carnes", "Sin gluten", "Vegetariano"];
    const [recetas, setRecetas] = useState([...dataReceta]);
    const [recetaDialog, setMensaje] = useState(false);
    const [receta, setReceta] = useState(recetaLimpia);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [selectedCategories, setSelectedCategories] = useState(categorias.slice(0,0));
    const [filteredCategorias, setFilteredCategorias] = useState(null);
    const [selectedCategorias, setSelectedCategorias] = useState(null);
    
    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
    const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};
    
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [visible, setVisible] = useState(false);


const guardarProducto = () => {
    toast.current.clear();
    setSubmitted(true);
    if (receta.titulo.trim() && receta.descripcion.trim() && receta.dificultad!=null && receta.tiempoPreparacion!=0 && 
        receta.tiempoElaboracion!=0 && receta.categorias.length && receta.pasos.length && receta.ingredientes.length) {

        let listaRecetas = [...recetas];
        let recetaNueva = { ...receta };
        if (receta.id) {
            const index = findIndexById(receta.id);

            listaRecetas[index] = recetaNueva;
            toast.current.show({ severity: 'success', summary: 'Perfecto', detail: 'Receta modificada', life: 3000 });
        }
        else {
            recetaNueva.id = createId();
            listaRecetas.push(recetaNueva);
                toast.current.show({ severity: 'success',detail: 'Receta ' + recetaNueva.id + ' creada!', life: 3000 });
        }

        setRecetas(listaRecetas);
        setMensaje(false);
        setReceta(recetaLimpia);
    }else {
        toast.current.show({ severity: 'error', detail: 'Faltan datos para completar su receta', life: 2000 });
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

const cargarCategorias = (categorias) => {
    let recipe = { ...receta };
    recipe.categorias=categorias;
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
const [listaIngredientes, setListaIngredientes] = useState([{ cantidad: '', ingrediente: '' }]);

const handleInputChange = (e, index) => {
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


  
const handleInputChangeIngredientes = (e, index) => {
    let recipe = { ...receta };
    const { name, value } = e.target;
    const list = [...listaIngredientes];
    list[index][name] = value;
    setListaIngredientes(list);
    recipe.ingredientes = list;
    setReceta(recipe);
};

  const handleRemoveIngrediente = index => {
    const list = [...listaIngredientes];
    list.splice(index, 1);
    setListaIngredientes(list);
  };

  const handleAddIngrediente = () => {
    setListaIngredientes([...listaIngredientes, { cantidad: '' , ingrediente: '' }]);
  };

  const searchCategoria = (event) => {
    setTimeout(() => {
        let _filteredCategorias;
        if (!event.query.trim().length) {
            _filteredCategorias = [...categorias];
        }
        else {
            _filteredCategorias = categorias.filter((categoria) => {
                return categoria.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }

        setFilteredCategorias(_filteredCategorias);
    }, 250);
};

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        Array.from(e.files).forEach(file => {
            _totalSize += file.size;
        });

        setTotalSize(_totalSize);
    }

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach(file => {
            _totalSize += (file.size || 0);
        });

        setTotalSize(_totalSize);
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    }

    const onTemplateClear = () => {
        setTotalSize(0);
    }

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;

        return (
            <div className={className} style={{display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    }

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{width: '40%'}}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Arrastre sus imágenes</span>
            </div>
        )
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

    
    return (
        
            <div className={"new-receta-container"}>
                <Toast ref={toast} position="center" />
                <div className={"new-receta-details-item gourmetic-card"}>
                            <span><h1>Título de la receta</h1></span>
                            <InputText id="titulo" value={receta.titulo} onChange={(e) => cargarCamposReceta(e, 'titulo')} required autoFocus className={classNames({ 'p-invalid': submitted && !receta.titulo })} />
                            {submitted && !receta.titulo && <small className="p-invalid">El nombre es obligatorio</small>}
                        </div>

                <div className={"new-receta-container new-receta-container-large"}>
                    <div className={"new-receta-details-item gourmetic-card new-receta-medium-container"}>
                        <label><h3>Carga de imágenes</h3></label>
                        <div className={"new-receta-details-image-upload-container"}>
                            <FileUpload ref={fileUploadRef} url="https://api.cloudinary.com/v1_1/dgse81k8x/upload" multiple accept="image/*" maxFileSize={1000000}
                                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                        </div>
                    </div>
                    <div className={"new-receta-container-card new-receta-details new-receta-medium-container"}>
                    <div className={"new-receta-details-item"}>
                        <label><h3>Descripción</h3></label>
                        <InputTextarea id="descripcion" value={receta.descripcion} onChange={(e) => cargarCamposReceta(e, 'descripcion')} className={classNames({ 'p-invalid': submitted && !receta.descripcion })}/>
                        {submitted && !receta.descripcion && <small className="p-invalid">La descripcion es obligatoria</small>}
                    </div>

                    <div className={"new-receta-details-item"}>
                        <span><h3>Dificultad</h3></span>
                        <Rating id="dificultad" value={receta.dificultad} cancel={false} onChange={(e) => cargarCamposReceta(e, 'dificultad')} className={classNames({ 'p-invalid': submitted && !receta.dificultad })}/>
                        {submitted && !receta.dificultad && <small className="p-invalid">La dificultad es obligatoria</small>}
                    </div>
                    <div className={"new-receta-details-item"}>
                        <span><h3>Preparación</h3></span>
                        <b><InputNumber id="tiempoPreparacion" placeholder='Cantidad de minutos' onValueChange={(e) => cargarCamposNumericos(e, 'tiempoPreparacion')} integeronly className={classNames({ 'p-invalid': submitted && !receta.tiempoPreparacion })}/></b>
                        {submitted && !receta.tiempoPreparacion && <small className="p-invalid">Debe ingresar tiempo de preparación</small>}
                    </div>
                    <div className={"new-receta-details-item"}>
                        <span><h3>Elaboración</h3></span>
                        <b><InputNumber id="tiempoElaboracion" placeholder='Cantidad de minutos' onValueChange={(e) => cargarCamposNumericos(e, 'tiempoElaboracion')} integeronly className={classNames({ 'p-invalid': submitted && !receta.tiempoElaboracion })}/></b>
                        {submitted && !receta.tiempoElaboracion && <small className="p-invalid">Debe ingresar tiempo de elaboración</small>}
                    </div>
                    <div className={"new-receta-details-item"}>
                        <span><h3>Categoría</h3></span>
                        <div className={"new-receta-categorias"}>
                                    <span className="p-fluid">
                                        <AutoComplete value={selectedCategorias} suggestions={filteredCategorias} completeMethod={searchCategoria} multiple onChange={(e) => {setSelectedCategorias(e.value); cargarCategorias(e.value);}} className={classNames({ 'p-invalid': submitted && !receta.categorias.length })}/>
                                    </span>
                            {submitted && !receta.categorias.length && <small className="p-invalid">Debe ingresar al menos una categoría</small>}
                        </div>
                    </div>
                </div>
                </div>

                <div className={"new-receta-container new-receta-container-large"}>
                    <div className={"new-receta-container-card new-receta-details new-receta-medium-container"}>
                        <div className={"new-receta-details-item"}>
                            <span><h3>Pasos de preparación</h3></span>
                            {stepList.map((x, i) => {
                                    return (
                                    <div>
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
                            {submitted && !receta.pasos && <small className="p-invalid">Debe ingresar los pasos de su receta</small>}
                        </div>
                    </div>
                    <div className={"new-receta-container-card new-receta-details new-receta-medium-container"}>
                    <div className={"new-receta-details-item"}>
                        <span><h3>Ingredientes</h3></span>
                        {listaIngredientes.map((x, i) => {
                                return (
                                <div>
                                    <InputText
                                        name="cantidad"
                                        placeholder="Cantidad y medida"
                                        value={x.cantidad}
                                        onChange={(e) => handleInputChangeIngredientes(e, i)}
                                    />
                                    <InputText
                                        name="ingrediente"
                                        placeholder="Ingrediente"
                                        value={x.ingrediente}
                                        onChange={(e) => handleInputChangeIngredientes(e, i)}
                                    />
                                    <div>
                                    {listaIngredientes.length !== 1 && (
                                        <Button className="mr10" onClick={() => handleRemoveIngrediente(i)} icon ="pi pi-minus-circle"/>
                                    )}
                                    {listaIngredientes.length - 1 === i && (
                                      <Button onClick={handleAddIngrediente} icon="pi pi-plus-circle"/>
                                    )}
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                    {submitted && !receta.ingredientes && <small className="p-invalid">Debe ingresar los ingredientes de su receta</small>}
                </div>
                </div>

                <div>
                    <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="¿Confirma la creacion de su receta?"
                    header="" icon="pi pi-exclamation-triangle" accept={guardarProducto} reject={reject} />
                    <Button onClick={() => setVisible(true)} icon="pi pi-check" label="Guardar" />
                </div>
            </div>
        );
}

export default NewReceta;


