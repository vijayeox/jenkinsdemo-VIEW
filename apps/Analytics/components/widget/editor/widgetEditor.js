import React from "react";
import ReactDOM from "react-dom";
import App from "./App"

window.startWidgetEditor = function(editor) {
    ReactDOM.render(<App editor={editor}/>, document.getElementById("root"));
}

