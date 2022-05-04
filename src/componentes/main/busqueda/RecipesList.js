import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
//import { ProductService } from '../service/ProductService';
import { Rating } from 'primereact/rating';
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';

import './recipes-list.css';

import recipes from './recipes.json';

const RecipeList = ({browsed}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [finalRecipes,setFinalRecipes] = useState([]);

    useEffect(async () => {
        setIsLoading(true);
        console.table(browsed)
        if(browsed !== ""){
            setFinalRecipes([])
            let filteredRecipes = await filterContent(browsed);
            setFinalRecipes(filteredRecipes);
        }
        else{
            setFinalRecipes([...recipes]);
        }
        setIsLoading(false);
        console.table(finalRecipes)
    },[browsed]);

    const recipeNotDuplicated = (recipeList,currentRecipe) => {
        let isDuplicated = true;
        recipeList.forEach(recipe => {
            if(recipe.id === currentRecipe.id){
                isDuplicated = false;
            }
        });
        return isDuplicated;
    }

    const filterContent = () => {
        return new Promise((resolve,reject) => {
            try{
                let selectedRecipes = [];
                recipes.forEach(recipe => {
                    console.log("Longitud: " + finalRecipes.length);
                    if(recipe.name.toLowerCase().includes(browsed.toLowerCase()) && recipeNotDuplicated(selectedRecipes,recipe)){
                        selectedRecipes.push(recipe)
                    }
                    if(recipe.description.toLowerCase().includes(browsed.toLowerCase()) && recipeNotDuplicated(selectedRecipes,recipe)){
                        selectedRecipes.push(recipe)
                    }
                    if(recipe.category.toLowerCase().includes(browsed.toLowerCase()) && recipeNotDuplicated(selectedRecipes,recipe)){
                        selectedRecipes.push(recipe)
                    }
                    recipe.ingredients.forEach(ingredient => {
                        if(ingredient.toLowerCase().includes(browsed.toLowerCase())){
                            if(recipeNotDuplicated(selectedRecipes,recipe)){
                                selectedRecipes.push(recipe);
                            }
                        }
                    })
                });
                resolve([...selectedRecipes]);
            }
            catch(err){
                alert("Something went wrong when searching for results: " + JSON.stringify(err));
                reject([...recipes]);
            }
        })
    }

    return (
        <>
            {isLoading?
                (<div className="col-12">
                    Cargando...
                </div>):
                (<div className="col-12" style={{width: '100%'}}>
                    {finalRecipes.length !== 0?
                        <DataViewDemo browsedRecipes={finalRecipes}/>:
                        <div>No se han encontrado recetas</div>
                    }
                </div>)
                }
        </>
    )
}

