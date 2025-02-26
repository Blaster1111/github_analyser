import { useState } from 'react';
import { analyzeRepo } from '../services/api';
import { Loader } from './Loader';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export const RepoAnalysis = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    
    const handleAnalyze = async () => {
        if (!repoUrl) {
            setError('Please enter a repository URL.');
            return;
        }
        
        setLoading(true);
        setError('');
        setResult(null);
        
        try {
            const response = await analyzeRepo(repoUrl);
            // Extract content from the response if it exists
            const content = response?.data?.data?.choices?.[0]?.message?.content;
            setResult(content);
        } catch (err) {
            setError('Failed to analyze repository. Please check the URL and try again.');
        }
        
        setLoading(false);
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 space-y-4 bg-white rounded-lg shadow-lg"
        >
            <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Enter GitHub Repo URL (e.g., https://github.com/username/repo)"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={repoUrl} 
                        onChange={(e) => setRepoUrl(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                </div>
                
                <motion.button 
                    onClick={handleAnalyze} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-lg w-full transition-all transform hover:scale-105 active:scale-95 shadow"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Analyze Repository
                </motion.button>
            </motion.div>
            
            {loading && <Loader />}
            
            {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
                >
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
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
                    <div className="bg-gray-50 rounded-lg p-4 shadow-inner border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-700">Analysis Result</h3>
                        </div>
                        <div className="whitespace-pre-wrap break-words text-sm text-gray-800">
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