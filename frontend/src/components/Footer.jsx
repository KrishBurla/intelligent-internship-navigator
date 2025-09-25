import React from 'react';

// --- Icons for the Footer ---
const TargetIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> );
const TwitterIcon = (props) => (<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>Twitter</title><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.49-1.74.85-2.7 1.04A4.37 4.37 0 0 0 12 8.42a12.38 12.38 0 0 1-8.98-4.56 4.37 4.37 0 0 0 1.35 5.83-4.36 4.36 0 0 1-1.98-.55v.05a4.37 4.37 0 0 0 3.5 4.29-4.33 4.33 0 0 1-1.97.08 4.37 4.37 0 0 0 4.08 3.03A8.79 8.79 0 0 1 2 18.54a12.35 12.35 0 0 0 6.69 1.95c8.03 0 12.42-6.66 12.42-12.42v-.56A8.89 8.89 0 0 0 22.46 6z" /></svg>);
const LinkedinIcon = (props) => (<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>LinkedIn</title><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>);
const GithubIcon = (props) => (<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>GitHub</title><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>);

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center">
                        <TargetIcon className="h-7 w-7 text-blue-600" />
                        <span className="ml-2 text-lg font-bold text-gray-800">Internship Navigator</span>
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Dashboard</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Profile</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
                    </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Internship Navigator. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-gray-500 fill-current"><TwitterIcon className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-gray-500 fill-current"><GithubIcon className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-gray-500 fill-current"><LinkedinIcon className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}