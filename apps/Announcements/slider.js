import { React, ReactDOM } from "oxziongui";
import screenfull from "screenfull";
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
      focusData: []
    };
    this.refreshAnc = this.refreshAnc.bind(this);
    this.refreshTimer = this.refreshTimer.bind(this);
    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    document
      .querySelector('div[data-id="annoucementsWindow"]')
      .addEventListener("updateAnnouncements", this.refreshAnc, false);
    let parent = document.querySelectorAll(
      ".osjs-window[data-id=annoucementsWindow] div.osjs-window-header"
    )[0];
    if (parent.childNodes[3].getAttribute("data-action") == "minimize") {
      var clonedItem = (parent.childNodes[3]).cloneNode(true);
      clonedItem.className = "osjs-window-button dummyCloseButton";
      parent.appendChild(clonedItem);
    }
  }

  async getAnnouncements() {
    let helper = this.core.make("oxzion/restClient");
    let announ = await helper.request(
      "v1",
      "/announcement/a/ANNOUNCEMENT",
      {},
      "get"
    );
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
      focusData: []
    });
    this.getAnnouncements().then((response) => {
      let data = response.data;
      let baseUrl = this.core.config("wrapper.url");

      for (let i = 0; i < data.length; i++) {
        if (data[i].media != null) {
          data[i].media = baseUrl + "resource/" + data[i].media;
        }
      }
      this.setState(
        {
          announcements: data,
          indexCount: data.length - 1,
          loading: false
        },
        () => this.refreshTimer()
      );
      this.markAsRead();
    });
  }

  markAsRead() {
    const currentIndex = this.state.currentIndex;
    if (document.querySelector('div[data-id="annoucementsWindow"]').getAttribute('data-focused') == "true" && this.state.announcements.length && (!this.state.announcements[currentIndex]['view'] || this.state.announcements[currentIndex]['view'] == "0")) {
      let count = 0;
      this.state.announcements[currentIndex]['view'] = 1;
      this.state.announcements.map((announcement) => {
        if (!announcement.view || announcement.view == "0") {
          count++;
        }
      });

      this.core.emit('announcement/tray:modified', count);

      this.core.make("oxzion/restClient")
      .request(
        "v1",
        "/announcement/markasread",
        { "announcementId": this.state.announcements[this.state.currentIndex]['uuid'] },
        "post"
        );
    }
  }

  refreshTimer() {
    var that = this;
    if (this.state.announcements.length > 1) {
      clearInterval(this.autoScroll);
      this.autoScroll = setInterval(function () {
        !screenfull.isFullscreen && !that.state.isPanelOpen
          ? that.goToNextSlide()
          : null;
      }, 10000);
    }
  }

  componentDidMount() {
    this.refreshAnc();
  }

  goToPrevSlide() {
    if (this.state.currentIndex === 0) {
      return this.setState((prevState) => ({
        currentIndex: prevState.indexCount,
        translateValue:
          prevState.translateValue + -this.slideWidth() * prevState.indexCount
      }));
    }
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex - 1,
      translateValue: prevState.translateValue + this.slideWidth()
    }));
  }

  goToNextSlide() {
      this.markAsRead();
    if (this.state.currentIndex === this.state.announcements.length - 1) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      });
    }
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1,
      translateValue: prevState.translateValue + -this.slideWidth()
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
        <div className="slide" style={{ margin: 0 }} key={data.uuid}>
          <div
            className="Announcement-visuals col s12"
            onWheel={(e) => {
              if (!screenfull.isFullscreen) {
                e.deltaY > 0 ? this.goToNextSlide() : this.goToPrevSlide();
                this.refreshTimer();
              }
            }}
          >
            {isImage ? <Img data={data} /> : <Video data={data} />}
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
            <button
              className="actionButton"
              style={{ margin: "3.8vh" }}
              onClick={() => {
                let focusElement = document.getElementById(data.uuid);
                if (screenfull.isEnabled) {
                  screenfull.request(focusElement);
                }
              }}
            >
              FULL SCREEN
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="slide" style={{ margin: 0 }} key={data.uuid}>
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
              transition: "transform ease-out 0.45s"
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
              uuid: "abc-123-321",
              fallback: true
            })
          ) : this.state.announcements.length > 1 ? (
            <div
              className="arrowWrap"
              style={{ display: this.state.isPanelOpen ? "none" : "flex" }}
            >
              <LeftArrow
                goToPrevSlide={() => {
                  this.refreshTimer();
                  this.goToPrevSlide();
                }}
              />
              <RightArrow
                goToNextSlide={() => {
                  this.refreshTimer();
                  this.goToNextSlide();
                }}
              />
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
                    VISIT LINK
                  </button>
                ) : null}
                <button
                  onClick={() => {
                    this.setState({
                      isPanelOpen: false
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
    <abbr title={data.link && !screenfull.isFullscreen ? data.link : undefined}>
      <img
        id={data.uuid}
        src={data.media}
        alt="Announcement Banner"
        onClick={() => {
          data.link && !screenfull.isFullscreen
            ? window.open(data.link, "_blank")
            : null;
          screenfull.isFullscreen ? screenfull.toggle(event.target) : null;
        }}
        style={data.link ? { cursor: "pointer" } : null}
      />
    </abbr>
  );
};

const Video = ({ data }) => {
  return (
    <video
      controls="controls"
      className="AncVideo"
      id={data.uuid}
      preload="none"
      autoPlay={true}
      muted
      loop
    >
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
