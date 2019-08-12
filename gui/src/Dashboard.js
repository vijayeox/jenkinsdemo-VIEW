import React from "react";
import osjs from "osjs";
let helper = osjs.make("oxzion/restClient");

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.args;
        this.state = {
            htmlData: this.props.htmlData?this.props.htmlData:null
        }
        this.loader = this.core.make("oxzion/splash");
    }

    componentDidUpdate(prevProps){
        if(this.props.htmlData){
            if(this.props.htmlData !== prevProps.htmlData){
                this.setState({
                    htmlData: this.props.htmlData
                })
            }
        }
    }

    componentDidMount(){
        if(this.props.uuid){
            this.loader.show();
            this.GetDashboardHtmlDataByUUID(this.props.uuid).then(response => {
                this.loader.destroy();
                if (response.status == "success") {
                    this.setState(
                      {
                        htmlData: response.data.content
                          ? response.data.content
                          : null
                      }
                    );
                  }
                  else{
                      this.setState({
                          htmlData:`<p>No Data</p>`
                      })
                  }
            })
        }
    }

    async GetDashboardHtmlDataByUUID(uuid) {
        let response = await helper.request("v1", "analytics/dashboard/"+uuid, {}, "get");
        return response;
    }

    render() {
        return (<div dangerouslySetInnerHTML={ { __html: this.state.htmlData } }></div>);
    }
}

export default Dashboard;