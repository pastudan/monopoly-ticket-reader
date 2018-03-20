import React, { Component } from 'react'
import './App.css'
import FontAwesome from 'react-fontawesome'
import ReconnectingWebSocket from 'reconnecting-websocket'
import moment from 'moment'

class App extends Component {
  state = {
    uploading: false,
    uploadPercent: 0,
    socketConnected: false,
    images: []
  }

  componentDidMount () {
    this.socket = new ReconnectingWebSocket(process.env.REACT_APP_SOCKET_URL)
    this.socket.addEventListener('open', () => {
      this.setState({socketConnected: true})
      // TODO for analytics
      // this.socket.send(JSON.stringify(['session-start', sessionCount]))
      this.socket.send('auth') // TODO send actual auth key if we have one from localstorage
    })
    this.socket.addEventListener('close', () => this.setState({socketConnected: false}))
    const eventMapping = {
      'auth': this.auth,
      'crop-update': this.cropUpdate,
      'resize-update': this.resizeUpdate,
      'ml-update': this.mlUpdate,
    }
    this.socket.addEventListener('message', event => {
      const [eventName, payload] = event.data.split('|')
      if (typeof eventMapping[eventName] !== 'function') {
        console.log('Error: Unknown client event emitted')
        return
      }

      eventMapping[eventName](payload)
    })

    window.setInterval(this.forceUpdate.bind(this), 15 * 1000) // force re-render every 15 seconds to update moment timestamps
  }

  auth = (authKey) => {
    // TODO save auth key to localstorage
    this.authKey = authKey
  }

  cropUpdate = (payload) => {
    const [uuid, numTickets] = payload.split(':')
    const images = this.state.images
    const index = images.map(img => img.uuid).indexOf(uuid)
    images[index].cropped = true
    images[index].numTickets = numTickets
    this.setState({images})
  }

  resizeUpdate = (uuid) => {
    const images = this.state.images
    const index = images.map(img => img.uuid).indexOf(uuid)
    images[index].resized = true
    this.setState({images})
  }

  mlUpdate = (payload) => {
    const [piece, label] = payload.split(':')
    // ticketIndex is numeric, while pieceIndex is alphabetical
    const [uuid, ticketIndex, pieceIndex] = piece.split('_')
    const images = this.state.images
    const imageIndex = images.map(img => img.uuid).indexOf(uuid)
    if (typeof images[imageIndex].tickets[ticketIndex] !== 'object'){
      images[imageIndex].tickets[ticketIndex] = {}
    }
    images[imageIndex].tickets[ticketIndex][pieceIndex] = label
    this.setState({images})
  }

