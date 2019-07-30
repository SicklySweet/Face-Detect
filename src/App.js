import React, { Component } from 'react';
import SignOut from './Components/SignOut/SignOut.js'
import Logo from './Components/Logo/Logo.js'
import URLForm from './Components/URLForm/URLForm.js'
import Rank from './Components/Rank/Rank.js'
import Particles from 'react-particles-js';
import SignIn from './Components/SignIn/SignIn.js'
import Register from './Components/Register/Register.js'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 12,
      density: {
        enable: true,
        value_area: 100
      }
    }
  }
}

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signIn',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entires: 0,
      joined: ''  
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

loadUser = (data) => {
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entires: data.entries,
    joined: data.joined
    }})
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({ box });
}

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
      fetch('https://infinite-wildwood-23609.herokuapp.com/imageUrl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify ({
          input: this.state.input
        })
      })
        .then(response => response.json())
        .then(response => {
        if (response) {
          fetch('https://infinite-wildwood-23609.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify ({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log);
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signOut') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <SignOut isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} />
        { route === 'home' 
          ? <div> 
              <Logo />
              <Rank 
                name = {this.state.user.name}
                entries = {this.state.user.entries} 
                 />
              <URLForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit}
              />
            <FaceRecognition box = {box} imageUrl = {imageUrl}/>
            </div>
          : (
            route === 'signIn' 
            ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
            : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
            ) 
          }
      </div>
    );
  }
}

export default App;
