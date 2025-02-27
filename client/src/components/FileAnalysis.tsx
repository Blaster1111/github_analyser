import { useState } from 'react';
import { analyzeFile } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { SnakeGameLoader } from './SnakeGameLoader';

export const FileAnalysis = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    
    const handleAnalyze = async () => {
        if (!repoUrl || !fileName) {
            setError('Please enter both repository URL and file name.');
            return;
        }
        
        setLoading(true);
        setError('');
        setResult(null);
        
        try {
            const response = await analyzeFile(repoUrl, fileName);
            const content = response?.data?.data?.choices?.[0]?.message?.content;

            setResult(content);
        } catch (err) {
            setError('Failed to analyze file. Please check the URL and try again.');
        }
        
        setLoading(false);
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 space-y-4 bg-gray-800 rounded-lg shadow-lg"
        >
            <AnimatePresence>
                {loading && <SnakeGameLoader />}
            </AnimatePresence>
        
            <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="GitHub Repo URL (e.g., https://github.com/username/repo)"
                        className="w-full p-3 pl-10 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-400"
                        value={repoUrl} 
                        onChange={(e) => setRepoUrl(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                </div>
                
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="File Name (e.g., src/App.js)"
                        className="w-full p-3 pl-10 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-400"
                        value={fileName} 
                        onChange={(e) => setFileName(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                </div>
                
                <motion.button 
                    onClick={handleAnalyze} 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium p-3 rounded-lg w-full transition-all transform hover:scale-105 active:scale-95 shadow"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Analyze File
                </motion.button>
            </motion.div>
            
            {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
                >
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    </div>
                </motion.div>
            )}
            
            {result && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                >
                    <div className="bg-gray-700 rounded-lg p-4 shadow-inner border border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-purple-300">Analysis Result</h3>
                        </div>
                        <div className="whitespace-pre-wrap break-words text-sm text-gray-200">
                            <ReactMarkdown>
                                {result}
                            </ReactMarkdown>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};