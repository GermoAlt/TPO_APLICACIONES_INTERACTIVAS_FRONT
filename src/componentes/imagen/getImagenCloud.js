import {Cloudinary} from "@cloudinary/url-gen";

/*
COMO USAR ESTA CLASE:

Primero, importar la funcion:
    import { getImagen } from "./getImagenCloud"

Se puede obtener la imagen de la instancia cloud mediante el uso del siguiente elemento:
    <AdvancedImage cldImg={getImagen("recetas/:id-de-la-imagen")} />

Si es necesario aplicar alguna transformacion (tamaño, color, etc.) debe hacerse asi:
    const imagen = getImagen("recetas/:id-de-la-imagen")
    imagen.resize(fill().width(250).height(250));

    <AdvancedImage cldImg={imagen} />
 */

export function getImagen(nombre) {
    const cl = new Cloudinary({cloud: {cloudName: "remote-german"}, url: {secure: true}});
    return cl.image(nombre)
}