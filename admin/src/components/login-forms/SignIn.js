import React from "react";
import { auth } from "../../auth_and_private/authService.js";


class SignIn extends React.Component {
    constructor(props) {
      super(props);
      this.props = props;
      //this.handleChange = this.handleChange.bind(this);
      this.state = {
        username: "",
        password: "",
        keep: false
      };
    }
    
    
    holder = (name, value) => {
      this.setState({ [name]:  value});
    }
  
    handlePass = (pass) => {
      if(pass.length >= 8){
          return true;
      }
      this.props.setNotify("Prekratka lozinka!");
      return false;
  
    }
  
    handleUsername = () => {
      if(this.state.username.length >= 3){
          return true;
      }
      this.props.setNotify("Prekratko korisničko ime!");
      return false;
    }
  
    async loginCall(data){
      var res = await auth.login(data);
      if(res === "error"){
        this.props.setNotify("Pogrešno korisničko ime ili lozinka!");
      }else if(res === "potvrda"){
        this.props.setNotify("Nalog nije potvrdjen!");
      }
      else{
        localStorage.setItem('bear-host-access', res.accesToken);      
        localStorage.setItem('bear-host-refresh', res.refreshToken);
        this.props.updateLogStatus(true);
        if(this.state.keep){
          localStorage.setItem('bear-host-logged', "true");      

        }
        this.props.history.push("/");
      }
  
    }
  
    handleSubmit = (e) => {
      e.preventDefault();
      var data = {
        'username': this.state.username,
        'password': this.state.password
      }
      if(this.handleUsername(data.username) && this.handlePass(data.password)){
        this.loginCall(data); 
      }
  
  
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit} className="sign-in">
                <h2>SIGN IN</h2>
                <input type="text" placeholder="Username" className="input-shape" name="username" onChange={e =>  this.holder(e.target.name, e.target.value)} value={this.state.username}/>
                <input type="password" placeholder="Password" className="input-shape" name="password" onChange={e =>  this.holder(e.target.name, e.target.value)} value={this.state.password}/>
                <div className="section-bellow">
                <div className="section-checkbox">
                <input type="checkbox" name="keep" id="keep" className="keep-checkbtn" onChange={e =>  this.holder(e.target.name, e.target.checked)} value={this.state.keep}/>
                <label htmlFor="keep" className="keep-label">Zapamti me</label>
                </div>
                <a href="" /*AwdaAAAAAAAAAAAA*/ className="fp-link">Zaboravili ste lozinku?</a>
                </div>
                <button type="submit" className="signin-btn" >Prijavi se</button>
            </form>




        );
    }

}

export default SignIn;