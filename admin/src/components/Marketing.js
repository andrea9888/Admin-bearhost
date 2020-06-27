import React from 'react';
import MaterialTable from 'material-table';
import apiCall from '../services/apiCall';
import Button from '@material-ui/core/Button';
import AlertSnack from './Alert';
import '../styles/marketing.css';


export default class MarketingTable extends React.Component {


  state = {
    columns: [
      { title: 'Naslov paketa', field: 'title' },
      { title: 'Opis-slider', field: 'description1' },
      { title: 'Opis-kartice', field: 'description2' }
      
    ],
    data: [],
    dataApi: [],
    updateData:[]
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
        this.state.dataApi.forEach((elem)=>{
            Object.keys(elem).forEach((key,index)=>{
                Object.keys(oldData).forEach((key2,index2)=>{
                    if (elem["title"] === oldData["title"]){
                        id = elem["id"];
                    }
                });
            });
        });
        newUpdate["id"] = id;
        console.log(newUpdate)
        this.state.updateData.push(newUpdate);
        

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
            return(
                <AlertSnack></AlertSnack>
            )
          }, (error) => {
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
            </div>
          );
        }
        
    }
  