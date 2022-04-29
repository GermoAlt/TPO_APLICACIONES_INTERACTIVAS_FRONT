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

const RecipeList = ({user}) => {
    return (
        <>
            <DataViewDemo />
        </>
    )
}

const DataViewDemo = () => {
    let navigate = useNavigate()
    const [products, setProducts] = useState(recipes);
    const [layout, setLayout] = useState('grid');
    const sortOrder = 1;
    const sortField = "price";

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
                    <Filters products={products} setProducts={(value) => setProducts(value)}/>
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

const Filters = ({products,setProducts}) => {
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
        let recetas = [...recipes];
        recetas.forEach(receta => {
            let listaIngredientes = [...receta.ingredients];
            listaIngredientes.forEach(ingrediente => {
                if(ingredients === [] || ![...ingredients.map(ing => ing.name.toLowerCase())].includes(ingrediente)){
                    ingredients.push({"name":ingrediente,"code": ingrediente});
                }
            });
        })
        setAllIngredients([...ingredients]);
    }

    const filterIngredients = (searchedIngredients) => {
        if(inputValue===[]){
            return [...recipes];
        }
        console.log("Input");
        console.table(inputValue);
        let newProducts = [];
        recipes.forEach(recipe => {
            let recipeIngredients = [...recipe.ingredients].map(ingredient => ingredient.toLowerCase());
            console.log("Ingredientes de la receta:")
            console.table(recipeIngredients);
            let targetedIngredients = [...searchedIngredients].map(ingredient => ingredient.name.toLowerCase())
            console.log("Ingredientes buscados:")
            console.table(targetedIngredients)
            let addRecipe = true;
            targetedIngredients.forEach(ingredienteBuscado => {
                if(!recipeIngredients.includes(ingredienteBuscado)){
                    addRecipe = false;
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
        }
        else{
            setInputValue("");
        }
    }

    const handleInputChange = (value) => {
        setInputValue(value);
        let newProducts = [...recipes];
        if(value!=="" && value!== []){
            switch(filter){
                case "Categoria":
                    newProducts = newProducts.filter(recipe => recipe.category.toLowerCase().includes(inputValue.toLowerCase()));
                    break;
                case "Calificacion":
                    newProducts = newProducts.filter(recipe => parseInt(recipe.rating) === parseInt(inputValue));
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