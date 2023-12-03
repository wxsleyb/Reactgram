import { api, requestConfig } from "../utils/config";

//pegar detalhes do usuario

const profile = async(data, token)=>{
    const config = requestConfig("GET", data, token)

    try {
        const res = await fetch(api + "/users/profile", config)
            .then((res)=>res.json())
            .catch((err) => err)
    } catch (error) {
        console.log(error)
    }
}

const userService = {
    profile,
}

export default userService;

