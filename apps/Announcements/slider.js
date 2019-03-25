// Check out my free youtube video on how to build a thumbnail gallery in react
// https://www.youtube.com/watch?v=GZ4d3HEn9zg
import React, { Component } from 'react';


class Slider extends React.Component {
  
  constructor(props) {
    super(props)
    this.core = this.props.args;
    //console.log(this.core);

    var data = [
     /*{
        media: null,
        mediatype: 'video',
        name: 'Announcement 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo, eros nec aliquam vestibulum, odio ante pretium lorem, id tristique quam nisi ut quam. Curabitur nec accumsan enim, non interdum diam. Aenean sed est et mi ornare imperdiet. Nulla ultrices convallis nisl, id fringilla libero pretium in. Aliquam ac ipsum varius, condimentum neque facilisis, rutrum mi. Cras vitae neque vel nisi suscipit vehicula. Suspendisse potenti. In ullamcorper imperdiet arcu vitae semper. Nam imperdiet sollicitudin turpis nec bibendum. Praesent quis placerat dui. Integer lobortis libero vitae massa mollis, vel varius arcu dignissim. Etiam vel commodo urna. Pellentesque vitae purus sit amet libero tempor faucibus. Nulla magna sapien, faucibus a eros non, tempor rhoncus velit. Etiam ultricies nisi lorem, a varius risus pharetra vel. Cras elementum lacinia purus eget dictum.'
      },
      {
        media: null,
        mediatype: 'image',
        name: 'Announcement 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo, eros nec aliquam vestibulum, odio ante pretium lorem, id tristique quam nisi ut quam. Curabitur nec accumsan enim, non interdum diam. Aenean sed est et mi ornare imperdiet. Nulla ultrices convallis nisl, id fringilla libero pretium in. Aliquam ac ipsum varius, condimentum neque facilisis, rutrum mi. Cras vitae neque vel nisi suscipit vehicula. Suspendisse potenti. In ullamcorper imperdiet arcu vitae semper. Nam imperdiet sollicitudin turpis nec bibendum. Praesent quis placerat dui. Integer lobortis libero vitae massa mollis, vel varius arcu dignissim. Etiam vel commodo urna. Pellentesque vitae purus sit amet libero tempor faucibus. Nulla magna sapien, faucibus a eros non, tempor rhoncus velit. Etiam ultricies nisi lorem, a varius risus pharetra vel. Cras elementum lacinia purus eget dictum.'
      },
      {
        media: null,
        mediatype: 'video',
        name: 'Announcement 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo, eros nec aliquam vestibulum, odio ante pretium lorem, id tristique quam nisi ut quam. Curabitur nec accumsan enim, non interdum diam. Aenean sed est et mi ornare imperdiet. Nulla ultrices convallis nisl, id fringilla libero pretium in. Aliquam ac ipsum varius, condimentum neque facilisis, rutrum mi. Cras vitae neque vel nisi suscipit vehicula. Suspendisse potenti. In ullamcorper imperdiet arcu vitae semper. Nam imperdiet sollicitudin turpis nec bibendum. Praesent quis placerat dui. Integer lobortis libero vitae massa mollis, vel varius arcu dignissim. Etiam vel commodo urna. Pellentesque vitae purus sit amet libero tempor faucibus. Nulla magna sapien, faucibus a eros non, tempor rhoncus velit. Etiam ultricies nisi lorem, a varius risus pharetra vel. Cras elementum lacinia purus eget dictum.'
      }*/

    ];
    
    this.state = {
      announcements : data,
      currentIndex: 0,
      translateValue: 0,
      indexCount : 0
    }

    this.getAnnouncements().then(response => {
      let data = response.data;
      let baseUrl = this.core.config('wrapper.url');
      
      for(let i=0; i<data.length;i++) {
        if(data[i].media != null) {
          data[i].media = baseUrl+'resource/'+data[i].media;  
        }
      }
      this.setState({
        announcements :data,
        indexCount : data.length - 1
      });
      
    })

    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
  }

  init() {
    console.log('init called');
  }

 
  async getAnnouncements() {
  
    let helper = this.core.make('oxzion/restClient');
    let announ = await helper.request('v1','/announcement', {}, 'get' );
    // console.log(announ);
    return announ;
  }

  goToPrevSlide(){
    if(this.state.currentIndex === 0) {
     return this.setState(prevState => ({
      currentIndex: prevState.indexCount,
      translateValue: prevState.translateValue + -(this.slideWidth())*prevState.indexCount
    }));
    }
    
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
      currentIndex: prevState.currentIndex+1,
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
 const isImage = (data.media_type == 'image');
  // console.log(isImage);
  return (
    <div className="App row slide" style={{margin:0}}>
      <div className="Announcement-visuals col s8">
        {isImage? (
            <Img data= {data} />
          ):(
            <Video data= {data}/>
        )}
      </div>
      <div className= "Announcement-content col s4">
        <h6> {data.name} </h6>
        <p> {data.description} </p>
      </div>
    </div>
  )
}

const Img = ( {data}) => {
  return (
    <img id='Announ-visual' src= {data.media} alt='Visuals go here'/>
  )
}

const Video = ({data}) => {
  return (
    <video controls="controls" id="video"> 
      <source src = {data.media} type='video/mp4'/>
      Video goes here
    </video>
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

