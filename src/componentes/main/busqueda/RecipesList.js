import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
//import { ProductService } from '../service/ProductService';
import { Rating } from 'primereact/rating';
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';

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
    const [sortOrder, setSortOrder] = useState(1);
    const [sortField, setSortField] = useState("price");

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
                <div className="col-6" style={{textAlign: 'left'}}>
                    <Filters setProducts={(value) => setProducts(value)}/>
                </div>
                <div className="col-6" style={{textAlign: 'right'}}>
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

const Filters = ({setProducts}) => {
    const filters =[
        {label: 'Categoria', value: 'Categoria'},
        {label: 'Calificacion', value: 'Calificacion'},
        {label: 'Ingredientes', value: 'Ingredientes'}
    ];
    const [filter,setFilter] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        handleInputChange(inputValue);
    },[inputValue]);

    const handleFilterChange = (value) => {
        console.log("Filter: " + value);
        setFilter(value);
    }

    // Refactor: segun el filtro que se selecciona, mostrar un input distinto por componente
        // Para Categoria: el input de texto
        // Para calificacion: las 5 estrellas modificables
        // Para ingredientes: Un selector multiple

    const CategoryFilterInput = ({}) => {
        return (<></>);
    }

    const RatingFilterInput = ({}) => {
        return (<></>);
    }

    const IngredientFilterInput = ({}) => {
        return (<></>);
    }
        
    const handleInputChange = (value) => {
        setInputValue(value);
        console.log("Input: " + inputValue)
        let newProducts = [...recipes];
        if(value!==""){
            switch(filter){
                case "Categoria":
                    newProducts = newProducts.filter(recipe => recipe.category.toString().includes(inputValue.toString()));
                    break;
                case "Calificacion":
                    newProducts = newProducts.filter(recipe => recipe.rating === parseFloat(inputValue));
                    break;
                case "Ingredientes":
                    //newProducts = recipes.filter(recipe => recipe.ingredients.includes(inputValue));
                    break;
                default:
                    alert("Could not apply filters");
                    break;
            }
        }
        setProducts([...newProducts]);
    }

    return (
        <>
            <div className="card">
                <h5>Filters</h5>
                <Dropdown value={filter} options={filters} onChange={(e) => handleFilterChange(e.value)} optionLabel="label"/>
                {filter!==""?
                    <span className="p-float-label">
                        <InputText id="username" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        <label htmlFor="username"></label>
                    </span>
                    :<></>
                }
            </div>
        </>
    )
}

/*
const RecipeOrder = ({setSortField}) => {
    const sortOptions = [
        {label: 'Price', value: 'price'},
        {label: 'Name', value: 'name'},
    ];
    const [sortKey, setSortKey] = useState(null);
    const handleChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        setSortKey(value);
        setSortField(value);
    }

    return(
        <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Sort By: " onChange={handleChange}/>
    );
}

const RecipeFilter = ({setProducts}) => {
    const sortOptions = [
        {label: 'Price', value: 'price'},
        {label: 'Name', value: 'name'},
    ];
    const [sortKey, setSortKey] = useState(null);
    const handleChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        console.log(value);
        setSortKey(value)
        let filteredProducts = [...recipes];
        switch(value){
            case 'name':
                filteredProducts = filteredProducts.filter(recipe => recipe.name.toLowerCase().includes("muy") );
                break;
            case 'price':
                filteredProducts = filteredProducts.filter(recipe => recipe.price > 1500);
                break;
            default:
                alert("No matching filter");
                break;
        }
        setProducts(filteredProducts);
    }

    return(
        <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Filter By: " onChange={handleChange}/>
    );
}
*/          

export default RecipeList;