import React from 'react';
import MaterialTable from 'material-table';
import apiCall from '../services/apiCall';
import Button from '@material-ui/core/Button';
export default class ProizvodiTable extends React.Component {
  state={
    columns: [
      { title: 'Naziv proizvoda', field: 'productname' },
      { title: 'Opis 1', field: 'description1' },
      { title: 'Opis 2', field: 'description2'},
      { title: 'Opis 3', field: 'description3'},
      { title:'Opis cijene (mjesec/godina)', field:'pricedescription'},
      { title: 'Cijena 1 (na mjesec/godinu)', field: 'price1'},
      { title:'Cijena 2 (na dvije godine)', field: 'price2'},
      { title:'Cijena 3 (na tri godine)', field: 'price3'},
      { title:'Ime paketa', field:'packetname'}
      
    ],
    data: [],
    dataApi: [],
    updateData:[],
    addData:[]
  };
  async getPackets(){
    const response = await apiCall.get('/products/packets');
    const packets = response.data;
    console.log(packets)
    return packets;
  }
  async getData () {
    const marketing_response = await apiCall.get('/products');
    const marketing = marketing_response.data;
    const packets = await this.getPackets();
    
    let data = marketing.map(elem=>{
        return(
        {
            productname: elem.productname,
            description1: elem.description1,
            description2: elem.description2,
            description3: elem.description3,
            pricedescription: elem.pricedescription,
            price1: elem.price1,
            price2: elem.price2,
            price3: elem.price3,
            packetname: elem.packetid


        })
    })
    console.log(packets)
    data.forEach(elem=>{
      packets.forEach(elem2=>{
        if (elem.packetid === elem2.packetname){
          elem2.packetname = elem.packetname;
        }
      })
    })

    const dataApi = marketing.map(elem=>{
        return(
        {   
          id:elem.id,
          productname: elem.productname,
          description1: elem.description1,
          description2: elem.description2,
          description3: elem.description3,
          pricedescription: elem.pricedescription,
          price1: elem.price1,
          price2: elem.price2,
          price3: elem.price3,
          packetname: elem.packetid,
          
            
        })
    })
    dataApi.forEach(elem=>{
      packets.forEach(elem2=>{
        if (elem.packetid === elem2.packetname){
          elem2.packetname = elem.packetname;
          elem2.packetid = elem.packetid;
        }
      })
    })
    this.setState({data});
    this.setState({dataApi});
    
} 
    componentDidMount(){
      if(this.state.data.length === 0){
          this.getData();
      }
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
                if (elem.productname === newData.productname){
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
    addData = (newData) =>{
      console.log(newData)
      newData.forEach(elem=>{
        this.state.apiCall.forEach(elem2=>{
          
            if (newData.packetname === elem2.packetname){
                newData.packetid = elem2.packetid;
            }
         
        })
      })
      this.state.addData.push(newData);
      console.log(this.state.addData)
    }
  handleProducts = ()=> {
    const update = this.state.updateData;
    console.log("final", update)
    apiCall.put("/admin/products", {"products": update})
    .then((response) => {
        console.log(response);
          let updateData = [];
          this.setState({updateData})
      }, (error) => {
        console.log(error);
      });
    const add = this.state.addData;
    console.log(add);
    apiCall.post("/admin/products", {"products": add})
    .then((response) => {
      console.log(response);
        let addData = [];
        this.setState({addData})
    }, (error) => {
      console.log(error);
    });
    
}
  render(){
    return (
      <div>
        <MaterialTable
          title="EDIT PRODUCTS"
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  this.addData(newData);
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    let dataApi = this.state.dataApi;
                            dataApi.forEach(elem=>{
                                    
                                    if (elem["productname"] === oldData["productname"]){
                                        
                                        elem["productname"] = newData["productname"];
                                    }
                            })
                            
                            this.setState({dataApi});
                            
                            console.log(this.state.dataApi)
                            this.updateData(newData, oldData);
                    this.setState((prevState) => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      console.log(newData);
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  this.setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
          }}
        />
        <Button variant="contained" color="primary" onClick={this.handleProducts}>Sačuvaj izmjene</Button>
      </div>
      );
    }
    
  }

  