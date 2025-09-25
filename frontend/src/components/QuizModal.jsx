import React, { useState } from 'react';

const LoaderIcon = (props) => (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" {...props}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

const quizQuestions = [
    { question: "What work environment pace suits you best?", options: [{ text: "Fast-paced & dynamic", tag: "fast-paced" }, { text: "Structured & well-planned", tag: "structured" }] },
    { question: "Which type of tasks do you find most engaging?", options: [{ text: "Analytical & data-driven", tag: "analytical" }, { text: "Creative & open-ended", tag: "creative" }] },
    { question: "How do you prefer to work?", options: [{ text: "Collaborating in a team", tag: "team-oriented" }, { text: "Independently, with ownership", tag: "independent" }] },
    { question: "What kind of company culture are you drawn to?", options: [{ text: "An agile startup", tag: "startup-culture" }, { text: "An established organization", tag: "corporate-culture" }] },
    { question: "What is your primary motivation for an internship?", options: [{ text: "Developing technical skills", tag: "skill-focused" }, { text: "Seeing the impact of my work", tag: "impact-driven" }] }
];

export default function QuizModal({ show, onClose }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(null));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnswerSelect = (optionTag) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionTag;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };
    
    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const email = localStorage.getItem('userEmail');
            const response = await fetch('http://127.0.0.1:5000/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ email, answers }),
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
    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all">
                <div className="p-8 space-y-6">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">{currentQuestion.question}</h2>
                    </div>
                    <div className="space-y-4">
                        {currentQuestion.options.map(option => (
                            <button key={option.tag} onClick={() => handleAnswerSelect(option.tag)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${answers[currentQuestionIndex] === option.tag ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'bg-gray-100 border-transparent hover:border-blue-400'}`}>
                                {option.text}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <button onClick={handleBack} disabled={currentQuestionIndex === 0} className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50">Back</button>
                        {error && <p className="text-xs text-red-600">{error}</p>}
                        {isLastQuestion ? (
                            <button onClick={handleSubmit} disabled={!answers[currentQuestionIndex] || isLoading} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                {isLoading ? <LoaderIcon /> : "Finish & See Results"}
                            </button>
                        ) : (
                            <button onClick={handleNext} disabled={!answers[currentQuestionIndex]} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">Next</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}