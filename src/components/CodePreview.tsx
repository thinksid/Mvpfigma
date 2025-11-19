import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button-simple';

interface CodePreviewProps {
  code: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="bg-[#1c1c60] rounded-lg overflow-hidden">
        {/* Code Editor Header */}
        <div className="bg-[#0f0f30] px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-white/60 text-sm">index.html</span>
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-x-auto">
          <pre className="text-sm text-white/90 font-mono leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};