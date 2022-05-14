import React, {useEffect, useState} from 'react';

import { getImagen } from "../../imagen/getImagenCloud"

import { AdvancedImage } from '@cloudinary/react'
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import './profile.css';
import profileData from './profile.json';
import RecipeList from '../busqueda/RecipeList';
import { Button } from 'primereact/button';

const Profile = () => {
    const [displayResponsive, setDisplayResponsive] = useState(false);
    const [position, setPosition] = useState('center');
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
                <Button label="Guardar" icon="pi pi-check" onClick={() => onHide(name)} autoFocus />
            </div>
        );
    }
    const dialogFuncMap = {
        'displayResponsive': setDisplayResponsive
    }

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    
    const [user, setUser] = useState(profileData);
    const image = getImagen(user.imageId).resize(thumbnail().width(250).height(250).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(150))
    useEffect(() => {
        window.scrollTo(0,0)
    }, []);
    return (
            <div className="grid profile-container">
                <div className="col-12 col-offset-0 gourmetic-card">
                    {user?
                        <div className="grid h-20rem flex flex-wrap flex-row">
                            <div className="col-4 flex flex-wrap align-items-center justify-content-center">
                                <div>
                                    <AdvancedImage cldImg={image} className="profile-avatar-image"/>
                                </div>
                            </div>
                            <div className="col-8 flex flex-wrap align-items-center">
                                <Button type="button" icon='pi pi-pencil' onClick={() => onClick('displayResponsive')}/>
                                <div className='grid flex flex-wrap align-items-center'>
                                        <div className="col-12 profile-name">
                                            {user.name}
                                        </div>
                                        <div className="col-12 profile-description">
                                            {user.description}
                                        </div>
                                    
                                </div>
                            </div>
                            <div className='align-items-center'>
                                    <Dialog header="Editar perfil" visible={displayResponsive} onHide={() => onHide('displayResponsive')} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} footer={renderFooter('displayResponsive')}>
                                            <div className="field">
                                                <label>Nombre</label>
                                                <InputText id="name" value={user.name} />
                                            </div>
                                            <div className="">
                                                <label>Nueva password</label>
                                                <Password value={value1} onChange={(e) => setValue1(e.target.value)} toggleMask />
                                            </div>
                                            <div className="field">
                                                <label>Confirmar password</label>
                                                <Password value={value2} onChange={(e) => setValue2(e.target.value)} toggleMask feedback={false}/>
                                            </div>
                                    </Dialog>
                            </div>
                        </div>: 
                        <div>
                            Loading Profile Page...
                        </div>
                    }
                </div>
                <div className="col-12 flex flex-wrap justify-content-center recipes-title gourmetic-card">
                    <h3>Mis Recetas</h3>
                </div>
                <RecipeList isProfile={true} />
            </div>
    );

}

export default Profile;