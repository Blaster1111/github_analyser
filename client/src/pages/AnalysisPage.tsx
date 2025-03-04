import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { RepoAnalysis } from '../components/RepoAnalysis';
import { FileAnalysis } from '../components/FileAnalysis';
import { ReadmeGenerator } from '@/components/ReadmeGenerator';

export const AnalysisPage = () => {
    const [activeTab, setActiveTab] = useState('repo');

    useEffect(() => {
        axios.post("https://gitlyser-scraper.onrender.com/scrape", {
            repo_url: "https://github.com/Blaster1111/ReactTsTemplate"
        }).catch(error => {
            console.warn("Failed to wake up scraper:", error.message);
        });
    }, []);

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
                        File Analysis
                    </button>
                    <button
                        className={`flex-1 py-4 font-medium text-center transition-all ${
                            activeTab === 'readme' 
                                ? 'text-purple-400 border-b-2 border-purple-500' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('readme')}
                    >
                        Readme Generator
                    </button>
                </div>

                <div className="p-4">
                    {activeTab === 'repo' ? <RepoAnalysis /> : activeTab === 'file' ? <FileAnalysis/> : <ReadmeGenerator/>}
                </div>
            </div>
        </motion.div>
    );
};
