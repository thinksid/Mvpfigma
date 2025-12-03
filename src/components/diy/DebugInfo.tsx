import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button-simple';
import { Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '../ui/sonner';

interface DebugInfoProps {
  generationId?: string | null;
  contextData?: any;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ generationId, contextData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const debugData = {
    timestamp: new Date().toISOString(),
    window: {
      href: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      origin: window.location.origin,
    },
    urlParams: Object.fromEntries(new URLSearchParams(window.location.search)),
    localStorage: {
      pending_generation_id: localStorage.getItem('pending_generation_id'),
      allKeys: Object.keys(localStorage),
    },
    props: {
      generationId,
    },
    context: {
      hasGenerationId: !!contextData?.generationId,
      hasHtmlCode: !!contextData?.htmlCode,
      generationId: contextData?.generationId,
    },
    navigator: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
    },
  };

  const handleCopy = () => {
    const text = JSON.stringify(debugData, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Debug info copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if we're in debug mode (URL param ?debug=true)
  const urlParams = new URLSearchParams(window.location.search);
  const isDebugMode = urlParams.get('debug') === 'true';

  if (!isDebugMode && !isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          <span className="text-xs">Debug Info</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-2xl">
      <Card className="p-4 shadow-2xl border-2 border-yellow-400 bg-yellow-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-900">🐛 Debug Information</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="h-7 px-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  <span className="text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugData, null, 2)}
            </pre>

            <div className="pt-2 border-t border-yellow-300">
              <p className="text-xs text-gray-600 mb-2">
                <strong>Quick Checks:</strong>
              </p>
              <ul className="text-xs space-y-1 text-gray-700">
                <li className={debugData.urlParams.id ? 'text-green-600 font-semibold' : 'text-red-600'}>
                  {debugData.urlParams.id ? '✅' : '❌'} URL has generation ID
                </li>
                <li className={debugData.localStorage.pending_generation_id ? 'text-green-600 font-semibold' : 'text-red-600'}>
                  {debugData.localStorage.pending_generation_id ? '✅' : '❌'} localStorage has generation ID
                </li>
                <li className={debugData.context.hasGenerationId ? 'text-green-600 font-semibold' : 'text-red-600'}>
                  {debugData.context.hasGenerationId ? '✅' : '❌'} Context has generation ID
                </li>
                <li className={debugData.context.hasHtmlCode ? 'text-green-600 font-semibold' : 'text-red-600'}>
                  {debugData.context.hasHtmlCode ? '✅' : '❌'} Context has HTML code
                </li>
              </ul>
            </div>

            <div className="pt-2 text-xs text-gray-600">
              <strong>Add ?debug=true to URL to always show this panel</strong>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
