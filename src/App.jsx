import Convert from './components/convert/Convert';
import Dashboard from './components/Dashboard';
import CryptoDetail from './components/market/crypto/CryproDetail';
import MarketDashboard from './components/market/MarketDashboard';
import StockDetail from './components/market/stock/StockDetail';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ThemeContextProvider from './context/ThemeContextProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
      <Router>
        <ThemeContextProvider>
          <Navbar />
          <div className='flex'>
            <Sidebar />
            <div className='grow h-full lg:h-full bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'>
              <div className="p-4"> 
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/market" element={<MarketDashboard />} />
                  <Route path="/convert" element={<Convert />} />
                  <Route path="/crypto/:coinId" element={<CryptoDetail />} />
                  <Route path="/stocks/:symbol" element={<StockDetail />} />
                  <Route path="*" element={<div className="p-6 text-center">Page Not Found</div>} />
                </Routes>
              </div>
            </div>
          </div>
        </ThemeContextProvider>
      </Router>
    
  );
}

export default App;
