import React, {useState} from 'react';

import { getImagen } from "../../imagen/getImagenCloud"

import { AdvancedImage } from '@cloudinary/react'
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";

import './profile.css';
import profileData from './profile.json';
import RecipeList from '../busqueda/RecipeList';

const Profile = () => {
    const [user, setUser] = useState(profileData);
    const image = getImagen(user.imageId).resize(thumbnail().width(250).height(250).gravity(focusOn(FocusOn.face()))).roundCorners(byRadius(150))
    window.scrollTo(0,0)
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
                                <div className='grid flex flex-wrap align-items-center'>
                                    <div className="col-12 profile-name">
                                        {user.name}
                                    </div>
                                    <div className="col-12 profile-description">
                                        {user.description}
                                    </div>
                                </div>
                            </div>
                        </div>: 
                        <div>
                            Loading Profile Page...
                        </div>
                    }
                </div>
                <div className="col-12 profile-recipe-list-container" >
                    <div className="col-12 flex flex-wrap justify-content-center recipes-title">
                        Mis Recetas
                    </div>
                        <RecipeList browsed={""} />
                </div>
            </div>
    );

}

export default Profile;