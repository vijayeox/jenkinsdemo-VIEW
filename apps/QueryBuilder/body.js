import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import {name as applicationName} from './metadata.json';
import DataSource from './dataSource';
import Query from './query';
import Visualization from './visualization';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
  }

  dataSourceClicked = e => {
    ReactDOM.render(
      <DataSource args={this.core}/>, 
      $('.Window_' + applicationName + ' #content')[0]
    );
  };

  queryClicked = e => {
    ReactDOM.render(
      <Query args={this.core}/>, 
      $('.Window_' + applicationName + ' #content')[0]
    );
  }

  visualizationClicked = e => {
    ReactDOM.render(
      <Visualization args={this.core}/>, 
      $('.Window_' + applicationName + ' #content')[0]
    );
  }

  render() {
    return(
        <div class="body full-height">
            <div class="container-fluid full-height no-padding">
                <div class="content" id="content">
                    <div>Content</div>
                </div>
                <div class="left-icon-bar nav-bar">
                    <ul class="nav nav-stacked">
                        <li>
                            <a href="#" onClick={this.dataSourceClicked}>
                                <img src="apps/QueryBuilder/datasource-icon-64-64.png"/>
                            </a>
                        </li>
                        <li>&nbsp;</li>
                        <li>
                            <a href="#" onClick={this.queryClicked}>
                                <img src="apps/QueryBuilder/query-icon-64-64.png"/>
                            </a>
                        </li>
                        <li>&nbsp;</li>
                        <li>
                            <a href="#" onClick={this.visualizationClicked}>
                                <img src="apps/QueryBuilder/data-visualization-icon-64-64.png"/>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
  }
}
export default Body;

