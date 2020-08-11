import apiCall from "../services/apiCall";
class AuthService {
    getAuthStatus() {
        const token = localStorage.getItem("bear-host-refresh");
        return !!token ? true : false;
    }

    async getAccessToken(token){
        const data = {
            "token" : token
        }
        await apiCall.post('/user/token', data).then(res => {
            res = res.data;
            this.setJwt(res.refreshToken);
            
        }, () => {
            window.location.href = "/login";
        });
    }

    setJwt(token) {
        apiCall.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    async login(dataSent) {
        var result;
        await apiCall.post('/user/login', dataSent).then(res => {
            if(res.status === 200){
                result = res.data;
                this.setJwt(res.refreshToken);
            }else if(res.status === 403){
                result = "potvrda";
            }else{
                result = "error";
            }
            

        }, () => {
            result = "error";
        });
        return result;
    }

    async signup(dataSent) {
        
        try {
            const x = await apiCall.post('/user/signup', dataSent)
            if(x.status === 200) return "uspjesno"
            return x.data.error; 
            
          } catch (error) {
            return error.response.data.error; 
          }
    }

    async logout(bool = false) {
        localStorage.removeItem("bear-host-access");    
        const keepLogged = localStorage.getItem("bear-host-logged");
        const data = {
            token: localStorage.getItem("bear-host-refresh")
        }
        if(bool){
            try {       
                await apiCall.post('/user/logout', data)
              }catch (error) {
                return error.response.data.error; 
              }
            localStorage.removeItem("bear-host-refresh");
            localStorage.removeItem("bear-host-logged");
            window.location.href = "/";
        }else if(keepLogged !== "true"){
            try {
                await apiCall.post('/user/logout', data)
              }catch (error) {
                return error.response.data.error; 
              }
            localStorage.removeItem("bear-host-refresh");
        }

    }
}
export const auth = new AuthService();