import { useState } from 'react'
import reactLogo from './assets/react.svg'
import plutoLogo from './assets/logo.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header>
        <span>Welcome to the </span>
        <img
          src={plutoLogo}
          style={{ backgroundColor: "black" }}
          alt="pluto-logo"
        />
        <span> code challenge!</span>
      </header>
      <div>
        <section>
          <h2>Categories</h2>
        </section>
        <section>
          <h2>Channel</h2>
        </section>
      </div>
    </div>
  )
}

export default App
