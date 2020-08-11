import React from "react";
import { withRouter } from "react-router-dom";
import SignIn from "./login_forms/SignIn.js";
import SignUp from "./login_forms/SignUp.js";
import {Notification} from '../components/Notifications.js'
import '../styles/Login.css';
import '../styles/Login-responsive.css';
import '../styles/SignUp.css';
import '../styles/SignUpResponsive.css';

class LoginClass extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      modal: false,
      btnClass: "sign-up-btn",
      notify: false,
      message: ""
    };
  }

  toggleComponent= () =>{
    this.setState({component: false})
    this.setState({btnClass: "hidden"})

  }

  componentWillUnmount(){
    this.props.updatePageStatus();
  }

  componentWillMount(){
    this.props.hideBRouter();
  }
//odje notifikacije
  componentDidUpdate(){
    if(this.state.notify){
      setTimeout(() => {this.setState({notify: false})},3000);
    }
  }

  setNotify = (message) => {
    this.setState({message});
    this.setState({notify: true});
  }


  showNotify = () =>{
    return(
      <div className="notifications">
        <Notification message={this.state.message} />
      </div>
    )
  }

  setModal = () => {
    this.setState({ modal: !this.state.modal})
  }

  render(){
    return (
      <div className="body-login">
      <div className="text">
      </div>
      <div className="form-container">
      <SignIn updateLogStatus={this.props.updateLogStatus} history={this.props.history} keepMeLogedUpdate={this.props.keepMeLogedUpdate} setNotify={this.setNotify}/>     
      </div>
      <div className={this.state.btnClass}>
        <p>NEMATE NALOG?</p>
        <button onClick={this.setModal}>REGISTRUJ SE</button>
      </div>
      {this.state.modal?<div className="mask" onClick={this.setModal}></div>:""}

      {this.state.modal?<SignUp setModal={this.setModal} setNotify={this.setNotify}/>:""}
    
      {this.state.notify?this.showNotify():""}  
      </div>
    );
  }
};


const Login = withRouter(LoginClass);
export default Login;
