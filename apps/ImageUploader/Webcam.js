import React, { Component } from "react";
import Camera,{IMAGE_TYPES} from "react-html5-camera-photo";
import "./Imageuploader.css";
class Webcam extends Component {
	enableWebcam = () => this.setState({ webcamEnabled: true });
	disableWebcam = () => this.setState({ webcamEnabled: false });

	constructor(props) {
		super(props);
		this.core = this.props.args;
		this.userprofile = this.core.make('oxzion/profile').get();
		this.state = {
			img: this.userprofile.key.icon,
			webcamEnabled: false,
			fields:{}
		};
		this.onTakePhoto = this.onTakePhoto.bind(this);
		this.handleSubmit=this.handleSubmit.bind(this);

	}

	onTakePhoto(dataUri) {
		this.setState({
			img: dataUri
		});
	}

	componentWillUnmount(){
		this.disableWebcam();
	}

	
	// addDefaultSrc(ev) {
	// 	ev.target.src = this.userprofile.key.icon
	// }

	handleSubmit(event) {
		event.preventDefault();
		var str=this.state.img;
		if(str.startsWith("data:image/")) {

			const formData = {};

			formData.file=this.state.img;
			this.state.fields.file=formData.file;
			Object.keys(this.state.fields).map(key => {
				formData[key] = this.state.fields[key];
			});

			console.log(formData);
			let helper = this.core.make("oxzion/restClient");

			let uploadresponse = helper.request(
				"v1",
				"/user/profile",
				formData,
				"post"
				);
			if (uploadresponse.status == "error") {
				alert(uploadresponse.message);
			}else{
				alert("Successfully Updated");
				
			}

		}     
	}

 // onError={this.addDefaultSrc}

	render() {
		return (
			<div className="divscroll">
			
			<form onSubmit={this.handleSubmit}>
			<div className="row webdiv">
			<div className="col s7">
			<img id="imgcrop" className="webimg" name="file" src={this.state.img} height="200" width="200"/>  
			
			<button className="waves-effect waves-light black btn websave" type="submit" onClick={this.disableWebcam}>
			Save
			</button>
			<button
				className="waves-effect waves-light btn black websave" type="button"
				id="goBack2" onClick={this.disableWebcam}
				>
				Back
				</button>
			
			</div>
			<div className="col s5">
			{this.state.webcamEnabled ? (
				
				<Camera className="camerac"
				onTakePhoto={dataUri => {
					this.onTakePhoto(dataUri);
				}}
				idealResolution = {{width: 400, height:480}}
				isFullscreen={true}
				imageType = {IMAGE_TYPES.PNG}

				
				/>
				
				) : (
				<div id="webcam1">
				<button type="button" onClick={this.enableWebcam} className="waves-effect waves-light black btn fa fa-camera"
				> Enable Webcam
				</button>
				</div>
				)}
</div></div>
				</form>

				</div>
				);
			}
		}

		export default Webcam;
