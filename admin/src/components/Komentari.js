import React from 'react';
import MaterialTable from 'material-table';
import apiCall from '../services/apiCall';
import Button from '@material-ui/core/Button';
import Alert from './Alert';
import '../styles/marketing.css';


export default class KomentariTable extends React.Component {


  state = {
    columns: [
      { title: 'Ocjena', field: 'grade' },
      { title: 'Komentar', field: 'comment' },
      { title: 'Ime', field: 'name' },
      { title: 'Posao', field: 'job' },

      
    ],
    data: [],
    dataApi: [],
    updateData:[],
    success: 0,
    req: 0
  };
  async getData () {
    const response = await apiCall.get('/comments');
    const komentari = response.data;
    const data = komentari.map(elem=>{
        return(
        {
            grade: elem.grade,
            comment: elem.comment,
            name: elem.name,
            job: elem.job
        })
    })
    const dataApi = komentari.map(elem=>{
        return(
        {   
            
            id:elem.commentid,
            grade: elem.grade,
            comment: elem.comment,
            name: elem.name,
            job: elem.job
            
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
        this.state.dataApi.forEach(elem=>{
            console.log(elem)
            if (elem.comment === newData.comment){
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
    componentDidUpdate(){
        if (this.state.req===1){
            setTimeout(()=>{this.setState({req:0})}, 3000)
            
        }
        
    }
    showAlert = ()=>{
        return <Alert success={this.state.success}/>
    }

  componentDidMount(){
      if(this.state.data.length === 0){
          this.getData();
      }
    }
    
    handleUpdateHome = ()=> {
        const update = this.state.updateData;
        console.log(update)
        apiCall.put("/admin/comments", {"comments": update})
        .then((response) => {
            console.log(response);
            let updateData = [];
            this.setState({updateData})
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
                                    
                                    if (elem["comment"] === oldData["comment"]){
                                        
                                        elem["comment"] = newData["comment"];
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
  