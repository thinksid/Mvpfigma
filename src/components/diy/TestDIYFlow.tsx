import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

/**
 * Test component to debug DIY flow
 * This tests each step of the process
 */
export const TestDIYFlow: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1da61fc8`;

  // Test 1: Health check
  const testHealthCheck = async () => {
    try {
      addResult('🔍 Testing server health check...');
      const response = await fetch(`${SERVER_URL}/health`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        addResult('✅ Server is running!');
        toast.success('Server is healthy');
      } else {
        addResult('❌ Server returned unexpected response');
        toast.error('Server health check failed');
      }
    } catch (error) {
      addResult(`❌ Health check failed: ${error}`);
      toast.error('Server is not accessible');
    }
  };

  // Test 2: Save to KV store via server
  const testSaveToKV = async () => {
    try {
      addResult('🔍 Testing KV store save...');
      const testGenerationId = `test_${Date.now()}`;
      const testData = {
        generation_id: testGenerationId,
        html_code: '<div>Test HTML</div>',
        preview_data: [{ slide_number: 1, name: 'Test' }],
        testimonial_count: 1,
        created_at: new Date().toISOString(),
      };

      const response = await fetch(`${SERVER_URL}/diy/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          generation_id: testGenerationId,
          data: testData,
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        addResult(`✅ Saved to KV store with ID: ${testGenerationId}`);
        toast.success('KV store save successful');
        return testGenerationId;
      } else {
        addResult(`❌ Save failed: ${JSON.stringify(result)}`);
        toast.error('KV store save failed');
        return null;
      }
    } catch (error) {
      addResult(`❌ Save error: ${error}`);
      toast.error('Save failed');
      return null;
    }
  };

  // Test 3: Read from KV store via server
  const testReadFromKV = async (generationId: string) => {
    try {
      addResult(`🔍 Testing KV store read for ${generationId}...`);
      
      const response = await fetch(`${SERVER_URL}/diy/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const result = await response.json();
      
      if (response.ok && result.success && result.data) {
        addResult(`✅ Read from KV store: ${JSON.stringify(result.data).substring(0, 100)}...`);
        toast.success('KV store read successful');
        return true;
      } else {
        addResult(`❌ Read failed: ${JSON.stringify(result)}`);
        toast.error('KV store read failed');
        return false;
      }
    } catch (error) {
      addResult(`❌ Read error: ${error}`);
      toast.error('Read failed');
      return false;
    }
  };

  // Test 4: Test N8N webhook (mock)
  const testN8NWebhook = async () => {
    try {
      addResult('🔍 Testing N8N webhook...');
      const WEBHOOK_URL = 'https://thinksid.app.n8n.cloud/webhook/diy-social-proof';
      
      const testPayload = {
        testimonials: [
          {
            customer_name: 'Test User',
            location: 'Test City',
            product_service: 'Test Product',
            photo_url: 'placeholder',
            context: 'Test context',
            problem: 'Test problem',
            solution: 'Test solution',
            technical_result: 'Test technical result',
            meaningful_result: 'Test meaningful result',
            quote: 'placeholder',
          }
        ]
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      if (!response.ok) {
        addResult(`❌ N8N webhook failed: ${response.statusText}`);
        toast.error('N8N webhook failed');
        return null;
      }

      const data = await response.json();
      addResult(`✅ N8N response: ${JSON.stringify(data).substring(0, 100)}...`);
      
      if (data.generation_id && data.html_code && data.preview_data) {
        toast.success('N8N webhook successful');
        return data;
      } else {
        addResult('⚠️ N8N response missing required fields');
        toast.warning('N8N response incomplete');
        return null;
      }
    } catch (error) {
      addResult(`❌ N8N error: ${error}`);
      toast.error('N8N webhook failed');
      return null;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults([]);
    addResult('🚀 Starting full flow test...');
    
    // Test 1: Health check
    await testHealthCheck();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 2: Save to KV
    const generationId = await testSaveToKV();
    if (!generationId) {
      addResult('❌ Cannot continue - save test failed');
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 3: Read from KV
    const readSuccess = await testReadFromKV(generationId);
    if (!readSuccess) {
      addResult('❌ Cannot continue - read test failed');
      return;
    }
    
    addResult('✅ All basic tests passed! N8N test is optional (costs API calls)');
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto my-8">
      <h2 className="text-2xl text-[#1c1c60] mb-4">DIY Flow Debugger</h2>
      <p className="text-gray-600 mb-6">
        Test each step of the DIY carousel generation process
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Button onClick={testHealthCheck} variant="outline">
          1. Health Check
        </Button>
        <Button onClick={testSaveToKV} variant="outline">
          2. Test Save
        </Button>
        <Button onClick={async () => {
          const id = prompt('Enter generation ID to test:');
          if (id) await testReadFromKV(id);
        }} variant="outline">
          3. Test Read
        </Button>
        <Button onClick={testN8NWebhook} variant="outline">
          4. Test N8N
        </Button>
      </div>
      
      <Button onClick={runAllTests} className="w-full mb-6 bg-[#5b81ff] hover:bg-[#4a6fd9]">
        Run All Tests
      </Button>
      
      {/* Results Log */}
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click a button above to start.</p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} className="mb-1">{result}</div>
          ))
        )}
      </div>
    </Card>
  );
};
