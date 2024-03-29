import React, {Component, componentDidMount} from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import './App.css';
   

// const particlesOptions = {
//   particles: {
//     number: {
//       value: 100,
//       density: {
//         enable: true,
//         value_area: 1000
//       }
//     }
//   }
// }
const initialState = {
  
    input: '', 
    imageUrl: '',
    box:{},
    route:'signin',
    isSignedIn: false,
    user: {
      id: '',
      name:'',
      email:'',
      entries:0,
      joined:''
    }
   
}
 class App extends Component { 
 constructor(){
   super();
   this.state = initialState
 }

 loadUser = (data) =>{
   this.setState({ user: {
      id: data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
   }
    })
 }

//  componentDidMount() {
//   fetch('http://localhost:3000/')
//   .then(response => response.json())
//   .then(console.log)
// }

  calculateFaceLocation = (data) => {
    console.log(data, "this is data")
   const clarifaiFace = data.outputs[0.].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputImage');
   const width = Number(image.width);
   const height = Number(image.height);
   console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }

  displayFaceBox = (box) =>{
    this.setState({box: box});
    console.log(box) 
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    console.log( this.input);
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch(' https://smart-brain2.onrender.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input:this.state.input
      })  
     })
     .then(response => response.json())
      .then(response => {
           if (response) {
             fetch('https://smart-brain2.onrender.com/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  id:this.state.user.id
                  
             })
            })
            .then(response => response.json())
            .then( count =>{
              console.log({count});
              
            this.setState(Object.assign(this.state.user, count))
            })
            .catch(err => console.log (err, 'this err'));
          }
           
          this.displayFaceBox(this.calculateFaceLocation(response))
         })
         .catch(err => console.log(err));
  }
  
  onRouteChange = (route) =>{
    if (route === 'signout'){
      this.setState(initialState)
    }
    else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState( {route: route});
  }

  render() {
    const {box, imageUrl, route, isSignedIn} = this.state
   return (
    <div className="App"> 
      <ParticlesBg type="circle" bg={true} />
     <Navigation isSignedIn={isSignedIn}onRouteChange = {this.onRouteChange}/>
        { route === 'home'
          ? <div>
          <Logo />
          <Rank
          name={this.state.user.name}
          entries={this.state.user.entries} />
          
          <ImageLinkForm
            onInputChange = {this.onInputChange}
            onButtonSubmit= {this.onButtonSubmit}/>
          
          <FaceRecognition box={box} imageUrl={imageUrl} />  
          </div>
          :(
               route === 'signin'
               ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  
          )
          
      }
   </div>
    );
  }
}

export default App;
