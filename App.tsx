
import React, { useState, useCallback, useEffect } from 'react';
import type { PasswordOptions, Strength } from './types';
import { Checkbox } from './components/Checkbox';
import { Icon } from './components/Icon';

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [strength, setStrength] = useState<Strength>({ level: 'Too Weak', color: 'bg-red-500' });
  const [copied, setCopied] = useState(false);

  const calculateStrength = useCallback(() => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;

    let charTypes = 0;
    if (options.uppercase) charTypes++;
    if (options.lowercase) charTypes++;
    if (options.numbers) charTypes++;
    if (options.symbols) charTypes++;
    
    score += charTypes;

    if (score <= 2) setStrength({ level: 'Too Weak', color: 'bg-red-500' });
    else if (score <= 4) setStrength({ level: 'Weak', color: 'bg-orange-500' });
    else if (score <= 5) setStrength({ level: 'Medium', color: 'bg-yellow-500' });
    else setStrength({ level: 'Strong', color: 'bg-green-500' });
  }, [length, options]);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (options.uppercase) charset += CHARSETS.uppercase;
    if (options.lowercase) charset += CHARSETS.lowercase;
    if (options.numbers) charset += CHARSETS.numbers;
    if (options.symbols) charset += CHARSETS.symbols;

    if (charset === '') {
      setPassword('Select options');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  }, [length, options]);
  
  useEffect(() => {
    generatePassword();
    calculateStrength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options, generatePassword]);


  const handleOptionChange = (option: keyof PasswordOptions) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleCopyToClipboard = () => {
    if (password && password !== 'Select options') {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/3 w-96 h-96 bg-violet-600 rounded-full mix-blend-lighten filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-3/4 -translate-y-1/2 w-96 h-96 bg-sky-500 rounded-full mix-blend-lighten filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-lighten filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <main className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-200">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400 mb-6">
            Password Generator
          </h1>
          
          <div className="relative flex items-center bg-slate-900/70 rounded-lg p-4 mb-6">
            <span className="flex-grow font-mono text-lg tracking-wider text-slate-50">{password}</span>
            <button
              onClick={handleCopyToClipboard}
              className="p-2 text-slate-400 hover:text-violet-400 transition-colors duration-200"
              aria-label="Copy password"
            >
              {copied ? <Icon as="check" className="w-6 h-6 text-green-400" /> : <Icon as="copy" className="w-6 h-6" />}
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="length" className="font-medium text-slate-300">Password Length</label>
                <span className="text-xl font-bold text-violet-400">{length}</span>
              </div>
              <input
                id="length"
                type="range"
                min="6"
                max="32"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Checkbox id="uppercase" label="Include Uppercase" checked={options.uppercase} onChange={() => handleOptionChange('uppercase')} />
              <Checkbox id="lowercase" label="Include Lowercase" checked={options.lowercase} onChange={() => handleOptionChange('lowercase')} />
              <Checkbox id="numbers" label="Include Numbers" checked={options.numbers} onChange={() => handleOptionChange('numbers')} />
              <Checkbox id="symbols" label="Include Symbols" checked={options.symbols} onChange={() => handleOptionChange('symbols')} />
            </div>

            <div className="bg-slate-900/70 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">STRENGTH</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-50">{strength.level}</span>
                <div className={`w-10 h-2 rounded-full ${strength.color}`}></div>
              </div>
            </div>

            <button
              onClick={generatePassword}
              className="w-full bg-gradient-to-r from-violet-500 to-sky-500 hover:from-violet-600 hover:to-sky-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Icon as="refresh" className="w-5 h-5" />
              Generate Password
            </button>
          </div>
        </div>
      </main>
       <style jsx="true">{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default App;