  onFileChange = (e) => {
    if (!this.authKey) {
      alert('Error: websocket connection not established')
      return
    }

    // Unfortunately, window.fetch does not currently support progress events, so we'll use an XHR here.
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${process.env.REACT_APP_API_URL}/upload`, true)
    xhr.setRequestHeader('Authorization', `Bearer ${this.authKey}`)
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const images = this.state.images
        images.push({
          uuid: xhr.response,
          resized: false,
          cropped: false,
          tickets: [],
          barcode: null,
          numTickets: 0,
          time: new Date(),
        })
        this.setState(images)
      } else {
        alert('upload failed')
      }
      this.setState({uploading: false})
    })

    xhr.upload.addEventListener('progress', (e) => {
      const uploadPercent = e.loaded / e.total * 100
      this.setState({uploadPercent})
    })
    xhr.send(e.target.files[0])
    this.setState({uploading: true})
  }

  render () {
    //TODO save image list to localstorage and populate state next visit

    // Only render the most recently uploaded image.
    const image = this.state.images[this.state.images.length - 1]
    const tickets = []
    this.state.images.forEach(image => {
      for (let i = 0; i < image.numTickets; i++) {
        tickets.unshift(<div className="App-ticket" key={`${image.uuid}_${i}`}>
          <img className="App-ticket-image" src={`/ticket/${image.uuid}_${i}.jpg`} alt={`${image.uuid}_${i}`}/>
          <div className="App-ticket-meta App-ticket-meta-time">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z"/>
            </svg>
            {moment(image.time).fromNow()}
          </div>
          <div className="App-ticket-meta App-ticket-meta-label App-ticket-meta-label-a">{(image.tickets[i] && image.tickets[i].a) || '...'}</div>
          <div className="App-ticket-meta App-ticket-meta-label App-ticket-meta-label-b">{(image.tickets[i] && image.tickets[i].b) || '...'}</div>
          <div className="App-ticket-meta App-ticket-meta-label App-ticket-meta-label-c">{(image.tickets[i] && image.tickets[i].c) || '...'}</div>
          <div className="App-ticket-meta App-ticket-meta-label App-ticket-meta-label-d">{(image.tickets[i] && image.tickets[i].d) || '...'}</div>
          </div>)
      }
    })

    return (
      <div className="App">
        <header className="App-header">
          <svg className="App-logo" x="0px" y="0px" viewBox="0 0 100 125" enableBackground="new 0 0 100 100">
            <path d="M77.625,59.25"/>
            <path d="M23.438,67.193"/>
            <path d="M23.23,67.897L25,58c1.875-4.875-0.766-31.641-1.109-32.984c-0.343-1.343,0-1.349,0-1.349S52.768,20.256,78.1,24.59  c0,0,0.4,0.02,0.135,1.129c0,0-4.166,30.572-1.45,32.272c0,0-8.159,1.134-21.722,7.509c0,0-13.742,6.822-15.688,9.5  c0,0-1.769,1.594,0.5,0.25c23.351-13.831,37.751-15.625,37.751-15.625s11.875-0.312,11.75,6.938c0,0-0.75,7.562-19.625,5.062  c0,0-7.235-2.438-17.25,1.188C42.487,76.439,50,73.75,50,73.75c-20.375,8.75-42,5.5-38.875-5.375c0,0-0.421-5.916,12.935-10.354  l-2.018,9.501c0,0-0.069,3.562,1.396-0.329"/>
          </svg>
          <h1 className="App-title">Monopoly Scanner</h1>
        </header>

        <section className="App-upload" style={{marginTop: 30}}>
          <label className={`App-button ${this.state.uploading ? 'uploading' : ''}`}>
            {this.state.uploading ? <span className="App-upload-progress">
              <div className="App-upload-progress-bar" style={{width: `${this.state.uploadPercent}%`}}/>
              <span>uploading...</span>
            </span> : <div>
              <input type="file" onChange={this.onFileChange}/>
              <FontAwesome name='camera'/> Scan ticket
            </div>}
          </label>
          <div className="App-pieces">to see if you have any rare pieces</div>
        </section>

        {image ? <section className="App-section App-image-info">

          {image.resized ?
            <img className="App-image" src={image.cropped ? `/contour/${image.uuid}.jpg` : `/resized/${image.uuid}.jpg`} alt={image.uuid}/> :
            <div className="App-image">image</div>}
          {image.cropped ? `${image.numTickets} ticket${image.numTickets !== 1 ? 's' : ''} found. Missing tickets? Try scanning the missing ones alone` : 'Searching for tickets...'}
        </section> : null}

        {tickets.length ? <section className="App-section">
          <h2>Ticket History</h2>
          {tickets}
        </section> : null}

        <section className="App-section App-how">
          <h2>How does it work?</h2>
          <ul>
            <li>This app uses <strong>machine learning</strong> to identify rare game pieces and show you if your game
              piece is worth
              anything.
            </li>
            <li>
              The app is <strong>open source</strong>, and source code can be found
              on <a href="https://github.com/pastudan/monopoly-ticket-reader">github</a>
            </li>
          </ul>
        </section>
      </div>
    )
  }
}

export default App
