import React from 'react';
import { FaLanguage } from 'react-icons/fa';

const TranslationSelector = ({ onLanguageChange, currentLanguage }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ml', name: 'Malayalam' }
  ];

  return (
    <div className="translation-selector">
      <div className="language-select">
        <FaLanguage className="language-icon" />
        <select 
          value={currentLanguage} 
          onChange={(e) => onLanguageChange(e.target.value)}
          className="language-dropdown"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TranslationSelector; 