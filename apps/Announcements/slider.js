import React from "react";
import SlidingPanel from "react-sliding-panel";

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.state = {
      announcements: [],
      currentIndex: 0,
      translateValue: 0,
      indexCount: 0,
      isPaneOpen: false,
      focusData: []
    };

    this.getAnnouncements().then(response => {
      let data = response.data;
      let baseUrl = this.core.config("wrapper.url");

      for (let i = 0; i < data.length; i++) {
        if (data[i].media != null) {
          data[i].media = baseUrl + "resource/" + data[i].media;
        }
      }
      this.setState({
        announcements: data,
        indexCount: data.length - 1
      });
    });

    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
  }

  async getAnnouncements() {
    let helper = this.core.make("oxzion/restClient");
    let announ = await helper.request("v1", "/announcement/a", {}, "get");
    return announ;
  }

  goToPrevSlide() {
    if (this.state.currentIndex === 0) {
      return this.setState(prevState => ({
        currentIndex: prevState.indexCount,
        translateValue:
          prevState.translateValue + -this.slideWidth() * prevState.indexCount
      }));
    }

    this.setState(prevState => ({
      currentIndex: prevState.currentIndex - 1,
      translateValue: prevState.translateValue + this.slideWidth()
    }));
  }

  goToNextSlide() {
    // Exiting the method early if we are at the end of the images array.
    // We also want to reset currentIndex and translateValue, so we return
    // to the first image in the array.
    if (this.state.currentIndex === this.state.announcements.length - 1) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      });
    }
    // This will not run if we met the if condition above
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1,
      translateValue: prevState.translateValue + -this.slideWidth()
    }));
  }

  slideWidth() {
    return document.querySelector(".slide").clientWidth;
  }

  renderCard(data) {
    const isImage = data.media_type == "image";
    return (
      <div className="App row slide" style={{ margin: 0 }} key={data.uuid}>
        <div className="Announcement-visuals col s12">
          {isImage ? <Img data={data} /> : <Video data={data} />}
        </div>
        <div className="Announcement-content col">
          <h5 style={{ paddingTop: "10px" }}> {data.name} </h5>
          <p> {data.description.slice(0, 150) + "..."} </p>
          {data.description.length < 150 ? null : (
            <button
              className="readMore"
              onClick={() => {
                this.setState({ isPaneOpen: true, focusData: data });
              }}
            >
              READ MORE
            </button>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="announcement-slider" ref={ref => (this.el = ref)}>
        <div
          className="slider-wrapper"
          style={{
            transform: `translateX(${this.state.translateValue}px)`,
            transition: "transform ease-out 0.45s"
          }}
        >
          {this.state.announcements.map((announcement, i) =>
            this.renderCard(announcement)
          )}
        </div>

        {this.state.announcements.length == 0 ? (
          this.renderCard({
            name: "No Announcements available!",
            description: "Please use the Admin app to add a new Announcement.",
            media_type: "image",
            media: "https://svgshare.com/i/DqC.svg",
            uuid: "empty"
          })
        ) : (
          <div>
            <LeftArrow goToPrevSlide={this.goToPrevSlide} />

            <RightArrow goToNextSlide={this.goToNextSlide} />
          </div>
        )}

        <SlidingPanel
          type={"bottom"}
          isOpen={this.state.isPaneOpen}
          closeFunc={() => this.setState({ isPaneOpen: false })}
        >
          <center style={{ margin: "2%", colour: "white" }}>
            <h6
              style={{
                fontSize: "1.5rem",
                padding: "20px",
                maxWidth: "70%"
              }}
            >
              {this.state.focusData.name}
            </h6>
            <p className="mainText">{this.state.focusData.description}</p>
            <button
              onClick={() => {
                this.setState({
                  isPaneOpen: false
                });
              }}
              className="readMore"
              style={{ margin: "3%" }}
              src="https://img.icons8.com/flat_round/344/circled-left-2.png"
            >
              BACK
            </button>
          </center>
        </SlidingPanel>
      </div>
    );
  }
}

const Img = ({ data }) => {
  return <img id="Announ-visual" src={data.media} alt="Visuals go here" />;
};

const Video = ({ data }) => {
  return (
    <video controls="controls" id="video" preload="none" autoPlay={true}>
      <source id="mp4" src={data.media} type="video/mp4" />
      Video goes here
    </video>
  );
};

const LeftArrow = props => {
  return (
    <div className="backArrow arrow" onClick={props.goToPrevSlide}>
      <i className="fa fa-arrow-left fa-2x" aria-hidden="true" />
    </div>
  );
};

const RightArrow = props => {
  return (
    <div className="nextArrow arrow" onClick={props.goToNextSlide}>
      <i className="fa fa-arrow-right fa-2x" aria-hidden="true" />
    </div>
  );
};

export default Slider;
