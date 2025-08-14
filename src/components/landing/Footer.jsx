import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Footer() {
    
      const bottomLinks = ["이용약관", "개인정보처리방침"];
    
      return (
        <footer className="bg-gray-900 text-white !py-8">
          <div className="container !mx-auto !px-4">
            <div className="flex md:flex-row items-center !space-x-2 !mb-4 md:mb-0">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span className="text-lg">English Compass</span>
            </div>
            
            {/* Bottom Section */}
            <div className="border-t border-gray-800 !pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p>&copy; 2025 English Compass. All rights reserved.</p>
              <div className="flex !space-x-4 !mt-4 md:mt-0">
                {bottomLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      );
    };