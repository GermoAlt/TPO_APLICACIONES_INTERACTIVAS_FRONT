import React, { useState, useEffect,useRef } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import {useNavigate} from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';

import useUser from '../../../hooks/useUser';
import {deleteRecipe, getRecipes, getRecipesByUser} from "../../../api/controller/apiController";

import './recipe-list.css';

import {Tooltip} from "primereact/tooltip";
import { Toast } from 'primereact/toast';
import {AdvancedImage} from "@cloudinary/react";
import {getImagen} from "../../imagen/getImagenCloud";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";

const RecipeList = (props) => {
    let browsed = props.browsed ? props.browsed : ""
    let rows = props.rows ? props.rows : 6
    const {user} = useUser();
    
    const [isProfile, ] = useState(props.isProfile ? props.isProfile : false);
    const [isLoading, setIsLoading] = useState(false);
    const [finalRecipes,setFinalRecipes] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        if(props.isProfile){
            getRecipesByUser(user._id).then(res => {
                if(browsed !== ""){
                    filterContent(res.data.recipes).then(filteredRecipes => setFinalRecipes(filteredRecipes))
                }
                else{
                    setFinalRecipes(res.data.recipes);
                }
            }).catch(err => {
                console.log("Error: ", err)
            })
            
        }
        else{
            getRecipes().then(res => {
                if(browsed !== ""){
                    filterContent(res.data.recipes).then(filteredRecipes => setFinalRecipes(filteredRecipes))
                }
                else{
                    setFinalRecipes(res.data.recipes);
                }
            }).catch(err => {
                console.log("Error: ", err)
            })
        }
        setIsLoading(false);
    },[browsed]);

    const recipeNotDuplicated = (recipeList,currentRecipe) => {
        let isDuplicated = true;
        recipeList.forEach(recipe => {
            if(recipe._id === currentRecipe._id){
                isDuplicated = false;
            }
        });
        return isDuplicated;
    }

    const filterContent = (recetas) => {
        return new Promise((resolve,reject) => {
            try{
                let selectedRecipes = [];
                recetas.forEach(recipe => {
                    if(recipe.titulo.toLowerCase().includes(browsed.toLowerCase()) && recipeNotDuplicated(selectedRecipes,recipe)){
                        selectedRecipes.push(recipe)
                    }
                    if(recipe.descripcion.toLowerCase().includes(browsed.toLowerCase()) && recipeNotDuplicated(selectedRecipes,recipe)){
                        selectedRecipes.push(recipe)
                    }
                    recipe.categorias.forEach(cat => {
                        if(cat.toLowerCase().includes(browsed.toLowerCase()) && recipeNotDuplicated(selectedRecipes,recipe)){
                            selectedRecipes.push(recipe)
                        }
                    })
                    recipe.ingredientes.forEach(ingredient => {
                        if(ingredient.ingrediente.toLowerCase().includes(browsed.toLowerCase())){
                            if(recipeNotDuplicated(selectedRecipes,recipe)){
                                selectedRecipes.push(recipe);
                            }
                        }
                    })
                });
                resolve([...selectedRecipes]);
            }
            catch(err){
                console.log("Error: ",err)
                alert("Something went wrong when searching for results: " + JSON.stringify(err));
                setIsLoading(false);
                reject(recetas);
            }
        })
    }

    return (
        <div>
            {isLoading?
                (<div className="col-12">
                    Cargando...
                </div>):
                (<div className="col-12" style={{width: '100%'}}>
                    {finalRecipes.length !== 0?
                        <DataViewDemo browsedRecipes={finalRecipes} rows={rows} isProfile={isProfile}/>:
                        <div>No se han encontrado recetas</div>
                    }
                </div>)
                }
        </div>
    )
}

