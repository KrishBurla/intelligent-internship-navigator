import React, { useState, useEffect, useCallback } from 'react';

// --- ICONS for Profile View ---
const LoaderIcon = (props) => ( <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );
const SaveIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg> );
const CodeIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> );
const XIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
const PlusIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const CompassIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg> );
const FileTextIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg> );
const RotateCwIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> );

const API_BASE_URL = 'http://127.0.0.1:5000';

// A helper component for displaying profile information in cards
const InfoCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="mt-4">{children}</div>
    </div>
);

// A helper component for individual data points
const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value || 'Not specified'}</p>
    </div>
);

export default function ProfileView({ onOpenResumeModal, onRetakeQuiz }) {
    const [profile, setProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [error, setError] = useState(''); // Correctly declared error state

    // Safely split skills string into an array
    const skillsArray = profile && profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const preferencesArray = profile && profile.preference_tags ? profile.preference_tags.split(',').map(s => s.trim().replace(/-/g, ' ')).filter(Boolean) : [];

    const fetchProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        setError(''); // Reset error on new fetch
        try {
            const token = localStorage.getItem('authToken');
            const email = localStorage.getItem('userEmail');
            const response = await fetch(`${API_BASE_URL}/api/profile?email=${email}`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (!response.ok) {
                throw new Error("Could not fetch profile data. Please try again.");
            }
            const data = await response.json();
            setProfile(data);
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsLoadingProfile(false); 
        }
    }, []);

    useEffect(() => { 
        fetchProfile(); 
    }, [fetchProfile]);
    
    const handleInputChange = (e) => {
        setProfile({...profile, [e.target.name]: e.target.value});
    };
    
    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill && !skillsArray.map(s => s.toLowerCase()).includes(newSkill.toLowerCase())) {
            const updatedSkills = [...skillsArray, newSkill.trim()].join(', ');
            setProfile({...profile, skills: updatedSkills});
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        const updatedSkills = skillsArray.filter(skill => skill !== skillToRemove).join(', ');
        setProfile({...profile, skills: updatedSkills});
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage('');
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(profile)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setSaveMessage("Profile updated successfully!");
            localStorage.setItem('userName', profile.name);
        } catch (err) { 
            setSaveMessage(err.message); 
        } finally { 
            setIsSaving(false); 
        }
    };

    if (isLoadingProfile) {
        return <div className="p-8 text-center"><LoaderIcon /></div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    }

    // This handles the case where the profile hasn't loaded yet
    if (!profile) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="mt-1 text-gray-600">Update your personal and professional information.</p>
                </div>
                <button 
                    onClick={onOpenResumeModal} 
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    <FileTextIcon className="w-5 h-5 mr-2" /> 
                    Update with Resume
                </button>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" value={profile.name || ''} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Highest Education</label>
                            <input type="text" name="education" value={profile.education || ''} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" value={profile.email || ''} disabled className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                            <input type="text" name="field_of_study" value={profile.field_of_study || ''} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                </div>
                
                <div className="pt-6">
                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                    <div className="mt-2 p-4 border border-gray-200 rounded-lg">
                        <div className="flex flex-wrap gap-3">
                            {skillsArray.map(skill => (
                                <span key={skill} className="group flex items-center bg-blue-100 text-blue-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                                    <CodeIcon className="w-4 h-4 mr-2" />
                                    {skill}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveSkill(skill)} 
                                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XIcon className="w-4 h-4 text-blue-600 hover:text-blue-900"/>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex mt-4 relative">
                            <PlusIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input 
                                type="text" 
                                value={newSkill} 
                                onChange={(e) => setNewSkill(e.target.value)} 
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter'){ 
                                        e.preventDefault();
                                        handleAddSkill(e);
                                    }
                                }} 
                                placeholder="Add a new skill and press Enter" 
                                className="flex-grow pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="pt-6">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">Work Style Preferences</label>
                        <button 
                            type="button" 
                            onClick={onRetakeQuiz} 
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <RotateCwIcon className="w-4 h-4 mr-1.5" />
                            Retake Quiz
                        </button>
                    </div>
                    <div className="mt-2 p-4 border-t border-gray-200">
                        {preferencesArray.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {preferencesArray.map(pref => (
                                    <span key={pref} className="flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
                                        <CompassIcon className="w-4 h-4 mr-2 text-gray-500" />
                                        {pref}
                                    </span>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-500">Take the 'Internship DNA' quiz on the dashboard to see your preferences here.</p>}
                    </div>
                </div>
                
                <div className="flex justify-end items-center pt-6 border-t border-gray-200">
                    {saveMessage && <p className={`text-sm mr-4 ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{saveMessage}</p>}
                    <button 
                        type="submit" 
                        disabled={isSaving} 
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
                    >
                        <SaveIcon className="w-5 h-5 mr-2"/> 
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}