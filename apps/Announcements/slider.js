import React from "react";
import SlidingPanel from "react-sliding-panel";

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.core = this.props.args;
    this.loader = this.core.make("oxzion/splash");
    this.state = {
      announcements: [],
      currentIndex: 0,
      translateValue: 0,
      indexCount: 0,
      isPanelOpen: false,
      loading: true,
      focusData: [],
    };
    this.refreshAnc = this.refreshAnc.bind(this);
    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    document
      .querySelector('div[data-id="annoucementsWindow"]')
      .addEventListener("updateAnnouncements", this.refreshAnc, false);
  }

  async getAnnouncements() {
    let helper = this.core.make("oxzion/restClient");
    let announ = await helper.request("v1", "/announcement", {}, "get");
    return announ;
  }

  refreshAnc() {
    this.setState({
      announcements: [],
      currentIndex: 0,
      translateValue: 0,
      indexCount: 0,
      isPanelOpen: false,
      loading: true,
      focusData: [],
    });
    this.getAnnouncements().then((response) => {
      let data = response.data;
      let baseUrl = this.core.config("wrapper.url");

      for (let i = 0; i < data.length; i++) {
        if (data[i].media != null) {
          data[i].media = baseUrl + "resource/" + data[i].media;
        }
      }
      this.setState({
        announcements: data,
        indexCount: data.length - 1,
      });
      this.setState({ loading: false });
      var that = this;
      if (data.length > 1) {
        clearInterval(this.autoScroll);
        this.autoScroll = setInterval(function () {
          !that.state.isPanelOpen ? that.goToNextSlide() : null;
        }, 10000);
      }
    });
  }

  componentDidMount() {
    this.refreshAnc();
  }

  goToPrevSlide() {
    if (this.state.currentIndex === 0) {
      return this.setState((prevState) => ({
        currentIndex: prevState.indexCount,
        translateValue:
          prevState.translateValue + -this.slideWidth() * prevState.indexCount,
      }));
    }
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex - 1,
      translateValue: prevState.translateValue + this.slideWidth(),
    }));
  }

  goToNextSlide() {
    if (this.state.currentIndex === this.state.announcements.length - 1) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0,
      });
    }
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1,
      translateValue: prevState.translateValue + -this.slideWidth(),
    }));
  }

  slideWidth() {
    if (document.querySelector(".slide")) {
      return document.querySelector(".slide").clientWidth;
    } else {
      return "";
    }
  }

  renderCard(data) {
    const isImage = data.media_type == "image";
    if (!data.fallback) {
      return (
        <div
          className="slide"
          style={{ margin: 0 }}
          key={Math.random()}
        >
          <div
            className="Announcement-visuals col s12"
            onWheel={(e) => {
              e.deltaY > 0 ? this.goToNextSlide() : this.goToPrevSlide();
            }}
          >
            {isImage ? (
              <Img data={data} />
            ) : (
              <Video autoplay muted data={data} />
            )}
          </div>
          <div className="Announcement-content col">
            {data.description ? (
              <button
                className="actionButton"
                style={{ margin: "3.8vh" }}
                onClick={() => {
                  this.setState({ isPanelOpen: true, focusData: data });
                }}
              >
                READ MORE
              </button>
            ) : null}
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="slide"
          style={{ margin: 0 }}
          key={Math.random()}
        >
          <div
            className="Announcement-visuals col s12"
            style={{ flexDirection: "column" }}
          >
            <div className="fallbackImage">
              <Img data={data} />
            </div>
          </div>
          <div className="Announcement-content col fallbackText">
            <h5 style={{ paddingTop: "15px" }}> {data.name} </h5>
            <p> {data.description} </p>
          </div>
        </div>
      );
    }
  }

  render() {
    if (this.state.loading == false) {
      this.loader.destroy();
      return (
        <div className="announcement-slider" ref={(ref) => (this.el = ref)}>
          <div
            className="slider-wrapper"
            style={{
              transform: `translateX(${this.state.translateValue}px)`,
              transition: "transform ease-out 0.45s",
            }}
          >
            {this.state.announcements.length >= 1
              ? this.state.announcements.map((announcement, i) =>
                  this.renderCard(announcement, true)
                )
              : null}
          </div>
          {this.state.announcements.length == 0 ? (
            this.renderCard({
              name: "No Announcement have been posted for you right now.",
              description: "Stay Tuned for updates!",
              media_type: "image",
              media: "https://svgshare.com/i/DqC.svg",
              uuid: "empty",
              fallback: true,
            })
          ) : this.state.announcements.length > 1 ? (
            <div
              className="arrowWrap"
              style={{ display: this.state.isPanelOpen ? "none" : "flex" }}
            >
              <LeftArrow goToPrevSlide={this.goToPrevSlide} />
              <RightArrow goToNextSlide={this.goToNextSlide} />
            </div>
          ) : null}
          <SlidingPanel
            type={"bottom"}
            isOpen={this.state.isPanelOpen}
            closeFunc={() => this.setState({ isPanelOpen: false })}
          >
            <div className="popup-content">
              <h6>{this.state.focusData.name}</h6>
              <p className="mainText">{this.state.focusData.description}</p>
              <div className="buttonWrap">
                {this.state.focusData.link ? (
                  <button
                    onClick={() =>
                      window.open(this.state.focusData.link, "_blank")
                    }
                    className="actionButton popupButtons"
                  >
                    VIST LINK
                  </button>
                ) : null}
                <button
                  onClick={() => {
                    this.setState({
                      isPanelOpen: false,
                    });
                  }}
                  className="actionButton popupButtons"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </SlidingPanel>
        </div>
      );
    }
    var renderLoader = document.querySelector(".announcement-slider");
    this.loader.show(renderLoader);
    return <div />;
  }
}

const Img = ({ data }) => {
  return (
    <img
      id="Announ-visual"
      src={data.media}
      alt="Announcement Banner"
      onClick={data.link ? () => window.open(data.link, "_blank") : null}
      style={data.link ? { cursor: "pointer" } : null}
    />
  );
};

const Video = ({ data }) => {
  return (
    <video controls="controls" id="video" preload="none" autoPlay={true} muted>
      <source id="mp4" src={data.media} type="video/mp4" />
      Video goes here
    </video>
  );
};

const LeftArrow = (props) => {
  return (
    <div className="backArrow arrow" onClick={props.goToPrevSlide}>
      <i className="fa fa-arrow-left fa-2x" aria-hidden="true" />
    </div>
  );
};

const RightArrow = (props) => {
  return (
    <div className="nextArrow arrow" onClick={props.goToNextSlide}>
      <i className="fa fa-arrow-right fa-2x" aria-hidden="true" />
    </div>
  );
};

export default Slider;
