import React, { useState } from 'react';
import { LanguageSelector } from './components/LanguageSelector';

export function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Tricolor Strip */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Top Bar with Official Ashoka Emblem and Government of India */}
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Top Left: Emblem and Government of India */}
          <div className="flex items-center gap-4">
            {/* Official Ashoka Emblem of India */}
            <img
              src="/emblem-of-india.svg"
              alt="State Emblem of India (Ashoka Lion Capital with Satyameva Jayate)"
              className="h-16 w-auto object-contain shrink-0 drop-shadow-xs"
            />

            {/* Official Government Text */}
            <div className="border-l border-slate-300 pl-4 py-0.5">
              <p className="text-sm font-bold text-slate-900 tracking-wide">
                भारत सरकार
              </p>
              <p className="text-base font-extrabold text-slate-900 tracking-wider uppercase font-serif">
                Government of India
              </p>
            </div>
          </div>

          {/* Top Right (Marked Region): Language Change Dropdown */}
          <div className="flex items-center gap-3">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={(code) => setSelectedLanguage(code)}
            />
          </div>
        </div>
      </header>

      {/* Clean, empty main canvas ready for next step additions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Intentionally left blank for step-by-step additions */}
      </main>
    </div>
  );
}

export default App;
