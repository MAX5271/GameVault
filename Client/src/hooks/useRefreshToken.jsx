import { useContext } from "react"
import DataContext from "../context/DataContext"
import axios from "../api/axios";

const useRefreshToken = ()=>{
    const {setUser} = useContext(DataContext);

    const refresh = async () =>{
        
        try {
        const response = await axios.get('/api/v1/refresh',{
            withCredentials:true
        });

        setUser(prev =>{
            return {
                ...prev,
                username:response.data.username,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
            
        } catch (error) {
            console.log(error);
        }
    }
    return refresh;
}

export default useRefreshToken;