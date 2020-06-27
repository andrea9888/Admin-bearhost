import React from 'react';
import MaterialTable from 'material-table';

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
      { title:'Cijena 3 (na tri godine)', field: 'price3'}
      
    ],
    data: [
      { productname: 'Mehmet', description1: 'Baran', description2: '1987', description3: "", pricedescription: 'god', price1:80, price2:100, price3:10 },
      { productname: 'Mehmet', description1: 'Baran', description2: '1987', description3: null, pricedescription: 'god', price1:80, price2:100, price3:10 }
    ],
  };
  render(){
    return (
        <MaterialTable
          title="EDIT PRODUCTS"
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
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
      );
    }
    
  }

  