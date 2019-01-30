// Check out my free youtube video on how to build a thumbnail gallery in react
// https://www.youtube.com/watch?v=GZ4d3HEn9zg
import React, { Component } from 'react';


class Slider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      announcements : [
        {
          id: 0,
          img: 'img1.jpg',
          header: 'Header 1 goes here',
          content: 'Your content 1 will appear here'
        },
        {
          id: 1,
          img: 'img2.jpg',
          header: 'Header 2 goes here',
          content: 'Your content 2 will appear here'
        },
        {
          id: 2,
          img: 'img1.png',
          header: 'Header 3 goes here',
          content: 'Your content 3 will appear here'
        }
      ],
      currentIndex: 0,
      translateValue: 0
    }
  }

  goToPrevSlide(){
    if(this.state.currentIndex === 0)
      return;
    
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex - 1,
      translateValue: prevState.translateValue + this.slideWidth()
    }))
  }

  goToNextSlide() {
    // Exiting the method early if we are at the end of the images array.
    // We also want to reset currentIndex and translateValue, so we return
    // to the first image in the array.
    if(this.state.currentIndex === this.state.announcements.length - 1) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      })
    }
    
    // This will not run if we met the if condition above
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1,
      translateValue: prevState.translateValue + -(this.slideWidth())
    }));
  }

  slideWidth() {
     return document.querySelector('.slide').clientWidth
  }

  render() {
    return (
      <div className="announcement-slider">

        <div className="slider-wrapper"
          style={{
            transform: `translateX(${this.state.translateValue}px)`,
            transition: 'transform ease-out 0.45s'
          }}>
            {
              this.state.announcements.map((announcement, i) => (
                <Slide key={i} data={announcement} />
              ))
            }
        </div>

        <LeftArrow
         goToPrevSlide={this.goToPrevSlide}
        />

        <RightArrow
         goToNextSlide={this.goToNextSlide}
        />
      </div>
    );
  }
}


const Slide = ({ data }) => {
  /*const styles = {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 60%'
  }*/
  //return <div className="slide" style={styles}></div>
  //return <App />
  return (
    <div className="App row slide" style={{margin:0}}>
      <div className="Announcement-visuals col s6">
        <img id='Announ-visual' src={require('./'+data.img)} alt='Visuals go here'/>
      </div>
      <div className= "Announcement-content col s6">
        <h2> {data.header} </h2>
        <p> {data.content} </p>
      </div>
    </div>
  )
}


const LeftArrow = (props) => {
  return (
    <div className="backArrow arrow" onClick={props.goToPrevSlide}>
      <i className="fa fa-arrow-left fa-2x" aria-hidden="true"></i>
    </div>
  );
}


const RightArrow = (props) => {
  return (
    <div className="nextArrow arrow" onClick={props.goToNextSlide}>
      <i className="fa fa-arrow-right fa-2x" aria-hidden="true"></i>
    </div>
  );
}

export default Slider;