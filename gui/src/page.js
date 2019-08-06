import React from "react";
import FormEngine from "./FormEngine";
import ReactDOM from "react-dom";
import Sourcing from "./sourcing.js";
import Loader from "./Loader";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.core = this.props.core;
        this.appId = this.props.app;
        this.state = {
            pageContent: [],
            pageId: this.props.pageId
        }
        this.loadPage(this.props.pageId);
    }
    loadPage(pageId){
        this.getPageContent(pageId).then(response => {
            this.setState({ pageContent: this.renderContent(response.data) });
        }).catch((error) => {  
                console.log('There seems to be an error: ' + error);  
                this.setState({ pageContent: this.renderContent([]) });
        });
    }

    async getPageContent(pageId) {
        // call to api using wrapper
        let helper = this.core.make('oxzion/restClient');
        let pageContent = await helper.request('v1','/app/'+this.appId+'/page/' + pageId, {}, 'get' );
        return pageContent;
    }
    componentDidUpdate(prevProps) {
        if (this.props.pageId !== prevProps.pageId) {
            this.setState({ pageContent: [] });
            this.setState({ pageId: this.props.pageId });
            this.loadPage(this.props.pageId);
        }
    }
    
    renderContent(data) {
        var content = [];
        for (var i = 0; i < data.length; i++) {
            switch(data[i].type) {
              case 'Form':
                content.push(<FormEngine content={data[i].content}  config={this.menu} core={this.config}/>);
                break;
              default:
                content.push(<Sourcing content={data[i].content} config={this.menu} core={this.config}/>);
                break;
            }
        }
        if(content.length > 0){
            return content;
        } else {
            content.push("<h2>No Content Available</h2>");
        }
        return;
    }
      
    render() {
        if(this.state.pageContent && this.state.pageContent.length > 0 ){
            return <div id="root_{this.appId}_{this.pageId}">
            {this.state.pageContent}
            </div>
        }
        return (<Loader />);
    }
}

export default Page;