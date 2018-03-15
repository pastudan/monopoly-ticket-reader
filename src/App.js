import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import FontAwesome from 'react-fontawesome'

class App extends Component {
  onFileChange (e) {
    window.fetch('/upload', {
      method: 'POST',
      body: e.target.files[0]
    })
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <svg className="App-logo" x="0px" y="0px" viewBox="0 0 100 125" enableBackground="new 0 0 100 100">
            <path d="M77.625,59.25"/>
            <path d="M23.438,67.193"/>
            <path d="M23.23,67.897L25,58c1.875-4.875-0.766-31.641-1.109-32.984c-0.343-1.343,0-1.349,0-1.349S52.768,20.256,78.1,24.59  c0,0,0.4,0.02,0.135,1.129c0,0-4.166,30.572-1.45,32.272c0,0-8.159,1.134-21.722,7.509c0,0-13.742,6.822-15.688,9.5  c0,0-1.769,1.594,0.5,0.25c23.351-13.831,37.751-15.625,37.751-15.625s11.875-0.312,11.75,6.938c0,0-0.75,7.562-19.625,5.062  c0,0-7.235-2.438-17.25,1.188C42.487,76.439,50,73.75,50,73.75c-20.375,8.75-42,5.5-38.875-5.375c0,0-0.421-5.916,12.935-10.354  l-2.018,9.501c0,0-0.069,3.562,1.396-0.329"/>
          </svg>
          <h1 className="App-title">Monopoly Helper</h1>
        </header>
        <section className="App-upload" style={{marginTop: 30}}>
          <label className="App-button">
            <input type="file" onChange={this.onFileChange}/>
            <FontAwesome name='camera'/> Scan ticket
          </label>
          <div className="App-pieces">to see if you have any rare pieces</div>
        </section>
        <section className="App-section App-how">
          <h2>How does it work?</h2>
          <ul>
            <li>This app uses <strong>machine learning</strong> to identify rare game pieces and show you if your game piece is worth
              anything.
            </li>
            <li>The app is <strong>open source</strong>, and source code can be found on <a href="https://github.com/pastudan/monopoly-ticket-reader">github</a></li>
          </ul>
        </section>
      </div>
    )
  }
}

export default App
