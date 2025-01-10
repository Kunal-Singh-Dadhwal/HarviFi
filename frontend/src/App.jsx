import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './header'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
            <Header></Header>
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            {/* <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/popup" element={<Popup />} />
      </Routes>
    </BrowserRouter> */}
    </>
  )
}


export default App
