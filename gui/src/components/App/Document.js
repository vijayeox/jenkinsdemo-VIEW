import React from "react";

class Document extends React.Component {
    constructor(props) {
        super(props);
        this.config = this.props.config ;
        this.args = this.props.args;
        this.core = this.props.core;
        this.state = {
            content: this.props.content
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.content !== prevProps.content) {
            this.setState({ content: this.props.content });
        }
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
            );
        }
    }

export default Document;