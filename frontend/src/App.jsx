import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './header'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
            <Header></Header>
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            
    </>
  )
}


export default App
