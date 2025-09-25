import React from 'react';

export default function AnnouncementsView() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="mt-1 text-gray-600">Latest news and updates from the internship program.</p>
            <div className="mt-8 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">Application Deadline Extended for Fall Cohort</h3>
                    <p className="text-sm text-gray-500 mt-1">September 25, 2025</p>
                    <p className="mt-3 text-gray-700">The deadline for the Fall 2025 internship cohort has been extended to October 15th. This gives all aspiring candidates an extra two weeks to perfect and submit their applications. Good luck!</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800">New Partner Companies Added</h3>
                    <p className="text-sm text-gray-500 mt-1">September 18, 2025</p>
                    <p className="mt-3 text-gray-700">We are thrilled to welcome three new industry leaders to our program: QuantumLeap Analytics, EcoInnovate Solutions, and NextGen Robotics. Check the dashboard for new and exciting opportunities!</p>
                </div>
            </div>
        </div>
    );
}