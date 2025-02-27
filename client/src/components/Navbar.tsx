import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    
    return (
        <nav className="bg-gray-800 shadow-md border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                            </svg>
                            <span className="ml-2 font-semibold text-xl text-gray-100">Gitlyser</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    location.pathname === '/'
                                        ? 'border-purple-500 text-gray-100'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-400'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/analysis"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    location.pathname === '/analysis'
                                        ? 'border-purple-500 text-gray-100'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-400'
                                }`}
                            >
                                Analysis
                            </Link>
                        </div>
                    </div>
                    
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <Link
                            to="/analysis"
                            className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                        >
                            Get Started
                        </Link>
                    </div>
                    
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <motion.div 
                    className="sm:hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                                location.pathname === '/'
                                    ? 'bg-gray-700 border-purple-500 text-purple-300'
                                    : 'border-transparent text-gray-400 hover:bg-gray-700 hover:border-gray-400 hover:text-gray-200'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/analysis"
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                                location.pathname === '/analysis'
                                    ? 'bg-gray-700 border-purple-500 text-purple-300'
                                    : 'border-transparent text-gray-400 hover:bg-gray-700 hover:border-gray-400 hover:text-gray-200'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Analysis
                        </Link>
                    </div>
                    
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        <div className="flex items-center px-4">
                            <Link
                                to="/analysis"
                                className="block text-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </nav>
    );
};