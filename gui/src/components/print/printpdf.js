import React from "react";
import html2canvas from 'html2canvas';
import Iframe from 'react-iframe';
import $ from 'jquery';
import { jsPDF } from 'jspdf';

export default class PrintPdf extends React.Component {
  constructor(props) {
      super(props);
      this.core = this.props.osjsCore;
      this.domElementId = this.props.idSelector;
      this.cssClass = this.props.cssClass;
      this.loader = this.core.make("oxzion/splash");
      this.state = {showImages : true, 
                    pageFormat : 'portrait',
                    selectedFrame : undefined,
                    includeImg : true,
                    selectedTab : "",
                    printMode: false
            };}
      removeClass(ele, remove) {
        var newClassName = "";
        var i;
        var classes = ele.className.split(" ");
        for(i = 0; i < classes.length; i++) {
            if(classes[i] !== remove) {
                newClassName += classes[i] + " ";
            }
        }
        ele.className = newClassName;
    }

    getOrigin(url) {
    var link = document.createElement("a");
    link.href = url;
        link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
        return link.protocol + link.hostname + link.port;
    }

    sameOrigin(url1, url2){
        return this.getOrigin(url1) == this.getOrigin(url2);
    }

    toggleShowImages(){
        this.state.showImages = !this.state.showImages;
        this.processPdf(null, this.state.showImages);
    }
    handleFormatSelection(selectedFormat){
        var object = document.getElementById(selectedFormat);
        object.checked = true;
        this.processPdf(selectedFormat);
    }

    getSelectedTab(){
        var nodeList = document.querySelectorAll('div.tools ul.nav-tabs li');
        var clazz;
        var tab;
        for(var i = 0; i < nodeList.length ; i++){
            clazz = nodeList[i].getAttribute('class');
            if(clazz.indexOf('dropdown') != -1 && clazz.indexOf('pull-right') != -1){
                break;
            }
            if(clazz.indexOf('active') != -1){
                var temp = clazz.split(' ');
                for(var j = 0; j < temp.length; j++){
                    if(temp[j].trim() != 'active'){
                        tab = temp[j].trim();
                        break;
                    }
                }
            }
        }

        return tab;
    }
    resetFrameSrc(){
        var frames = document.getElementsByTagName('iframe');
        for(var i = 0; i < frames.length; i++){
            frames[i].src = 'about:blank';
        }
    }

    getCanvasImage(canvas, iframeid){
        var dataURI = canvas.toDataURL("image/png");

        if(document.getElementById('img-' + iframeid))
            document.getElementById('img-' + iframeid).src = dataURI;
        
        dataURI = dataURI.split(',');
        byteString = atob(dataURI[1]),
        byteStringLength = byteString.length,
        arrayBuffer = new ArrayBuffer(byteStringLength),
        intArray = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteStringLength; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        blob = new Blob([intArray], {
            type: "image/png"
        });
        return window.URL.createObjectURL(blob);
    }

    processPdf(selectedFormat, showImages, fileType){
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            return;            
        }

