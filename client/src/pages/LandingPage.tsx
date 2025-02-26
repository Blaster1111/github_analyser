import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LandingPage = () => {
    const features = [
        {
            title: "Repository Analysis",
            description: "Get insights into your repo structure, code quality, and patterns",
            icon: (
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
            )
        },
        {
            title: "File Analysis",
            description: "Deep dive into specific files for detailed code review",
            icon: (
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
            )
        },
        {
            title: "Smart Recommendations",
            description: "Get AI-powered suggestions to improve your code",
            icon: (
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
            )
        }
    ];
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 py-16">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 inline-block"
                    >
                        <div className="p-3 bg-gray-700 rounded-full inline-block">
                            <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                            </svg>
                        </div>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-5xl font-bold text-gray-100 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Repo Analyzer
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl text-gray-300 mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Analyze GitHub repositories and files with advanced AI insights
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Link to="/analysis">
                            <motion.button 
                                className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Started
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
                
                <motion.div 
                    className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="p-3 bg-gray-700 rounded-full inline-block mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-100 mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
                
                <motion.div 
                    className="mt-24 bg-gray-800 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                >
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-3/5 md:pr-8">
                            <h2 className="text-3xl font-bold text-gray-100 mb-4">Ready to analyze your code?</h2>
                            <p className="text-gray-400 mb-6">
                                Get started today and unlock insights about your repositories and files with our powerful analysis tools.
                            </p>
                            <Link to="/analysis">
                                <motion.button 
                                    className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow hover:bg-purple-700 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Analyzing
                                </motion.button>
                            </Link>
                        </div>
                        <div className="md:w-2/5 mt-6 md:mt-0">
                            <div className="p-1 bg-gray-700 rounded-lg">
                                <svg className="w-full h-auto" viewBox="0 0 200 160" fill="none">
                                    <rect width="200" height="160" rx="8" fill="#2D3748"/>
                                    <rect x="20" y="20" width="160" height="20" rx="4" fill="#4A5568"/>
                                    <rect x="20" y="50" width="160" height="20" rx="4" fill="#4A5568"/>
                                    <rect x="20" y="80" width="100" height="20" rx="4" fill="#4A5568"/>
                                    <rect x="20" y="110" width="160" height="30" rx="4" fill="#9F7AEA"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};