import React, { useState } from 'react';

// --- (Icons are the same as before) ---
const LoaderIcon = (props) => (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" {...props}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

// --- NEW QUIZ QUESTIONS DATA STRUCTURE ---
const quizQuestions = [
    { id: 'highest_qualification', type: 'single-choice-specify', question: 'Highest Completed Qualification?', options: ['12th / High School', 'ITI / Diploma', 'Graduate (BA / BSc / BCom)', 'Professional / Other'] },
    { id: 'work_experience', type: 'single-choice-specify', question: 'Work Experience or Formal Training?', options: ['Yes — paid job / apprenticeship', 'Yes — short course / certificate', 'No experience'] },
    { id: 'internet_access', type: 'single-choice', question: 'Smartphone & Internet Access at Home?', options: ['Yes — smartphone + regular internet', 'Smartphone but weak/occasional internet', 'No smartphone / no reliable internet'] },
    { id: 'languages', type: 'multi-choice', question: 'Languages You Can Work In (Choose up to 2)', options: ['Hindi', 'English', 'Marathi', 'Other'] },
    { id: 'internship_mode', type: 'single-choice', question: 'Internship Mode Preference?', options: ['In-office', 'Hybrid', 'Fully remote', 'No preference'] },
    { id: 'commitment', type: 'single-choice', question: 'Can you commit full-time for 12 months?', options: ['Yes — I can commit', 'Yes, but I need travel/lodging support', 'No — I cannot commit'] },
    { id: 'preferred_industries', type: 'multi-choice', question: 'Preferred Field / Industry (Choose up to 2)', options: ['IT / Computers', 'Business / Accounts / Finance', 'Sales / Retail', 'Agriculture / Agri-tech', 'NGO / Social impact', 'Repair / Technician', 'Other'] },
    { id: 'preferred_tasks', type: 'multi-choice', question: 'Preferred Tasks (Choose up to 2)', options: ['Computer / data entry', 'Hands-on practical', 'Creative (content, design)', 'Customer support', 'Organising / record-keeping', 'I’m open / not sure'] },
    { id: 'stipend_requirement', type: 'single-choice', question: 'Stipend Requirement?', options: ['Yes — stipend is necessary', 'Prefer stipend but can consider otherwise', 'No — I can do without stipend'] },
    { id: 'stay_away', type: 'single-choice', question: 'Willingness to Stay Away from Home?', options: ['Yes — comfortable staying away', 'Yes, but only if lodging provided', 'No — cannot stay away'] },
    { id: 'relocation', type: 'single-choice', question: 'Willingness to Relocate?', options: ['Yes — anywhere in country', 'Yes — within my state only', 'No — must be local'] },
    { id: 'special_support', type: 'single-choice', question: 'Need Special Support or Accommodations?', options: ['Yes — need flexible hours', 'Yes — disability access or help', 'No special support needed'] },
    { id: 'document_readiness', type: 'single-choice', question: 'Aadhaar / Document Readiness & Consent?', options: ['I have documents ready & consent to e-KYC', 'I do not have documents ready yet'] },
    { id: 'contact_consent', type: 'single-choice', question: 'Can we contact you for assistance?', options: ['Yes — I can receive SMS/IVR', 'No'] },
];

export default function QuizModal({ show, onClose }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnswerSelect = (id, value) => {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const currentAnswer = answers[id];
        
        if (currentQuestion.type === 'multi-choice') {
            const newAnswerSet = new Set(currentAnswer || []);
            if (newAnswerSet.has(value)) {
                newAnswerSet.delete(value);
            } else if(newAnswerSet.size < 2) {
                newAnswerSet.add(value);
            }
            setAnswers(prev => ({ ...prev, [id]: Array.from(newAnswerSet) }));
        } else {
            setAnswers(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleTextChange = (id, value) => {
        setAnswers(prev => ({ ...prev, [`${id}_details`]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const email = localStorage.getItem('userEmail');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...answers, email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save results.");
            onClose(true); // Pass true to indicate successful submission
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!show) return null;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id];
    const isAnswered = Array.isArray(currentAnswer) ? currentAnswer.length > 0 : !!currentAnswer;
    
    // --- CHANGE: More specific condition for showing the textbox ---
    const shouldShowSpecifyText = (question, option) => {
        if (question.type !== 'single-choice-specify' || currentAnswer !== option) {
            return false;
        }
        // Only show for options that contain "Other" or specific keywords
        const keywords = ['Other', 'apprenticeship', 'certificate'];
        return keywords.some(keyword => option.includes(keyword));
    };


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                <div className="p-8 space-y-6">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">Step {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">{currentQuestion.question}</h2>
                    </div>
                    <div className="space-y-3">
                        {currentQuestion.options.map(option => (
                            <div key={option}>
                                <button onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${ (Array.isArray(currentAnswer) && currentAnswer.includes(option)) || currentAnswer === option ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'bg-gray-100 border-transparent hover:border-blue-400'}`}>
                                    {option}
                                </button>
                                {shouldShowSpecifyText(currentQuestion, option) && (
                                    <input type="text" placeholder="Please specify..." onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)} className="w-full mt-2 p-2 border border-gray-300 rounded-md" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <button onClick={() => setCurrentQuestionIndex(prev => prev - 1)} disabled={currentQuestionIndex === 0} className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50">Back</button>
                        {error && <p className="text-xs text-red-600">{error}</p>}
                        {currentQuestionIndex < quizQuestions.length - 1 ? (
                            <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={!isAnswered} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">Next</button>
                        ) : (
                            <button onClick={handleSubmit} disabled={!isAnswered || isLoading} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                {isLoading ? <LoaderIcon /> : "Complete Profile"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}