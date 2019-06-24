import React from "react";

class Body extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div class="body">
            <div class="row">
                <div class="col-1" style={{ border:"1px solid red" }}>Menu</div>
                <div class="col-11" styoe={{ border:"1px solid green" }}>Content</div>
            </div>
        </div>
    );
  }
}
export default Body;

