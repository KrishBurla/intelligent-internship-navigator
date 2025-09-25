import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// --- Icons ---
const TargetIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>);
const CheckIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>);
const CircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle></svg>);

// --- Password Validation Component ---
const PasswordValidator = ({ password }) => {
    const validations = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const ValidationItem = ({ isValid, text }) => (
        <div className={`flex items-center text-sm transition-colors ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
            {isValid ? <CheckIcon className="w-4 h-4 mr-2" /> : <CircleIcon className="w-4 h-4 mr-2" />}
            {text}
        </div>
    );

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            <ValidationItem isValid={validations.length} text="At least 8 characters" />
            <ValidationItem isValid={validations.uppercase} text="One uppercase letter" />
            <ValidationItem isValid={validations.lowercase} text="One lowercase letter" />
            <ValidationItem isValid={validations.number} text="One number" />
            <ValidationItem isValid={validations.special} text="One special character" />
        </div>
    );
};

// --- Main Signup Page Component ---
export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isFormValid = () => {
      const validations = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
      };
      return Object.values(validations).every(Boolean) && name && email;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setError("Please fill all fields and meet password requirements.");
            return;
        }
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create account.');
            
            navigate('/login'); // Redirect to login on success

        } catch (err) {
            setError(err.message);
        }
    };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left decorative column */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gray-50">
         <div className="absolute inset-0 h-full w-full object-cover flex items-center justify-center">
            <div className="text-center px-12">
                <TargetIcon className="h-16 w-16 text-blue-600 mx-auto"/>
                <h2 className="mt-6 text-3xl font-bold text-gray-800">Find Your Perfect Internship</h2>
                <p className="mt-4 text-gray-600">
                    Our AI-powered engine analyzes your skills to match you with opportunities that will launch your career.
                </p>
            </div>
         </div>
      </div>

      {/* Right form column */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1">
                    <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1">
                    <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1">
                    <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                  </div>
                </div>
                
                <PasswordValidator password={password} />
                
                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                  <button type="submit" disabled={!isFormValid()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}