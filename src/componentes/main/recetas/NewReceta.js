import React, {useState, useRef, useEffect} from 'react';
import "./newReceta.css"
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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import useUser from "../../../hooks/useUser";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";

import {getRecipe, crearRecipe, updateRecipe, deleteRecipe} from '../../../api/controller/apiController';
import {useNavigate} from "react-router-dom";


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
        "imagenes": [],
        "dificultad": null,
        "categorias": [],
        "rating": null,
        "tiempoPreparacion": null,
        "tiempoElaboracion": null,
        "porciones": "",
        "ingredientes": [
          {
            "cantidad": "",
            "ingrediente": ""
          }
        ],
        "pasos": [
          {
            "orden": 1,
            "paso": ""
          }
        ]
    }

    const categorias= ["Postre", "Ensalada", "Sopa", "Guiso", "Carnes", "Sin gluten", "Vegetariano"]; //TODO: reemplazar por get
    const [receta, setReceta] = useState(recetaLimpia);
    const [submitted, setSubmitted] = useState(false);
    const [imagenes, setImagenes] = useState([])
    const toast = useRef(null);
    const [filteredCategorias, setFilteredCategorias] = useState(null);
    const [selectedCategorias, setSelectedCategorias] = useState(receta.categorias);

    const [stepList, setStepList] = useState(receta.pasos);
    const [listaIngredientes, setListaIngredientes] = useState(receta.ingredientes);

    const [errorClass, setErrorClass] = useState("")
    
    const [eliminarVisible, setEliminarVisible] = useState(false);
    const [editarVisible, setEditarVisible] = useState(false);
    const [guardarVisible, setGuardarVisible] = useState(false);
    const [publicarVisible, setPublicarVisible] = useState(false);

    const {user} = useUser();
    const navigate = useNavigate()


    useEffect(()=>{
        window.cloudinary.applyUploadWidget(document.getElementById('image-upload'),
            { cloudName: "remote-german", uploadPreset: "gjr53ft0", buttonCaption:"Cargar im??genes" }, (error, result) => {
                if (!error && result && result.event === "success") {
                    agregarImagen(result.info.public_id.split("/")[2])
                }
            });
    }, [])

    useEffect(() => {
        if(props.id){
            getRecipe(props.id).then(res => {
                if(res.data.recipe.autor._id !== user._id) navigate("/receta/"+props.id)
                setReceta(res.data.recipe)
                setImagenes(res.data.recipe.imagenes)
                setSelectedCategorias(res.data.recipe.categorias)
                setStepList(res.data.recipe.pasos)
                setListaIngredientes(res.data.recipe.ingredientes)
            }).catch(err => {
                console.log("Error: ", err);
            })
        }
    },[])

    const agregarImagen = (url) => {
        setImagenes(imagenes => [...imagenes, url])
    }


const guardarProducto = (estado) => {
    toast.current.clear();
    setSubmitted(true);
    
    if (receta.titulo.trim() && receta.descripcion.trim() && receta.dificultad!=null && receta.tiempoPreparacion &&
        receta.tiempoElaboracion && receta.categorias.length && receta.pasos.length && receta.ingredientes.length) {

        receta.imagenes = imagenes
        receta.estado = estado
        receta.autor = user

        if(!props.id){
            crearRecipe(receta, user.jwt).then(res => {
                toast.current.show({ severity: 'success',detail: 'Receta creada!', life: 3000 });
                navigate("/receta/"+res.data.createdRecipe._id)
            }).catch(err => {
                toast.current.show({ severity: 'error', detail: 'Ocurri?? un error al crear la receta', life: 2000 });
            })
        } else {
            updateRecipe(receta, user.jwt).then(res => {
                toast.current.show({ severity: 'success', summary: 'Perfecto', detail: 'Receta modificada', life: 3000 });
                navigate("/receta/"+props.id)
            }).catch(err => {
                toast.current.show({ severity: 'error', detail: 'Ocurri?? un error al editar la receta', life: 2000 });
            })

        }
    }else {
        toast.current.show({ severity: 'error', detail: 'Faltan datos para completar su receta', life: 2000 });
    }
}