const DataViewDemo = ({browsedRecipes}) => {
    let navigate = useNavigate()
    const [foundRecipes, setFoundRecipes] = useState([...browsedRecipes])
    const [products, setProducts] = useState([...browsedRecipes]);
    const [layout, setLayout] = useState('grid');
    const sortOrder = 1;
    const sortField = "price";

    useState(() => {
        setProducts([...foundRecipes]);
    },[browsedRecipes])

    const traducirLayout = () => {
        return layout === 'grid' ? "Grilla" : "Lista";
    }

    const onSelectRecipe = (recipeId) => {
        navigate(`/receta/${recipeId}`)
    }

    const renderListItem = (data) => {
        return (
            <div className="col-12">
                <div className="product-list-item">
                    <img src={`images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                    <div className="product-list-detail">
                        <div className="product-name">{data.name}</div>
                        <div className="product-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>
                        <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.category}</span>
                    </div>
                    <div className="product-list-action">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Ver Receta" disabled={data.inventoryStatus === 'OUTOFSTOCK'}  onClick={()=>onSelectRecipe(134652)}></Button>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                </div>
            </div>
        );
    }

    const renderGridItem = (data) => {
        return (
            <div className="col-12 md:col-4">
                <div className="product-grid-item card">
                    <div className="product-grid-item-top">
                        <div>
                            <i className="pi pi-tag product-category-icon"></i>
                            <span className="product-category">{data.category}</span>
                        </div>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                    <div className="product-grid-item-content">
                    <img src={`images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                        <div className="product-name">{data.name}</div>
                        <div className="product-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>
                    </div>
                    <div className="product-grid-item-bottom">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Ver Receta" disabled={data.inventoryStatus === 'OUTOFSTOCK'} onClick={()=>onSelectRecipe(134652)}></Button>
                    </div>
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
            <div className="grid">
                <div className="col-7" style={{textAlign: 'left'}}>
                    <Filters products={products} setProducts={(value) => setProducts(value)} foundRecipes={foundRecipes} />
                </div>
                <div className="col-5" style={{textAlign: 'right'}}>
                    <h5>Tipo de vista: {traducirLayout()}</h5>
                    <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
            </div>
        );
    }

    const header = renderHeader();

    return (
        <div className="dataview-demo">
            <div className="card">
                <DataView value={products} layout={layout} header={header}
                        itemTemplate={itemTemplate} paginator rows={6}
                        sortOrder={sortOrder} sortField={sortField} />
            </div>
        </div>
    );
}

const Filters = ({products,setProducts,foundRecipes}) => {
    const filters =[
        {label: 'Categoria', value: 'Categoria'},
        {label: 'Calificacion', value: 'Calificacion'},
        {label: 'Ingredientes', value: 'Ingredientes'}
    ];
    const [filter,setFilter] = useState("");
    const [inputValue, setInputValue] = useState("");
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
            let listaIngredientes = [...receta.ingredients]; // tomo sus ingredientes
            listaIngredientes.forEach(ingrediente => {
                if(ingredients === [] || ![...ingredients.map(ing => ing.name.toLowerCase())].includes(ingrediente)){ // compruebo que no se repitan
                    ingredients.push({"name":ingrediente,"code": ingrediente}); // formato requerido por el selector
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
            let recipeIngredients = [...recipe.ingredients].map(ingredient => ingredient.toLowerCase()); // tomo sus ingredientes
            let targetedIngredients = [...searchedIngredients].map(ingredient => ingredient.name.toLowerCase()) // tomo los ingredientes seleccionados
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

    const handleInputChange = (value) => {
        setInputValue(value);
        let newProducts = [...foundRecipes];
        if(value!=="" && value!== []){
            switch(filter){
                case "Categoria":
                    newProducts = newProducts.filter(recipe => recipe.category.toLowerCase().includes(inputValue.toLowerCase()));
                    break;
                case "Calificacion":
                    newProducts = newProducts.filter(recipe => parseInt(recipe.rating) === parseInt(inputValue)); // el parseInt, hace que cualquier nota mayor/igual a 4 y menor a 5 pase el filtro
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
            <MultiSelect value={inputValue} options={allIngredients} onChange={(e) => handleInputChange(e.value)} optionLabel="name" placeholder="Seleccione Ingredientes" display="chip" />
        </span>);
    }

    const showSelector = (filter) => {
        switch(filter){
            case "Categoria":
                return CategoryFilterInput();
            case "Calificacion":
                return RatingFilterInput();
            case "Ingredientes":
                return IngredientFilterInput();
            default:
                return (<div>No es posible aplicar filtros</div>);
        }
    }
        
    return (
        <>
            <div className="card">
                <h5>Seleccione el filtro <span style={{color: 'rgba(0,0,0,0.3)'}}>(Elementos: {[...products].length})</span></h5>
                <div className="grid" style={{alignItems: "center", justifyContent: (filter?"center":"flex-start") }}>
                    <div className="col-6">
                        <Dropdown value={filter} options={filters} onChange={(e) => handleFilterChange(e.value)} optionLabel="label"/>
                    </div>
                    {filter!==""?
                        <div className="col-6">
                            {showSelector(filter)}
                        </div>
                    :<></>}
                </div>
            </div>
        </>
    )
}

export default RecipeList;