        if(fileType == undefined){
            fileType = 'pdf';
        }
        var format = selectedFormat ? selectedFormat : this.state.pageFormat;
        // format = selectedFormat;
        var includeImg = showImages != null ? showImages : this.state.includeImg;
        var ele = document.getElementById(this.domElementId);
        var output;
        window.scrollTo(0,0);
        var iframe = document.getElementById('pdf-'+format+"-"+(includeImg ? 'img' : 'no-img'));
        if(this.state.selectedFrame){
            this.state.selectedFrame.className += "hide";
        }
        this.state.selectedFrame = iframe;
        var tab = this.getSelectedTab();
        if(tab != this.state.selectedTab){
            this.resetFrameSrc();
        }
        if(iframe.src && iframe.src != 'about:blank'){
            this.removeClass(iframe, 'hide');
            return;
        }
        this.state.selectedTab = tab;
        this.loader.show();
        if(iframe.className.indexOf('hide') == -1){
            iframe.className += "hide";
        }
        this.loader.destroy();
        var pageWidth = 900;
        var pageHeight = 1200;
        var pageWidthInPts = 595; //8.5" x 11" in pts (in*72)
        var pageHeightInPts = 841;
        if(format == 'landscape'){
            pageWidth = 1200;
            pageHeight = 900;
            pageWidthInPts = 841;
            pageHeightInPts = 595;
        }
        var clientHeight;
        var path = window.location.href;
        path = path.substring(path.indexOf("module/"), path.length);
        var len = path.match(/\//g).length;
        var proxy = "printpdf/proxy";
        for(var i =0; i < len; i++){
            proxy = "../" + proxy;
        }
        let that = this;
        html2canvas(ele, {  
            proxy : proxy,
            timeout : 0,
            onclone : (clonedDoc) => {
                var clonedEle = $(clonedDoc.getElementById(this.domElementId))[0]
                clonedEle.style.width = pageWidth +"px";
                var nodes = clonedEle.querySelectorAll(".slimScrollDiv");
                if(nodes){
                    for(var i = 0; i < nodes.length; i++){
                        nodes[i].style.overflowX="unset";
                        nodes[i].style.overflowY="unset";
                    }
                }
                nodes = clonedEle.querySelectorAll(".scroller");
                if(nodes){
                    for(var i = 0; i < nodes.length; i++){
                        nodes[i].style.overflowX="unset";
                        nodes[i].style.overflowY="unset";
                        nodes[i].style.height = "unset";
                    }
                }
                nodes = clonedEle.querySelectorAll("img");
                if(nodes){
                    var pageUrl = window.location.href;
                    for(var i = 0; i < nodes.length; i++){
                        if(!includeImg || !nodes[i].complete || nodes[i].naturalHeight == 0){
                            nodes[i].style.display="none";
                        }
                    }
                }

                var nodesToRecover = [];
                var nodesToRemove = [];

                nodes = clonedEle.querySelectorAll('svg');
                for (var i=0; i<nodes.length; i++) {
                    var node = nodes[i];
                    var parentNode = node.parentNode;
                    var svg = parentNode.innerHTML;

                    var canvas = document.createElement('canvas');

                    canvg(canvas, svg);

                    parentNode.insertBefore(canvas, node.nextSibling);
                    parentNode.removeChild(node);

                    
                }
                
                clientHeight = clonedEle.clientHeight;
            }}).then( canvas => { 
                switch(fileType){
                    case 'img':
                    output = that.getCanvasImage(canvas,iframe.id);
                    break;
                    case 'pdf':
                        //! MAKE YOUR PDF
                        var pdf = new jsPDF(format.substring(0, 1), 'pt', 'a4');
                        var elementHt = clientHeight;
                        for (var i = 0; i <= elementHt/pageHeight; i++) {
                            //! This is all just html2canvas stuff
                            var srcImg  = canvas;
                            var sX      = 0;
                            var sY      = pageHeight*i; // start 980 pixels down for every new page
                            var sWidth  = pageWidth;
                            var sHeight = (elementHt - pageHeight*i) > pageHeight ? pageHeight : (elementHt - pageHeight*i);
                            var dX      = 0;
                            var dY      = 0;
                            var dWidth  = pageWidth;
                            var dHeight = sHeight;

                            window.onePageCanvas = document.createElement("canvas");
                            onePageCanvas.setAttribute('width', pageWidth);
                            onePageCanvas.setAttribute('height', pageHeight);
                            var ctx = onePageCanvas.getContext('2d');
                            // details on this usage of this function: 
                            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

                            // document.body.appendChild(canvas);
                            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

                            var width         = onePageCanvas.width;
                            var height        = onePageCanvas.clientHeight;

                            //! If we're on anything other than the first page,
                            // add another page
                            if (i > 0) {
                                pdf.addPage(); 
                            }
                            //! now we declare that we're working on that page
                            pdf.setPage(i+1);
                            //! now we add content to that page!
                            pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62));

                        }
                        output = pdf.output('bloburi');
                        break;
                    }
                    that.loader.destroy();
                    that.removeClass(iframe, "hide");
                    iframe.src = output;
                });            
}

displayContent(){
    this.setState({printMode: true});
    window.setTimeout(() => {
    this.processPdf(null);
    },100);
}
render() {
    return (<>{ !this.state.printMode ? (
            <div className={this.cssClass} onClick={() => this.displayContent()}><i className="fa fa-print"/></div>
        ) : (
            <div style={{zIndex: '15000', width:'70%', height:'80'}}>
        <div className="portlet box portletcolor">
        <div className="portlet-title modal-header">
        <div className="actions">
        <button className="btn btn-icon-only btn-circle red" title="Close" data-dismiss="modal" aria-hidden="true"></button>
        </div>
        </div>

        <div id="print-controls" className="details_block col-md-12 ">
        <input type="radio" name="format" id="portrait" className="bg-radio" onClick={() => this.processPdf("portrait")} value="portrait" defaultChecked/>
        <label className="format-label" onClick={() => this.handleFormatSelection('portrait')}>Portrait</label>
        <input type="radio" name="format" id="landscape" className="bg-radio" onClick={() => this.processPdf("landscape")} value="landscape"/>
        <label className="format-label" onClick={() => this.handleFormatSelection('landscape')}>Landscape</label>
        <input type="checkbox" name="showImg" id="showImg" className="bg-check" onClick={() => this.processPdf(null, this.checked)} defaultChecked />
        <label className="format-label" onClick={() => this.toggleShowImages()}>Show Images</label>
        </div>
        <div className="portlet-body">
        <div id="loading-animation" className="blockUI blockMsg blockElement loadingdivcss hide">
        <div className="loading-message ">
        <div className="block-spinner-bar">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
        </div>
        </div>
        </div>
        {/* <div id="browser-no-support" className="hide">
        Your browser does not support this functionality! <br/> 
        Please use Google Chrome or Firefox.
        </div> */}
        <Iframe url ="" id="pdf-portrait-img" width="100%" height="400px" className="hide"/>
        <Iframe url ="" id="pdf-landscape-img" width="100%" height="400px" className="hide"/>
        <Iframe url ="" id="pdf-landscape-no-img" width="100%" height="400px" className="hide"/>
        </div>
        </div>
        </div>
        )}</>

        );
    }
}