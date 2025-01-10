import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './header';
import InvestorPage from './investors';
import Banner from './banner';
import './App.css'
import WebsiteTranslator from './websitetranslater';
import FAQPopup from './FAQPopup';
const translate = () =>
{

}
function App() {
  
    return (
        <BrowserRouter>

            <>
                <Header />
                <div className="circle circle1"></div>
                <div className="circle circle2"></div>
                <div className="circle circle3"></div>
                <FAQPopup></FAQPopup>
                <Routes>
                    <Route path="/" element={<Banner />} />
                    <Route path="/investor" element={<InvestorPage />} />
                </Routes>

                
            </>
            <WebsiteTranslator></WebsiteTranslator>

        </BrowserRouter>
    );
}

export default App;