import { api, requestConfig } from "../utils/config";

//publicar a foto do usuario

const publishPhoto = async(data,token) =>{

    const config = requestConfig("POST", data, token, true)

    try {
        const res = await fetch(api + "/photos", config)
            .then((res) => res.json())
            .catch((err)=> err)

            return res
    } catch (error) {
        console.log(error)
    }
}


// pegar as fotos do usuario

    // Get user photos
    const getUserPhotos = async (id, token) => {
        const config = requestConfig("GET", null, token)
        
        try {
            const res = await fetch(api + "/photos/user/" + id, config)
                .then((res) => res.json())
                .catch((err) => err)
     
                return res
        } catch (error) {
            console.log(error)
        }
     
    }


//deletar uma foto

const deletePhoto = async(id, token) =>{

    const config = requestConfig("DELETE", null, token)


    try {
        const res = await fetch(api + "/photos/" + id, config)
            .then((res) => res.json())
            .catch((err) => err)
            return res
    } catch (error) {
        console.log(error)
    }
}

// editar a foto

const updatePhoto = async(data, id, token) =>{
    
    const config = requestConfig("PUT", data, token)

    try {
        const res = await fetch(api + "/photos/"+ id, config)
            .then((res) => res.json())
            .catch((err) => err)

            return res
    } catch (error) {
        console.log(error)
    }
}

//pegar a foto pelo id
const getPhoto = async(id, token)=>{
    const config = requestConfig("GET", null, token)

    try {
        const res = await fetch(api + "/photos/" + id, config)
            .then((res)=> res.json())
            .catch((err) => err)
            return res
    } catch (error) {
        console.log(error)
    }
}

// curtir a foto

const like = async(id,token) =>{
    const config = requestConfig("PUT", null, token)

    try {
        const res= await fetch(api + "/photos/like/" + id, config)
            .then((res) => res.json())
            .catch((err) => err)
            return res
    } catch (error) {
        console.log(error)
    }
}

const photoService = {
    publishPhoto,
    getUserPhotos,
    deletePhoto,
    updatePhoto,
    getPhoto,
    like
}

export default photoService;