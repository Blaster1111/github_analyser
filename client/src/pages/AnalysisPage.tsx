import { RepoAnalysis } from '../components/RepoAnalysis';
import { FileAnalysis } from '../components/FileAnalysis';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const AnalysisPage = () => {
    const [activeTab, setActiveTab] = useState('repo');
    
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="p-6 max-w-4xl mx-auto my-8 space-y-6"
        >
            <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-3xl font-bold text-center text-gray-100 mb-8"
            >
                GitHub Repository Analyzer
            </motion.h1>
            
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                <div className="flex border-b border-gray-700">
                    <button
                        className={`flex-1 py-4 font-medium text-center transition-all ${
                            activeTab === 'repo' 
                                ? 'text-purple-400 border-b-2 border-purple-500' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('repo')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        Repository Analysis
                    </button>
                    <button
                        className={`flex-1 py-4 font-medium text-center transition-all ${
                            activeTab === 'file' 
                                ? 'text-purple-400 border-b-2 border-purple-500' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('file')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        File Analysis
                    </button>
                </div>
                
                <div className="p-4">
                    {activeTab === 'repo' ? <RepoAnalysis /> : <FileAnalysis />}
                </div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600 mt-8"
            >
                <h3 className="font-medium text-purple-300 mb-2">How it works</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-purple-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Enter a GitHub repository URL to analyze its structure and contents</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-purple-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Use file analysis to examine specific files within a repository</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="h-5 w-5 text-purple-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Get detailed insights and suggestions for your code</span>
                    </li>
                </ul>
            </motion.div>
        </motion.div>
    );
};