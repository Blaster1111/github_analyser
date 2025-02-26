import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gray-900">
                <Navbar />
                <main className="flex-grow">
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/analysis" element={<AnalysisPage />} />
                        </Routes>
                    </AnimatePresence>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;