const DataViewDemo = (props) => {
    let browsedRecipes = props.browsedRecipes
    let isProfile = props.isProfile
    let navigate = useNavigate()
    const [foundRecipes, setFoundRecipes] = useState([...browsedRecipes])
    const [products, setProducts] = useState([...browsedRecipes]);
    const [layout, setLayout] = useState('grid');
    const sortOrder = 1;
    const sortField = "price";
    const {user} = useUser();
    const toast = useRef()

    const handleDelete = (data) => {
        setProducts(products.filter(i => i._id !== data._id))
        deleteRecipe(data._id,user.jwt).then(res => {
            toast.current.show({ severity: 'success',detail: 'Receta eliminada con ??xito!', life: 3000 });
        }).catch(err => {
            toast.current.show({ severity: 'error', detail: 'Ocurri?? un error al eliminar la receta', life: 2000 });
        });
    }

    useState(() => {
        setProducts([...foundRecipes]);
    },[browsedRecipes])

    const onSelectRecipe = (recipeId) => {
        navigate(`/receta/${recipeId}`)
    }

    const goToEditRecipe = (id) => {
        navigate(`/receta/${id}/edit`)
    }

    const renderListItem = (data) => {
        return (
            <div className="col-12">
                <div className="product-list-item">
                    <div style={{display:"flex", flexDirection:"column", gap:"5px", justifyContent:"space-around"}}>
                        <AdvancedImage cldImg={getImagen(`receta/${data.imagenes[0]}`).roundCorners(byRadius(25)).resize(thumbnail().width(200))} />
                        { data.estado === "Borrador" ? <span className={"status"}>BORRADOR</span> : null}
                    </div>
                    <div className="product-list-detail">
                        <div className="product-name">{data.titulo}</div>
                        <Rating value={data.dificultad} readOnly cancel={false}></Rating>
                        <div className="product-description">{data.descripcion}</div>
                    </div>
                    <div className="product-list-action">
                        <div><span className="product-category">{data.categorias[0]}</span><i className="pi pi-tag product-category-icon"></i></div>
                        <Button style={{marginTop: '2%'}} icon={"pi pi-search"} label="Ver" onClick={()=>onSelectRecipe(data._id)}></Button>
                        {isProfile ? <Button style={{marginTop: '2%'}} icon={"pi pi-pencil"} label="Editar" onClick={()=>goToEditRecipe(data._id)}></Button>:""}
                        {isProfile ? <Button style={{marginTop: '2%'}} label="Eliminar" className="p-button-danger" icon={"pi pi-trash"}onClick={()=>handleDelete(data)}></Button>:""}
                    </div>
                </div>
            </div>
        );
    }

    const renderGridItem = (data) => {
        return (
                <div className="product-grid-item gourmetic-card">
                    <Tooltip target={"#grid-tooltip-"+data._id}>
                        <h3>{data.titulo}</h3>
                        <p>{data.descripcion}</p>
                    </Tooltip>
                    <div className="product-grid-item-top">
                        <div>
                            <i className="pi pi-tag product-category-icon"></i>
                            <span className="product-category">{data.categorias[0]}</span>
                        </div>
                        <div>
                            { data.estado === "Borrador" ? <span className={"status"}>BORRADOR</span> : null}
                        </div>
                    </div>
                    <div className="product-grid-item-content">
                        <AdvancedImage cldImg={getImagen(`receta/${data.imagenes[0]}`).roundCorners(byRadius(25)).resize(thumbnail().width(250))} />
                        <Rating value={data.dificultad} readOnly cancel={false}></Rating>
                        <div className="grid-tooltip product-name"  id={"grid-tooltip-" + data._id}>{data.titulo}</div>
                        <div className="grid-tooltip product-description">{data.descripcion}</div>
                    </div>
                    <div className="product-grid-item-bottom">
                        <Button style={{marginTop: '5%'}} className="p-button-rounded" icon={"pi pi-search"} onClick={()=>onSelectRecipe(data._id)}></Button>
                        {isProfile ? <Button style={{marginTop: '5%', marginLeft:"2px"}}  className="p-button-rounded" icon={"pi pi-pencil"} onClick={()=>goToEditRecipe(data._id)}></Button>:""}
                        {isProfile ? <Button style={{marginTop: '5%', marginLeft:"2px"}} className="p-button-rounded p-button-danger" icon={"pi pi-trash"} onClick={()=>handleDelete(data)}></Button>:""}
                    </div>
                </div>
        );
    }

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }
        if (layout === 'list')
            return renderListItem(product);
        else if (layout === 'grid')
            return renderGridItem(product);
    }

    const renderHeader = () => {
        return (
            <div className="grid recipe-list-dataview-header">
                <div className="col-7" style={{textAlign: 'left'}}>
                    <Filters products={products} setProducts={(value) => setProducts(value)} foundRecipes={foundRecipes} />
                </div>
                <div className="col-5" style={{textAlign: 'right'}}>
                    <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
            </div>
        );
    }

    const header = renderHeader();

    const paginatorTemplate = {
        layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
        'CurrentPageReport': (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} de {options.totalRecords}
                </span>
            )
        }
    }

    return (
        <div className="dataview-demo">
            <Toast ref={toast}/>
            <div className="gourmetic-card">
                <DataView value={products} layout={layout} header={header}
                          itemTemplate={itemTemplate} paginator rows={props.rows}
                          paginatorTemplate={paginatorTemplate} emptyMessage={"No hay recetas disponibles con esas caracter??sticas"}
                />
            </div>
        </div>
    );
}

