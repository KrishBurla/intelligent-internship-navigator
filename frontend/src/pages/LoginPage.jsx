import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const TargetIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to login.');
            
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('profileComplete', data.profile_complete ? 'true' : 'false');
            localStorage.setItem('quizTaken', data.quiz_taken ? 'true' : 'false');

            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="flex-grow flex">
                <div className="hidden lg:block relative w-0 flex-1 bg-gray-50">
                    <div className="absolute inset-0 h-full w-full object-cover flex items-center justify-center">
                        <div className="text-center px-12">
                            <TargetIcon className="h-16 w-16 text-blue-600 mx-auto"/>
                            <h2 className="mt-6 text-3xl font-bold text-gray-800">Welcome Back</h2>
                            <p className="mt-4 text-gray-600">
                                Sign in to continue your journey and discover new internship opportunities tailored just for you.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                            <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                create a new account
                            </Link>
                            </p>
                        </div>
                        <div className="mt-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label><div className="mt-1"><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div></div>
                                <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><div className="mt-1"><input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div></div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <div><button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Sign in</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}