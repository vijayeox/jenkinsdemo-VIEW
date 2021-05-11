import React from "react";
import ReactDOM from "react-dom";
import { OX_Grid } from "../../GUIComponents";

// import products from "Templates/orders.json";

class GridDemo extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {};
    this.child = React.createRef();
  }

  customRender = dataItem => {
    return (
      <React.Fragment>
        <OX_Grid
          osjsCore={this.core}
          gridStyles={{ height: "inherit", border: "10px solid red" }}
          ref={this.child}
          data={"organization"}
          checkBoxSelection={this.onRow}
          onRowClick={this.onRow}
          filterable={true}
          reorderable={true}
          resizable={true}
          pageable={{ buttonCount: 3, pageSizes: [10, 20, 50], info: true }}
          sortable={true}
          columnConfig={[
            {
              title: "Organization",
              children: [
                {
                  title: "Name",
                  field: "name"
                },
                {
                  title: "Country",
                  field: "country"
                },
                {
                  title: "Country",
                  field: "prefrences.dateformat"
                }
              ]
            }
          ]}
        />
      </React.Fragment>
    );
  };

  onRow = e => {
    console.log(e);
  };

  render() {
    return (
      <OX_Grid
        // osjsCore={this.core}
        gridStyles={{ height: "inherit" }}
        ref={this.child}
        // data={products.slice(1, 50)}
        data={
          "https://demos.telerik.com/kendo-ui/service-v4/odata/Products?$count=true&"
        }
        checkBoxSelection={this.onRow}
        rowTemplate={this.customRender}
        onRowClick={this.onRow}
        filterable={true}
        reorderable={true}
        resizable={true}
        pageable={{ buttonCount: 3, pageSizes: [10, 20, 50], info: true }}
        sortable={true}
        columnConfig={[
          {
            title: "Order ID",
            field: "ProductID"
          },
          {
            title: "Product Name",
            field: "ProductName"
          },
          {
            title: "Order Details",
            children: [
              {
                title: "Quantity",
                field: "QuantityPerUnit"
              },
              {
                title: "Unit Price",
                field: "UnitPrice"
              }
            ]
          }
        ]}
      />
    );
  }
}

export default GridDemo;
