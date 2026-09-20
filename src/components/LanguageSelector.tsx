import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const OFFICIAL_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLanguage =
    OFFICIAL_LANGUAGES.find((lang) => lang.code === selectedLanguage) ||
    OFFICIAL_LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} id="language-selector-wrapper">
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        id="language-selector-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all duration-150 shadow-xs ${
          isOpen
            ? 'border-blue-900 bg-blue-50/50 text-blue-950 ring-2 ring-blue-900/10'
            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900'
        }`}
      >
        <Globe className="h-3.5 w-3.5 text-blue-900 shrink-0" />
        <span className="flex items-center gap-1.5 font-medium">
          <span className="font-semibold">{activeLanguage.name}</span>
          {activeLanguage.code !== 'en' && (
            <span className="text-slate-500 font-normal">
              ({activeLanguage.nativeName})
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-900' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="language-dropdown-menu"
          role="listbox"
          aria-label="Select Language"
          className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100 max-h-80 overflow-y-auto"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Select Portal Language / भाषा चुनें
          </div>

          <div className="py-1">
            {OFFICIAL_LANGUAGES.map((language) => {
              const isSelected = language.code === selectedLanguage;
              return (
                <button
                  key={language.code}
                  id={`language-option-${language.code}`}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(language.code)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 text-blue-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {language.nativeName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {language.name}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-900 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/70 text-[10px] text-slate-500 text-center">
            Recognized Official Languages of India
          </div>
        </div>
      )}
    </div>
  );
}
