import { Laptop2 } from 'lucide-react';
import React from 'react'

function AuthImagePattern({title, subtitle}) {
  return (
    <div className="flex flex-col justify-center items-center bg-[#0d1117] text-white p-10 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-900 to-black opacity-20 z-0 pointer-events-none" />
  
      {/* Main content */}
      <div className="relative z-10 text-center max-w-md">
        <h2 className="text-3xl font-bold text-[#2ea043] font-mono mb-4">{title}</h2>
        <p className="text-[#8b949e] font-mono mb-6">{subtitle}</p>
  
        {/* Icon and code block instead of image */}
        <Laptop2 className="w-28 h-28 mx-auto text-[#2ea043] opacity-90 mb-4" />
        <pre className="text-sm text-green-500 bg-[#0d1117] p-4 rounded-md font-mono overflow-x-auto">
  {`function helloWorld() {
    console.log("Hello, Developer 👨‍💻👩‍💻");
  }`}
        </pre>
      </div>
    </div>
  );
}

export default AuthImagePattern