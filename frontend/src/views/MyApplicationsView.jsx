import React from 'react';

export default function MyApplicationsView({ internships }) {
    const applications = internships.filter(i => i.applicationStatus);

    const getStatusPill = (status) => {
        switch(status){
            case 'Applied': 
                return <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Applied</span>;
            case 'Under Review': 
                return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Under Review</span>;
            default: 
                return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="mt-1 text-gray-600">Track the status of all your submitted applications.</p>
            <div className="mt-8 space-y-4">
                {applications.length > 0 ? applications.map(app => (
                    <div key={app.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src={app.logo} className="w-12 h-12 rounded-lg" alt={`${app.company} logo`}/>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800">{app.title}</h4>
                                <p className="text-sm text-gray-600">{app.company}</p>
                            </div>
                        </div>
                        {getStatusPill(app.applicationStatus)}
                    </div>
                )) : (
                    <div className="text-center text-gray-500 py-16 bg-white rounded-xl border border-gray-200">
                        <p>You haven't applied to any internships yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}