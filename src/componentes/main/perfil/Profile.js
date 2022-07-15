import React, {useEffect, useRef, useState} from 'react';

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
import RecipeList from '../busqueda/RecipeList';
import { Button } from 'primereact/button';
import useUser from "../../../hooks/useUser";
import {updateUser} from "../../../api/controller/apiController";
import {Toast} from "primereact/toast";
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const toast = useRef()
    const [displayResponsive, setDisplayResponsive] = useState(false);
    const [position, setPosition] = useState('center');
    const navigate = useNavigate()
    const {user, changeUser} = useUser()
    const [editName, setEditName] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [confirmEditPassword, setConfirmEditPassword] = useState('');
    let nuevaFoto = null

    const widget = window.cloudinary.createUploadWidget(
        {
            cloudName: "remote-german",
            uploadPreset: "gjr53ft0",
            buttonCaption:"Cargar imágenes",
            cropping: "true",
            croppingAspectRatio:"1"
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                nuevaFoto = result.info.public_id.split("/")[2]
            }
        });


    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const guardarEdicion = (name) => {
        if (editPassword === confirmEditPassword) {
            onHide(name)
            if (editName !== "") user.nombre = editName
            if (nuevaFoto) user.idFoto = nuevaFoto
            user.password = editPassword
            changeUser(user)
            updateUser(user).then((res) => {
                toast.current.show({
                    severity:"success",
                    summary:"¡Exito!",
                    detail:"Cambios realizados con exito",
                    life:3000
                })
            }).catch((err) => {
                toast.current.show({
                    severity:"error",
                    summary:"Error",
                    detail:err.data.message,
                    life:3000
                })
            })
        } else {
            toast.current.show({
                severity:"error",
                summary:"Error",
                detail:"Los valores de contraseña no coinciden",
                life:3000
            })
        }
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
                <Button label="Guardar" icon="pi pi-check" onClick={() => guardarEdicion(name)} autoFocus />
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
    const image = getImagen("receta/" + user.idFoto).resize(thumbnail().width(250).height(250)).roundCorners(byRadius(150))
    useEffect(() => {
        window.scrollTo(0,0)
    }, []);
    return (
            <div className="grid profile-container">
                <Toast ref={toast} />
                <div className="col-12 col-offset-0 gourmetic-card">
                    {user._id?
                        <div className="profile-container">
                            <div className="pfp-container">
                                <div>
                                    <AdvancedImage cldImg={image} className="profile-avatar-image"/>
                                </div>
                            </div>
                            <div className="personal-info-container">
                                <div className='grid flex flex-wrap align-items-center'>
                                        <div className="col-12 profile-name">
                                            {user.nombre}
                                        </div>
                                        <div className="col-12 profile-description">
                                            Mail: {user.email}
                                        </div>
                                        <div className="col-12 profile-description">
                                            Telefono: {user.telefono}
                                        </div>

                                </div>
                                <div>
                                    <Button label={"Editar mis datos"} type="button" icon='pi pi-pencil' onClick={() => onClick('displayResponsive')}/>
                                </div>
                            </div>
                            <Dialog header="Editar perfil" visible={displayResponsive}
                                    onHide={() => onHide('displayResponsive')}
                                    className={"dialog-editar"} resizable={false} position={"center"} draggable={false}
                                    dismissableMask={true}
                                    footer={renderFooter('displayResponsive')}>
                                    <div >
                                        <label>Nombre</label>
                                        <InputText id="name" value={editName} onChange={(e) => {setEditName(e.target.value)}}/>
                                    </div>
                                    <div className="">
                                        <label>Nueva contraseña</label>
                                        <Password value={editPassword} onChange={(e) => setEditPassword(e.target.value)} toggleMask />
                                    </div>
                                    <div className="">
                                        <label>Confirmar contraseña nueva</label>
                                        <Password value={confirmEditPassword} onChange={(e) => setConfirmEditPassword(e.target.value)} toggleMask feedback={false}/>
                                    </div>
                                <Button label={"Editar foto"} icon={"pi pi-pencil"} onClick={()=>{widget.open()}} />
                            </Dialog>
                        </div>:
                        navigate("/")
                    }
                </div>
                <div className="col-12 flex flex-wrap justify-content-center recipes-title gourmetic-card">
                    <h3>Mis Recetas</h3>
                </div>
                <div style={{flex:1}}>
                    <RecipeList isProfile={true} />
                </div>
            </div>
    );

}

export default Profile;