const deleteReceta = () => {
        deleteRecipe(props.id).then(r => {
            toast.current.show({
                severity:"success",
                summary:"??Exito!",
                detail:"La receta ha sido eliminada",
                life:3000
            })
        }).catch((e) => {
            toast.current.show({
                severity:"error",
                summary:"Error",
                detail:e.message,
                life:3000
            })
        })
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
    let i = 1;
    list.forEach(item => {
        item.orden = i
        i++
    })
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

    const imagenTemplate = (imagen) => {
        return(
            <SwiperSlide key={Math.floor(Math.random() * 1010).toString()}>
                <div className={`info-receta-imagen-carousel ${errorClass}`}>
                    <AdvancedImage cldImg={getImagen("receta/"+imagen).roundCorners(byRadius(25))}
                                   plugins={[responsive({steps:1})]} onError={(e) => {
                        setErrorClass(" image-not-found")
                        mostrarError(e)
                    }}/>
                </div>
            </SwiperSlide>
        )
    }


    function mostrarError(e){
        e.target.src="https://icons.iconarchive.com/icons/webalys/kameleon.pics/256/Food-Dome-icon.png"
    }

    return (
        
            <div className={"new-receta-container"}>
                <Toast ref={toast} position="center" />
                <div className={"new-receta-details-item gourmetic-card"}>
                    <span><h1>T??tulo de la receta</h1></span>
                    <InputText id="titulo" value={receta.titulo} required autoFocus
                               onChange={(e) => cargarCamposReceta(e, 'titulo')}
                               className={classNames({ 'p-invalid': submitted && !receta.titulo })} />
                    {submitted && !receta.titulo && <small className="p-invalid">El nombre es obligatorio</small>}
                </div>
                <div className={"new-receta-details-item gourmetic-card"}>
                    <div className={"new-receta-details-item"}>
                        <label><h3>Descripci??n</h3></label>
                        <InputTextarea id="descripcion" value={receta.descripcion} onChange={(e) => cargarCamposReceta(e, 'descripcion')} className={classNames({ 'p-invalid': submitted && !receta.descripcion })}/>
                        {submitted && !receta.descripcion && <small className="p-invalid">La descripcion es obligatoria</small>}
                    </div>
                </div>

                <div className={"new-receta-container new-receta-container-large"}>
                    <div className={"new-receta-container-card new-receta-details new-receta-medium-container"}>
                        <label><h3>Carga de im??genes</h3></label>
                        <div className={"new-receta-details-image-upload-container"}>
                            <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", justifyContent:"space-around", width:"100%"}}>
                                <div style={{width:"100%", marginBottom:"5px"}}>
                                    <div id={"image-upload"} />
                                </div>
                                {
                                    imagenes.length !== 0 ?
                                        imagenes.length === 1 ?
                                            <div className={`info-receta-imagen ${errorClass}`}>
                                                <AdvancedImage cldImg={getImagen("receta/"+imagenes[0])}
                                                               plugins={[responsive({steps:1})]} onError={(e) => {
                                                    setErrorClass("image-not-found")
                                                    mostrarError(e)
                                                }}/>
                                            </div>
                                            :
                                            <div className={"gourmetic-card info-receta-carousel-container"}>
                                                <Swiper navigation={true} modules={[Navigation]} className={"info-receta-carousel"}>
                                                    {imagenes.map(imagen => {return imagenTemplate(imagen)})}
                                                </Swiper>
                                            </div>
                                        : ""
                                }
                            </div>
                        </div>
                    </div>
                    <div className={"new-receta-container-card new-receta-details new-receta-medium-container"}>
                        <div className={"new-receta-details-item"}>
                            <span><h3>Dificultad</h3></span>
                            <Rating id="dificultad" value={receta.dificultad} cancel={false} onChange={(e) => cargarCamposReceta(e, 'dificultad')} className={classNames({ 'p-invalid': submitted && !receta.dificultad })}/>
                            {submitted && !receta.dificultad && <small className="p-invalid">La dificultad es obligatoria</small>}
                        </div>
                        <div className={"new-receta-details-item"}>
                            <span><h3>Preparaci??n</h3></span>
                            <b><InputNumber value={receta.tiempoPreparacion} id="tiempoPreparacion" placeholder='Cantidad de minutos' onValueChange={(e) => cargarCamposNumericos(e, 'tiempoPreparacion')} integeronly className={classNames({ 'p-invalid': submitted && !receta.tiempoPreparacion })}/></b>
                            {submitted && !receta.tiempoPreparacion && <small className="p-invalid">Debe ingresar tiempo de preparaci??n</small>}
                        </div>
                        <div className={"new-receta-details-item"}>
                            <span><h3>Elaboraci??n</h3></span>
                            <b><InputNumber id="tiempoElaboracion" value={receta.tiempoElaboracion} placeholder='Cantidad de minutos' onValueChange={(e) => cargarCamposNumericos(e, 'tiempoElaboracion')} integeronly className={classNames({ 'p-invalid': submitted && !receta.tiempoElaboracion })}/></b>
                            {submitted && !receta.tiempoElaboracion && <small className="p-invalid">Debe ingresar tiempo de elaboraci??n</small>}
                        </div>
                        <div className={"new-receta-details-item"}>
                            <span><h3>Categor??a</h3></span>
                            <div className={"new-receta-categorias"}>
                                        <span className="p-fluid">
                                            <AutoComplete value={selectedCategorias} suggestions={filteredCategorias} completeMethod={searchCategoria} multiple onChange={(e) => {setSelectedCategorias(e.value); cargarCategorias(e.value);}} className={classNames({ 'p-invalid': submitted && !receta.categorias.length })}/>
                                        </span>
                                {submitted && !receta.categorias.length && <small className="p-invalid">Debe ingresar al menos una categor??a</small>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"new-receta-container new-receta-container-large"}>
                    <div className={"new-receta-container-card new-receta-details new-receta-medium-container"}>
                        <div className={"new-receta-details-item"}>
                            <span><h3>Pasos de preparaci??n</h3></span>
                            {stepList.map((x, i) => {
                                    return (
                                        <div style={{justifyContent:"space-around"}}>
                                            <div style={{display:"flex", justifyContent: "space-between", alignItems:"space-between", flex:"1"}}>
                                                <div style={{flex:"1", justifyContent:"flex-start"}}>
                                                    <span>{x.orden}. </span>
                                                    <InputText
                                                        style={{flex:"1", width:"90%"}}
                                                        name="paso"
                                                        placeholder="Explicaci??n del paso"
                                                        value={x.paso}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                </div>
                                                {stepList.length !== 1 && (
                                                    <Button className="mr10" onClick={() => handleRemove(i)} icon ="pi pi-minus-circle"/>
                                                )}
                                            </div>
                                            <div style={{alignItems:"flex-end", display:"flex", marginTop:"10px"}}>
                                                {stepList.length - 1 === i && (
                                                  <Button style={{marginLeft:"auto"}} onClick={() => handleAdd(stepList.length)} icon="pi pi-plus-circle"/>
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
                                    <div style={{justifyContent:"space-around"}}>
                                        <div style={{display:"flex", justifyContent: "space-between", alignItems:"space-between", flex:"1", flexDirection:"row", flexWrap:"nowrap"}}>
                                            <div style={{flex:"1", justifyContent:"space-between", alignItems:"flex-start"}}>
                                        <InputText
                                            style={{flex:"1", width:"49%"}}
                                            name="cantidad"
                                            placeholder="Cantidad y medida"
                                            value={x.cantidad}
                                            onChange={(e) => handleInputChangeIngredientes(e, i)}
                                        />
                                        <InputText
                                            style={{flex:"1", width:"49%"}}
                                            name="ingrediente"
                                            placeholder="Ingrediente"
                                            value={x.ingrediente}
                                            onChange={(e) => handleInputChangeIngredientes(e, i)}
                                        />
                                            </div>
                                        {listaIngredientes.length !== 1 && (
                                            <Button className="mr10" onClick={() => handleRemoveIngrediente(i)} icon ="pi pi-minus-circle"/>
                                        )}
                                    </div>
                                    <div style={{alignItems:"flex-end", display:"flex", marginTop:"10px"}}>
                                    {listaIngredientes.length - 1 === i && (
                                      <Button style={{marginLeft:"auto"}} onClick={handleAddIngrediente} icon="pi pi-plus-circle"/>
                                    )}
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                    {submitted && !receta.ingredientes && <small className="p-invalid">Debe ingresar los ingredientes de su receta</small>}
                </div>
                </div>

                
                    {props.id ?
                            //guardar
                            <div style={{display:"flex", flexDirection:"row", gap:15, justifyContent: "center"}}>
                                <ConfirmDialog visible={editarVisible} onHide={() => setEditarVisible(false)} message="??Confirma la publicaci??n de su receta?"
                                header="" icon="pi pi-exclamation-triangle" accept={() => guardarProducto("Publicada")}/>
                                { receta.estado && receta.estado === "Borrador" ?
                                    <div>
                                        <Button onClick={() => setPublicarVisible(true)} icon="pi pi-check" label="Publicar" />
                                    </div>
                                    : null
                                }
                                <div>
                                    <Button onClick={() => setEliminarVisible(true)} icon="pi pi-check" label="Confirmar edicion" />
                                </div>
                                <div>
                                    <Button onClick={() => setGuardarVisible(true)} icon="pi pi-save" label="Guardar como borrador" />
                                </div>
                                <div>
                                    <Button onClick={() => setGuardarVisible(true)} icon="pi pi-trash" label="Eliminar" />
                                </div>
                            </div>
                    :
                        //NEW
                    <div style={{display:"flex", flexDirection:"row", gap:15, justifyContent: "center"}}>
                        <div>
                            <Button onClick={() => setPublicarVisible(true)} icon="pi pi-check" label="Publicar" />
                        </div>
                        <div>
                            <Button onClick={() => setGuardarVisible(true)} icon="pi pi-check" label="Guardar como borrador" />
                        </div>
                    </div>
                    }
                        <ConfirmDialog visible={editarVisible} onHide={() => setEditarVisible(false)} message="??Confirma la edici??n de su receta?"
                                       header="" icon="pi pi-exclamation-triangle" accept={() => guardarProducto(receta.estado)}/>
                        <ConfirmDialog visible={guardarVisible} onHide={() => setGuardarVisible(false)} message="??Confirma el guardado de su receta como borrador?"
                                       header="" icon="pi pi-exclamation-triangle" accept={() => guardarProducto("Borrador")}/>
                        <ConfirmDialog visible={eliminarVisible} onHide={() => setEliminarVisible(false)} message="??Confirma el borrado de su receta?"
                                       header="" icon="pi pi-exclamation-triangle" accept={() => deleteReceta()}/>
                        <ConfirmDialog visible={publicarVisible} onHide={() => setPublicarVisible(false)} message="??Confirma la publicaci??n de su receta?"
                                       header="" icon="pi pi-exclamation-triangle" accept={() => guardarProducto("Publicada")}/>
            </div>
        );
}

export default NewReceta;


