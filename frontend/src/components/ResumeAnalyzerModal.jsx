import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// --- Icons ---
const UploadCloudIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>);
const LoaderIcon = (props) => (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const XIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

export default function ResumeAnalyzerModal({ show, onClose, onAnalysisComplete }) {
    const [resumeFile, setResumeFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        setResumeFile(acceptedFiles[0]);
        setAnalysisResult(null); // Reset previous results
    }, []);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }, multiple: false });

    const handleAnalyze = async () => {
        if (!resumeFile) return;
        setIsUploading(true);
        setError('');
        const uploadData = new FormData();
        uploadData.append('resume', resumeFile);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/resume/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setAnalysisResult(data);
            if (onAnalysisComplete) {
                onAnalysisComplete(data); 
            }
        } catch (err) { setError(err.message); } finally { setIsUploading(false); }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon /></button>
                <div className="p-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Resume Analyzer</h2>
                        <p className="text-sm text-gray-600 mt-1">Upload a new resume to extract and update your skills.</p>
                    </div>
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} {...getRootProps()}>
                        <input {...getInputProps()} />
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">{resumeFile ? `Selected: ${resumeFile.name}` : "Drag & drop, or click to select"}</p>
                    </div>

                    {analysisResult && (
                        <div className="bg-green-50 p-4 rounded-lg">
                             <h4 className="font-semibold text-green-800">Analysis Complete</h4>
                             <p className="text-sm text-green-700 mt-2">We extracted the following skills:</p>
                             <div className="flex flex-wrap gap-2 mt-2">
                                {analysisResult.skills.map(skill => <span key={skill} className="px-2 py-1 text-xs font-medium text-green-800 bg-green-200 rounded-full">{skill}</span>)}
                             </div>
                        </div>
                    )}

                    <div className="flex justify-end items-center">
                         {error && <p className="text-xs text-red-600 mr-4">{error}</p>}
                         <button onClick={handleAnalyze} disabled={!resumeFile || isUploading} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center">
                            {isUploading ? <><LoaderIcon className="mr-2"/>Analyzing...</> : 'Analyze Resume'}
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}