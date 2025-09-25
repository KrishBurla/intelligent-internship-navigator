import React, { useState, useEffect } from 'react';

// --- Icons ---
const MapPinIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> );
const DollarSignIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> );
const ChevronDownIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9" /></svg> );
const LightbulbIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg> );
const CheckCircleIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> );
const XCircleIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg> );
const LoaderIcon = (props) => ( <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );

export default function DashboardView({ internships, isLoading, error, quizCompleted, onTakeQuiz }) {
    const [selectedInternship, setSelectedInternship] = useState(null);

    useEffect(() => {
        if (internships.length > 0 && !selectedInternship) {
            setSelectedInternship(internships[0]);
        }
    }, [internships, selectedInternship]);

    if (isLoading) return <div className="flex justify-center items-center h-full"><LoaderIcon /></div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    if (internships.length === 0) return <div className="p-8 text-center text-gray-600">No internships available at the moment.</div>;

    return (
        <div className="max-w-full mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-600">Here are your AI-powered internship recommendations.</p>

            <div className={`mt-6 ${quizCompleted ? 'bg-green-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white p-6 rounded-xl flex items-center justify-between transition-colors duration-500`}>
                <div>
                    <h3 className="font-bold text-xl">{quizCompleted ? "Thank You!" : "Discover Your Internship DNA!"}</h3>
                    <p className={quizCompleted ? 'text-green-100' : 'text-blue-100 mt-1'}>
                        {quizCompleted ? "Your recommendations will now be even more accurate." : "Take our quick quiz to improve cultural fit."}
                    </p>
                </div>
                {!quizCompleted && 
                    <button onClick={onTakeQuiz} className="bg-white text-blue-600 font-bold py-2 px-5 rounded-lg hover:bg-blue-50 transition-transform transform hover:scale-105">
                        Take the Quiz
                    </button>
                }
            </div>

            <div className="mt-8 grid grid-cols-12 gap-8" style={{ height: 'calc(100vh - 280px)' }}>
                <div className="col-span-12 lg:col-span-5 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">For You ({internships.length})</h2>
                        <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">Sort By <ChevronDownIcon className="w-4 h-4 ml-1" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {internships.map(internship => (
                            <InternshipCard key={internship.id} internship={internship} onSelect={setSelectedInternship} isSelected={selectedInternship?.id === internship.id} />
                        ))}
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-7 h-full">
                    <InternshipDetailView internship={selectedInternship} />
                </div>
            </div>
        </div>
    );
}

const InternshipCard = ({ internship, onSelect, isSelected }) => {
    const scoreColor = internship.matchScore > 85 ? 'bg-green-100 text-green-800' : internship.matchScore > 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
    return (
        <div onClick={() => onSelect(internship)} className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${isSelected ? 'bg-white border-blue-500 shadow-lg' : 'bg-gray-50 border-transparent hover:bg-white hover:border-blue-400'}`}>
            <div className="flex items-center space-x-4">
                <img src={internship.logo} alt={`${internship.company} logo`} className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">{internship.title}</h4>
                        <span className={`px-2.5 py-1 text-sm font-bold rounded-full ${scoreColor}`}>{internship.matchScore}%</span>
                    </div>
                    <p className="text-sm text-gray-600">{internship.company}</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1"/> {internship.location}</div>
                <div className="flex items-center"><DollarSignIcon className="w-4 h-4 mr-1"/> {internship.stipend}</div>
            </div>
        </div>
    );
};

const InternshipDetailView = ({ internship }) => {
    const [detailTab, setDetailTab] = useState('fit');
    if (!internship) return <div className="h-full flex items-center justify-center bg-gray-50 rounded-2xl"><p className="text-gray-500">Select an internship to see details</p></div>;

    const FitAnalysis = () => (
        <div className="space-y-6">
            <div><h4 className="font-semibold text-gray-800 flex items-center"><CheckCircleIcon className="h-5 w-5 mr-2 text-green-500"/>Your Matching Skills</h4><div className="mt-3 flex flex-wrap gap-2">{internship.yourSkills.map(skill => (<span key={skill} className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">{skill}</span>))}</div></div>
            <div><h4 className="font-semibold text-gray-800 flex items-center"><XCircleIcon className="h-5 w-5 mr-2 text-red-500"/>Skill Gaps Identified</h4><div className="mt-3 flex flex-wrap gap-2">{internship.missingSkills.map(skill => (<span key={skill} className="px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">{skill}</span>))}</div></div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg"><div className="flex"><div className="flex-shrink-0"><LightbulbIcon className="h-6 w-6 text-blue-600" /></div><div className="ml-3"><p className="text-sm text-blue-700"><span className="font-bold">Recommendation:</span> Focus on learning <span className="font-semibold">{internship.missingSkills.join(' & ')}</span> to become a top candidate. <a href="#" className="ml-2 font-semibold underline">Find Courses &rarr;</a></p></div></div></div>
            <div><h4 className="font-semibold text-gray-800">Cultural Fit Analysis</h4><p className="text-sm text-gray-600 mt-2">This role is tagged as <span className="font-semibold">{internship.cultureTags.join(', ')}</span>.</p></div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-full flex flex-col">
            <div className="p-6 border-b border-gray-200"><div className="flex items-center space-x-4"><img src={internship.logo} alt={`${internship.company} logo`} className="w-16 h-16 rounded-lg" /><div><h2 className="text-2xl font-bold text-gray-900">{internship.title}</h2><p className="text-md text-gray-600">{internship.company}</p></div></div><div className="mt-6 flex justify-between items-center"><button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Apply Now</button><div className="text-right"><p className="text-sm text-gray-500">Match Score</p><p className="text-3xl font-bold text-green-500">{internship.matchScore}%</p></div></div></div>
            <div className="p-6 flex-1 overflow-y-auto">
                <div className="border-b border-gray-200 mb-4"><nav className="-mb-px flex space-x-6"><button onClick={() => setDetailTab('overview')} className={`py-2 px-1 border-b-2 font-medium text-sm ${detailTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Overview</button><button onClick={() => setDetailTab('fit')} className={`py-2 px-1 border-b-2 font-medium text-sm ${detailTab === 'fit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Your Fit Analysis</button><button onClick={() => setDetailTab('company')} className={`py-2 px-1 border-b-2 font-medium text-sm ${detailTab === 'company' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Company Info</button></nav></div>
                {detailTab === 'overview' && <p className="text-sm text-gray-700 leading-relaxed">{internship.description}</p>}
                {detailTab === 'fit' && <FitAnalysis />}
                {detailTab === 'company' && <p className="text-sm text-gray-700 leading-relaxed">{internship.companyInfo}</p>}
            </div>
        </div>
    );
};