const Filters = ({products,setProducts,foundRecipes}) => {
    const filters =[
        {label: 'Categoria', value: 'Categoria'},
        {label: 'Dificultad', value: 'Dificultad'},
        {label: 'Ingredientes', value: 'Ingredientes'}
    ];

    let searchParams = (new URL(document.location)).searchParams
    let filterType = searchParams.get("filterBy")
    let filterValue = searchParams.get("val")

    const [filter,setFilter] = useState(filterType || "");
    const [inputValue, setInputValue] = useState(filterValue || "");
    const [allIngredients, setAllIngredients] = useState([]);

    useEffect(() => {
        getAllIngredients();
    },[])

    useEffect(() => {
        handleInputChange(inputValue);
    },[inputValue]);

    const getAllIngredients = () => {
        let ingredients = []
        let recetas = [...foundRecipes];
        recetas.forEach(receta => { // por cada receta
            let listaIngredientes = [...receta.ingredientes]; // tomo sus ingredientes
            listaIngredientes.forEach(ingrediente => {
                if(ingredients === [] || ![...ingredients.map(ing => ing.ingrediente.toString().toLowerCase())].includes(ingrediente.ingrediente)){ // compruebo que no se repitan
                    ingredients.push({"ingrediente":ingrediente.ingrediente,"code": ingrediente._id}); // formato requerido por el selector
                }
            });
        })
        setAllIngredients([...ingredients]);
    }

    const filterIngredients = (searchedIngredients) => {
        if(inputValue===[]){
            return [...foundRecipes];
        }
        let newProducts = [];
        [...foundRecipes].forEach(recipe => { // por cada receta
            let recipeIngredients = [...recipe.ingredientes].map(ingredient => ingredient.ingrediente.toLowerCase()); // tomo sus ingredientes
            let targetedIngredients = [...searchedIngredients].map(ingredient => ingredient.ingrediente.toLowerCase()) // tomo los ingredientes seleccionados
            let addRecipe = true;
            targetedIngredients.forEach(ingredienteBuscado => {
                if(!recipeIngredients.includes(ingredienteBuscado)){ //si la receta no posee alguno de los ingredientes seleccionsados
                    addRecipe = false; // la filtro
                }
            });
            if(addRecipe){
                newProducts.push(recipe);
            }
        });
        return [...newProducts];
    }

    const handleFilterChange = (value) => {
        setFilter(value);
        if(value==="Ingredientes"){
            setInputValue([]);
            setProducts(foundRecipes);
        }
        else{
            setInputValue("");
            setProducts(foundRecipes);
        }
    }

    const filterCategories = () => {
        if(inputValue===[]){
            return [...foundRecipes];
        }
        let finalRecipes = []
        foundRecipes.forEach(recipe => {
            let applies = false;
            let recipesCategoriesToMatch = recipe.categorias.map(cat => cat.toLowerCase());
            recipesCategoriesToMatch.forEach(categ => {
                if(categ.includes(inputValue.toLowerCase())){
                    applies = true;
                }
            })
            if(applies){
                finalRecipes.push(recipe);
            }
        });
        return finalRecipes;
    }

    const handleInputChange = (value) => {
        setInputValue(value);
        let newProducts = [...foundRecipes];
        if(value!=="" && value!== []){
            switch(filter){
                case "Categoria":
                    newProducts = filterCategories(inputValue);
                    break;
                case "Dificultad":
                    newProducts = newProducts.filter(recipe => parseInt(recipe.dificultad) === parseInt(inputValue)); // el parseInt, hace que cualquier nota mayor/igual a 4 y menor a 5 pase el filtro
                    break;
                case "Ingredientes":
                    newProducts = filterIngredients(inputValue)
                    break;
                default:
                    alert("Could not apply filters");
                    break;
            }
        }
        setProducts([...newProducts]);
    }

    const CategoryFilterInput = () => {
        return (<span className="p-float-label">
            <InputText id="username" value={inputValue} onChange={(e) => handleInputChange(e.target.value)} />
        </span>);
    }

    const RatingFilterInput = () => {
        return (<span>
            <Rating value={inputValue} cancel={false} onChange={(e) => handleInputChange(e.value)}/>
        </span>);
    }

    const IngredientFilterInput = () => {
        return (<span>
            <MultiSelect value={inputValue} options={allIngredients} onChange={(e) => handleInputChange(e.value)} optionLabel="ingrediente" placeholder="Seleccione Ingredientes" display="chip" />
        </span>);
    }

    const showSelector = (filter) => {
        switch(filter){
            case "Categoria":
                return CategoryFilterInput();
            case "Dificultad":
                return RatingFilterInput();
            case "Ingredientes":
                return IngredientFilterInput();
            default:
                return (<div>No es posible aplicar filtros</div>);
        }
    }
        
    return (
        <div>
                <div className="grid" style={{alignItems: "center", justifyContent: (filter?"center":"flex-start") }}>
                    <div className="col-6">
                        <Dropdown placeholder={"Filtrar"} value={filter} options={filters} onChange={(e) => handleFilterChange(e.value)} optionLabel="label"/>
                    </div>
                    {filter!==""?
                        <div className="col-6">
                            {showSelector(filter)}
                        </div>
                    :<></>}
                </div>
        </div>
    )
}

export default RecipeList;