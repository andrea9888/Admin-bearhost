import React from 'react';
import MaterialTable from 'material-table';
import apiCall from '../services/apiCall';
import Button from '@material-ui/core/Button';
import '../styles/marketing.css';
import Alert from './Alert';


export default class MarketingTable extends React.Component {


  state = {
    columns: [
      { title: 'Naslov paketa', field: 'title' },
      { title: 'Opis-slider', field: 'description1' },
      { title: 'Opis-kartice', field: 'description2' }
      
    ],
    data: [],
    dataApi: [],
    updateData:[], 
    success: 0,
    req:0
  };
  async getData () {
    const marketing_response = await apiCall.get('/products/marketing');
    const marketing = marketing_response.data;
    const data = marketing.map(elem=>{
        return(
        {
            title: elem.title,
            description1: elem.description1,
            description2: elem.description2
        })
    })
    const dataApi = marketing.map(elem=>{
        return(
        {   
            
            title: elem.title,
            description1: elem.description1,
            description2: elem.description2,
            id:elem.id
            
        })
    })
    this.setState({data});
    this.setState({dataApi});
    
} 
    componentDidUpdate(){
        if (this.state.req===1){
            setTimeout(()=>{this.setState({req:0})}, 3000)
            
        }
        
    }
    showAlert = ()=>{
        return <Alert success={this.state.success}/>
    }

    
    updateData(newData, oldData){
        let newUpdate = {};
        let id;
        Object.keys(oldData).forEach((key,index)=>{
            Object.keys(newData).forEach((key2,index2)=>{
                
                if (key === key2){
                    
                    if (newData[key2] !== oldData[key]){
                        newUpdate[key2] = newData[key2];
                    }
                }
            })
        })
        
        this.state.dataApi.forEach(elem=>{
                console.log(elem)
                if (elem.title === newData.title){
                    id = elem.id;
                }
    
        })
        newUpdate["id"] = id;
        console.log(newUpdate)
        if (this.state.updateData.length >0){
            this.state.updateData.forEach((elem)=>{
                    if (elem["id"] === newUpdate["id"]){
                        console.log("yes")
                        
                        Object.keys(elem).forEach(key2=>{
                            if (Object.keys(newUpdate).includes(key2)){
                                elem[key2] = newUpdate[key2];
                            }
                            
                        })
                        Object.keys(newUpdate).forEach(key=>{
                            if (!Object.keys(elem).includes(key)){
                                elem[key] = newUpdate[key];
                            }
                        })
                            
                        
                    }
                    else{
                        this.state.updateData.push(newUpdate);
                        
                    }
                
            })
        }
        else{
            this.state.updateData.push(newUpdate);
            
        }
        
        

        

    }
  componentDidMount(){
      if(this.state.data.length === 0){
          this.getData();
      }
    }
    
    handleUpdateHome = ()=> {
        const update = this.state.updateData;
        console.log(update)
        apiCall.put("/admin/products/marketing", {"marketing": update})
        .then((response) => {
            console.log(response);
            let updateData = [];
            this.setState({updateData});
            this.setState({success:1});
            this.setState({req:1});
          }, (error) => {
            
            this.setState({success:0});
            this.setState({req:1});
            console.log(error);
          });
        
        
    }
    

    render(){
        return (
            <div>
                <MaterialTable
                title="HOME PAGE EDIT"
                columns={this.state.columns}
                data={this.state.data}
                editable={{
                   
                    onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                        resolve();
                        if (oldData) {
                            let dataApi = this.state.dataApi;
                            dataApi.forEach(elem=>{
                                    
                                    if (elem["title"] === oldData["title"]){
                                        
                                        elem["title"] = newData["title"];
                                    }
                            })
                            
                            this.setState({dataApi});
                            
                            console.log(this.state.dataApi)
                            this.updateData(newData, oldData);
                            this.setState((prevState) => {
                            const data = [...prevState.data];
                            data[data.indexOf(oldData)] = newData;
                            return { ...prevState, data };
                            });
                            
                        }
                        }, 600);
                    }),
                   
                }}
                />
                <Button variant="contained" color="primary" onClick={this.handleUpdateHome}>Sačuvaj izmjene</Button>
                {this.state.req === 1?this.showAlert():<div></div>}
                
            </div>
          );
        }
        
    }
  