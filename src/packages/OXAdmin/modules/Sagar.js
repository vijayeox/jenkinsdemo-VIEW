import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';



class Sagar extends React.Component {

  constructor(props) {
    super(props);

    //  this.state.products = [];
    this.state = {};
    this.state.filterText = "";
    this.state.products = [
      {
        id: 1,
        contact: '9663876900',
        orgid: 'VA:0021',
        email: "s.shekhar27@gmail.com",
        orgname: 'vantage Agora'
      }, {
        id: 2,
        contact : '823456789dd0',
        orgid: 'VA:123',
        email : "avc@gmail.com",
        orgname: 'citrix'
      }, {
        id: 3,
        contact: '98744487564',
        orgid : 'VA:987',
        email: "qwe@hotmail.com",
        orgname : 'IBM'
      }, {
        id: 4,
        contact: '9087654321',
       orgid : 'VA:231',
        email: "ssaaw@asder.com",
        orgname: 'cisco'
      }, {
        id: 5,
        contact  : '98765432910',
        orgid: 'VA:332',
        email : "xcffd@gmail.co,",
        orgname: 'apple'
      }, {
        id: 6,
        contact : '7564098722',
        orgid : 'VA:0987',
        email : "ssdff@hgg.com",
        orgname: 'google'
      }
    ];

  }
  handleUserInput(filterText) {
    this.setState({filterText: filterText});
  };
  handleRowDel(product) {
    var index = this.state.products.indexOf(product);
    this.state.products.splice(index, 1);
    this.setState(this.state.products);
  };

  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var product = {
      id: id,
      orgname: "",
      orgid: "",
      contact: "",
      email: 0
    }
    this.state.products.push(product);
    this.setState(this.state.products);

  }

  handleProductTable(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
var products = this.state.products.slice();
  var newProducts = products.map(function(product) {

    for (var key in product) {
      if (key == item.name && product.id == item.id) {
        product[key] = item.value;

      }
    }
    return product;
  });
    this.setState({products:newProducts});
  //  console.log(this.state.products);
  };
  render() {

    return (
      <div>
        <div style={{display:'flex'}}>
        <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)} 
        style={{}}/>
        <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-left">Add</button>
        </div>
        <ProductTable onProductTableUpdate={this.handleProductTable.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} products={this.state.products} filterText={this.state.filterText}/>
      </div>
    );

  }

}
class SearchBar extends React.Component {
  handleChange() {
    this.props.onUserInput(this.refs.filterTextInput.value);
  }
  render() {
    return (
      <div>

        <input type="text" style={{height:'25px'}} placeholder="Search for Organisation..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)}/>

      </div>

    );
  }

}

class ProductTable extends React.Component {

  render() {
    var onProductTableUpdate = this.props.onProductTableUpdate;
    var rowDel = this.props.onRowDel;
    var filterText = this.props.filterText;
    var product = this.props.products.map(function(product) {
      if (product.orgname.indexOf(filterText) === -1) {
        return;
      }
      return (<ProductRow onProductTableUpdate={onProductTableUpdate} product={product} onDelEvent={rowDel.bind(this)} key={product.id}/>)
    });
    return (
      <div>


      
        <Table className="table table-bordered">
          <thead>
            <tr>
              <th>Organisation Name</th>
              <th>Organisation ID</th>
              <th>Email Address</th>
              <th>Contact</th>
              
            </tr>
          </thead>

          <tbody>
            {product}

          </tbody>

        </Table>
      </div>
    );

  }

}

class ProductRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.product);

  }
  render() {

    return (
      <tr className="eachRow">
        <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          "type": "orgname",
          value: this.props.product.orgname,
          id: this.props.product.id
        }}/>
        <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          type: "orgid",
          value: this.props.product.orgid,
          id: this.props.product.id,
          TextMode:"MultiLine"
        }}/>
        <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          type: "email",
          value: this.props.product.email,
          id: this.props.product.id
        }}/>
        <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          type: "contact",
          value: this.props.product.contact,
          id: this.props.product.id
        }}/>
        
        <td className="del-cell">
          <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn"/>
        </td>
      </tr>
    );

  }

}
class EditableCell extends React.Component {

  render() {
    return (
      <td>
        <input type='text' name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate}/>
      </td>
    );

  }

}
export default Sagar




























































