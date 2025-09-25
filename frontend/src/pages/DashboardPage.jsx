import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Components using absolute paths from 'src'
import OnboardingModal from 'components/OnboardingModal';
import ResumeAnalyzerModal from 'components/ResumeAnalyzerModal';
import QuizModal from 'components/QuizModal';
import Footer from 'components/Footer';

// Import Views using absolute paths from 'src'
import DashboardView from 'views/DashboardView';
import MyApplicationsView from 'views/MyApplicationsView';
import AnnouncementsView from 'views/AnnouncementsView';
import ProfileView from 'views/ProfileView';

// --- ICONS for Layout ---
const HomeIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> );
const BriefcaseIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg> );
const UserIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const FileTextIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg> );
const LogOutIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg> );
const TargetIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> );
const MegaphoneIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg> );

const API_BASE_URL = 'http://127.0.0.1:5000';

// --- LAYOUT COMPONENTS (Defined at the top level for stability) ---
function Header({ userName }) {
    return (
        <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-30 border-b border-gray-200">
            <div className="max-w-full mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <TargetIcon className="h-8 w-8 text-blue-600" />
                        <span className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">Internship Navigator</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 hidden sm:block">Welcome, {userName}</span>
                        <img className="h-10 w-10 rounded-full" src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${userName?.charAt(0)}`} alt="User Avatar" />
                    </div>
                </div>
            </div>
        </header>
    );
}

function Sidebar({ activeTab, onNavClick, onLogout, userName }) {
    const navItems = [
        { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' }, 
        { id: 'applications', icon: BriefcaseIcon, label: 'My Applications' }, 
        { id: 'profile', icon: UserIcon, label: 'My Profile' }, 
        { id: 'analyzer', icon: FileTextIcon, label: 'Resume Analyzer' },
        { id: 'announcements', icon: MegaphoneIcon, label: 'Announcements' }
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 text-center border-b border-gray-200">
                <img className="h-24 w-24 rounded-full mx-auto" src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${userName?.charAt(0)}`} alt="User Avatar" />
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{userName}</h3>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => onNavClick(item.id)} className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="px-4 py-6 mt-auto">
                <button onClick={onLogout} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                    <LogOutIcon className="h-5 w-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function DashboardPage() {
    // --- STATE MANAGEMENT ---
    const [showOnboarding, setShowOnboarding] = useState(localStorage.getItem('profileComplete') === 'false');
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizTaken, setQuizTaken] = useState(localStorage.getItem('quizTaken') === 'true');
    const [internships, setInternships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const [userName, setUserName] = useState(localStorage.getItem('userName'));
    
    // --- DATA FETCHING ---
    const fetchInternships = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/internships`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch internships.');
            const data = await response.json();
            setInternships(data);
        } catch (error) { 
            setError(error.message);
        } finally { 
            setIsLoading(false); 
        }
    }, []);

    useEffect(() => {
        if (showOnboarding) { 
            setIsLoading(false); 
            return; 
        }
        const token = localStorage.getItem('authToken');
        if (!token) { 
            navigate('/login'); 
            return; 
        }
        
        if (activeTab === 'dashboard' || activeTab === 'applications') {
            fetchInternships();
        } else {
            setIsLoading(false);
        }
    }, [navigate, showOnboarding, activeTab, fetchInternships]);

    // --- HANDLERS ---
    const handleOnboardingComplete = () => { 
        localStorage.setItem('profileComplete', 'true'); 
        setShowOnboarding(false); 
    };
    const handleLogout = () => { 
        localStorage.clear(); 
        navigate('/login'); 
    };
    const handleNavClick = (id) => { 
        if (id === 'analyzer') {
            setShowResumeModal(true);
        } else {
            setActiveTab(id);
        }
    };
    const handleSkipOnboarding = () => {
        localStorage.setItem('profileComplete', 'true');
        setShowOnboarding(false);
    };

    // --- CHANGE: New function to update profile with resume data ---
    const updateProfileWithResumeData = async (resumeData) => {
        try {
            const token = localStorage.getItem('authToken');
            const email = localStorage.getItem('userEmail');
            const updatedProfile = {
                email,
                name: resumeData.name,
                skills: resumeData.skills.join(', ')
            };
            
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedProfile)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update profile.");
            }

            // Update local storage and state
            localStorage.setItem('userName', resumeData.name);
            setUserName(resumeData.name); // This will re-render the Header
            
            // Force a re-render of the profile view
            if(activeTab === 'profile'){
                setActiveTab(''); 
                setTimeout(() => setActiveTab('profile'), 0);
            }

        } catch (error) {
            console.error("Error updating profile with resume data:", error);
            // Optionally, show an error message to the user
        }
    };

    // --- MAIN RENDER LOGIC ---
    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard': 
                return <DashboardView internships={internships} isLoading={isLoading} error={error} quizCompleted={quizTaken} onTakeQuiz={() => setShowQuiz(true)} />;
            case 'applications': 
                return <MyApplicationsView internships={internships} isLoading={isLoading} error={error} />;
            case 'announcements': 
                return <AnnouncementsView />;
            case 'profile': 
                return <ProfileView onOpenResumeModal={() => setShowResumeModal(true)} onRetakeQuiz={() => setShowQuiz(true)} />;
            default: 
                return <DashboardView internships={internships} isLoading={isLoading} error={error} quizCompleted={quizTaken} onTakeQuiz={() => setShowQuiz(true)} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
            <OnboardingModal 
                show={showOnboarding} 
                onComplete={handleOnboardingComplete}
                onSkip={handleSkipOnboarding}
            />
            <ResumeAnalyzerModal 
                show={showResumeModal} 
                onClose={() => setShowResumeModal(false)} 
                // --- CHANGE: Use the new handler function ---
                onAnalysisComplete={(data) => { 
                    setShowResumeModal(false);
                    updateProfileWithResumeData(data);
                }}
            />
            <QuizModal 
                show={showQuiz} 
                onClose={(success) => { 
                    setShowQuiz(false); 
                    if(success) { 
                        localStorage.setItem('quizTaken', 'true');
                        setQuizTaken(true);
                        if (activeTab === 'profile') {
                            setActiveTab(''); 
                            setTimeout(() => setActiveTab('profile'), 0);
                        }
                    }
                }} 
            />
            
            <div className={`flex flex-1 overflow-hidden transition-all duration-500 ${showOnboarding || showResumeModal || showQuiz ? 'blur-lg pointer-events-none' : ''}`}>
                <div className="hidden md:flex">
                    <Sidebar activeTab={activeTab} onNavClick={handleNavClick} onLogout={handleLogout} userName={userName} />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header userName={userName} />
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <main className="flex-1 overflow-y-auto bg-gray-50">
                            {renderContent()}
                        </main>
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}