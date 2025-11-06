import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Eye, Code, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface HTMLEditorProps {
  initialHTML: string;
  onSave: (updatedHTML: string) => Promise<void>;
  generationId: string;
  testimonialCount?: number;
}

interface EditableElement {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'textarea';
  element: Element;
  parentContainer: Element;
}

interface GroupedTestimonial {
  testimonialNumber: number;
  elements: EditableElement[];
}

export const HTMLEditor: React.FC<HTMLEditorProps> = ({ 
  initialHTML, 
  onSave, 
  generationId,
  testimonialCount 
}) => {
  const [htmlContent, setHtmlContent] = useState(initialHTML);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [editableElements, setEditableElements] = useState<EditableElement[]>([]);
  const [groupedTestimonials, setGroupedTestimonials] = useState<GroupedTestimonial[]>([]);
  const [parsedDoc, setParsedDoc] = useState<Document | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Parse HTML to extract editable text content
  useEffect(() => {
    if (initialHTML) {
      parseHTMLToEditableElements(initialHTML);
    }
  }, [initialHTML]);

  // Update iframe when HTML changes in preview mode
  useEffect(() => {
    if (mode === 'preview' && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [htmlContent, mode]);

  const getLabelForElement = (className: string, tagName: string, indexInContainer: number): string => {
    const classLower = className.toLowerCase();
    
    // Label order for testimonials
    const labelOrder = [
      'Hook / Heading',
      'Client Name',
      'Location',
      'Challenge',
      'Solution',
      'Key Result 1',
      'Key Result 2'
    ];
    
    // Try to match based on class names
    if (classLower.includes('hook') || classLower.includes('heading') || classLower.includes('headline')) {
      return 'Hook / Heading';
    }
    if (classLower.includes('customer-name') || classLower.includes('client-name')) {
      return 'Client Name';
    }
    if ((classLower.includes('name') && !classLower.includes('farm')) && indexInContainer <= 2) {
      return 'Client Name';
    }
    if (classLower.includes('location') || classLower.includes('city') || classLower.includes('state')) {
      return 'Location';
    }
    if (classLower.includes('farm') || classLower.includes('context')) {
      return 'Location';
    }
    if (classLower.includes('challenge') || classLower.includes('problem')) {
      return 'Challenge';
    }
    if (classLower.includes('solution')) {
      return 'Solution';
    }
    if (classLower.includes('result-1') || classLower.includes('technical')) {
      return 'Key Result 1';
    }
    if (classLower.includes('result-2') || classLower.includes('financial') || classLower.includes('meaningful')) {
      return 'Key Result 2';
    }
    if (classLower.includes('result') || classLower.includes('metric')) {
      if (indexInContainer === 5) return 'Key Result 1';
      if (indexInContainer === 6) return 'Key Result 2';
      return 'Key Result 1';
    }
    
    // Fallback based on tag and position
    if (tagName.match(/^h[1-3]$/) && indexInContainer === 0) {
      return 'Hook / Heading';
    }
    
    // Fallback to position-based labeling
    if (indexInContainer < labelOrder.length) {
      return labelOrder[indexInContainer];
    }
    
    return 'Text';
  };

  const parseHTMLToEditableElements = (html: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      setParsedDoc(doc);

      console.log('\n========================================');
      console.log('PARSING HTML FOR EDITABLE ELEMENTS');
      console.log('========================================');
      console.log('Expected testimonial count:', testimonialCount);
      console.log('HTML length:', html.length, 'chars');
      console.log('HTML preview:', html.substring(0, 500), '...');
      console.log('Body HTML preview:', doc.body.innerHTML.substring(0, 500), '...');
      
      // Strategy 1: Find all text elements first
      const allTextElements = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, blockquote, li');
      console.log(`\nFound ${allTextElements.length} total text elements in document`);
      
      // Filter to only elements with meaningful direct text
      const elementsWithText: Array<{element: Element, text: string}> = [];
      
      allTextElements.forEach((el) => {
        // Skip if contains other text elements (to avoid nesting)
        const hasNestedText = el.querySelector('p, h1, h2, h3, h4, h5, h6, blockquote');
        if (hasNestedText) return;
        
        const text = el.textContent?.trim() || '';
        if (text.length >= 3) {
          elementsWithText.push({ element: el, text });
        }
      });
      
      console.log(`Filtered to ${elementsWithText.length} elements with text`);
      
      if (elementsWithText.length === 0) {
        console.error('❌ No elements with text found!');
        console.log('Body content:', doc.body.textContent?.substring(0, 500));
        console.log('Body HTML:', doc.body.innerHTML.substring(0, 1000));
        toast.error('Could not find editable content in the HTML');
        return;
      }
      
      // Strategy 2: Try to find containers, or fallback to grouping by count
      let containers: Element[] = [];
      
      // Try common container selectors - EXPANDED LIST
      const containerSelectors = [
        '.carousel-slide',
        '.slide',
        '.testimonial-card',
        '.testimonial',
        '.story-card',
        '.story',
        '.swiper-slide',
        '.slick-slide',
        '[class*="slide"]',
        '[class*="story"]',
        '[class*="testimonial"]',
        '[class*="card"]',
        // Try by ID patterns
        '[id*="slide"]',
        '[id*="story"]',
        '[id*="testimonial"]',
      ];
      
      for (const selector of containerSelectors) {
        try {
          const found = doc.querySelectorAll(selector);
          if (found.length > 0 && found.length <= 10) { // Reasonable number of slides
            containers = Array.from(found);
            console.log(`✓ Found ${containers.length} containers with selector: ${selector}`);
            break;
          }
        } catch (e) {
          console.log(`Failed selector: ${selector}`, e);
        }
      }
      
      // If no containers found, try to find repeating structure
      if (containers.length === 0) {
        console.log('No containers found with selectors, looking for repeating structures...');
        
        // Look for div elements at similar depths that might be slides
        const allDivs = doc.querySelectorAll('div');
        const depthMap = new Map<number, Element[]>();
        
        allDivs.forEach(div => {
          let depth = 0;
          let parent = div.parentElement;
          while (parent) {
            depth++;
            parent = parent.parentElement;
          }
          
          if (!depthMap.has(depth)) {
            depthMap.set(depth, []);
          }
          depthMap.get(depth)!.push(div);
        });
        
        // Find the depth level with the right number of elements
        for (const [depth, elements] of depthMap.entries()) {
          if (testimonialCount && elements.length === testimonialCount) {
            console.log(`✓ Found ${elements.length} elements at depth ${depth} matching testimonial count`);
            containers = elements;
            break;
          }
        }
      }
      
      // If no containers found, create virtual containers based on count
      if (containers.length === 0 && testimonialCount) {
        console.log(`No containers found, creating ${testimonialCount} virtual containers based on testimonial count`);
        
        // Group elements evenly
        const elementsPerContainer = Math.ceil(elementsWithText.length / testimonialCount);
        
        console.log(`Elements per container: ${elementsPerContainer}`);
        
        // Create virtual containers by grouping elements
        const virtualContainers: Element[][] = [];
        for (let i = 0; i < testimonialCount; i++) {
          const start = i * elementsPerContainer;
          const end = Math.min(start + elementsPerContainer, elementsWithText.length);
          const groupElements = elementsWithText.slice(start, end).map(item => item.element);
          if (groupElements.length > 0) {
            virtualContainers.push(groupElements);
          }
        }
        
        console.log(`Created ${virtualContainers.length} virtual containers`);
        
        // Process virtual containers
        const elements: EditableElement[] = [];
        let elementCounter = 0;
        
        virtualContainers.forEach((containerElements, containerIndex) => {
          console.log(`\n--- Virtual Container ${containerIndex + 1}/${virtualContainers.length} ---`);
          
          containerElements.forEach((element, indexInContainer) => {
            const text = element.textContent?.trim() || '';
            const className = element.className || '';
            const tagName = element.tagName.toLowerCase();
            const label = getLabelForElement(className, tagName, indexInContainer);
            const isLongText = text.length > 60;
            
            console.log(`  [${indexInContainer}] ${label}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
            
            elements.push({
              id: `element-${elementCounter++}`,
              label: label,
              value: text,
              type: isLongText ? 'textarea' : 'text',
              element: element,
              parentContainer: doc.body, // Use body as parent for virtual containers
            });
          });
        });
        
        console.log(`\n✓ Total: ${elements.length} editable elements`);
        setEditableElements(elements);
        
        // Group by virtual containers
        const groups: GroupedTestimonial[] = [];
        const elementsPerGroup = Math.ceil(elements.length / testimonialCount);
        
        for (let i = 0; i < testimonialCount; i++) {
          const start = i * elementsPerGroup;
          const end = Math.min(start + elementsPerGroup, elements.length);
          const groupElements = elements.slice(start, end);
          
          if (groupElements.length > 0) {
            groups.push({
              testimonialNumber: i + 1,
              elements: groupElements,
            });
          }
        }
        
        console.log(`Grouped into ${groups.length} testimonials`);
        setGroupedTestimonials(groups);
        return;
      }
      
      // If we have real containers, process them
      if (containers.length > 0) {
        const elements: EditableElement[] = [];
        let elementCounter = 0;
        
        containers.forEach((container, containerIndex) => {
          console.log(`\n--- Container ${containerIndex + 1}/${containers.length} ---`);
          
          const containerTextElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, blockquote');
          let indexInContainer = 0;
          
          containerTextElements.forEach((element) => {
            // Skip nested elements
            const hasNestedText = element.querySelector('p, h1, h2, h3, h4, h5, h6, blockquote');
            if (hasNestedText) return;
            
            const text = element.textContent?.trim() || '';
            if (text.length < 3) return;
            
            const className = element.className || '';
            const tagName = element.tagName.toLowerCase();
            const label = getLabelForElement(className, tagName, indexInContainer);
            const isLongText = text.length > 60;
            
            console.log(`  [${indexInContainer}] ${label}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
            
            elements.push({
              id: `element-${elementCounter++}`,
              label: label,
              value: text,
              type: isLongText ? 'textarea' : 'text',
              element: element,
              parentContainer: container,
            });
            
            indexInContainer++;
          });
        });
        
        console.log(`\n✓ Total: ${elements.length} editable elements`);
        setEditableElements(elements);
        groupElementsByContainer(elements);
      }
      
    } catch (error) {
      console.error('Error parsing HTML:', error);
      toast.error('Could not parse HTML content');
    }
  };

  const groupElementsByContainer = (elements: EditableElement[]) => {
    const containerMap = new Map<Element, EditableElement[]>();
    
    elements.forEach(element => {
      const container = element.parentContainer;
      if (!containerMap.has(container)) {
        containerMap.set(container, []);
      }
      containerMap.get(container)!.push(element);
    });
    
    console.log(`\n=== Grouped into ${containerMap.size} testimonials ===`);
    
    const groups: GroupedTestimonial[] = [];
    let testimonialNumber = 1;
    
    containerMap.forEach((containerElements) => {
      groups.push({
        testimonialNumber: testimonialNumber++,
        elements: containerElements,
      });
    });
    
    setGroupedTestimonials(groups);
  };

  const updateElement = (id: string, newValue: string) => {
    const updated = editableElements.map(el => 
      el.id === id ? { ...el, value: newValue } : el
    );
    setEditableElements(updated);
  };

  const reconstructHTML = (): string => {
    if (!parsedDoc) {
      throw new Error('No parsed document available');
    }

    try {
      const clonedDoc = parsedDoc.cloneNode(true) as Document;
      
      editableElements.forEach((editableEl) => {
        const xpath = getXPath(editableEl.element);
        const result = clonedDoc.evaluate(
          xpath,
          clonedDoc,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        
        const element = result.singleNodeValue as Element;
        if (element) {
          element.textContent = editableEl.value;
        }
      });

      const serializer = new XMLSerializer();
      const docType = '<!DOCTYPE html>\n';
      return docType + serializer.serializeToString(clonedDoc.documentElement);
    } catch (error) {
      console.error('Error reconstructing HTML:', error);
      throw new Error('Failed to update HTML content');
    }
  };

  const getXPath = (element: Element): string => {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }
    
    const paths: string[] = [];
    let currentElement: Element | null = element;
    
    while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
      let index = 0;
      let sibling = currentElement.previousSibling;
      
      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && 
            (sibling as Element).tagName === currentElement.tagName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      
      const tagName = currentElement.tagName.toLowerCase();
      const pathIndex = index > 0 ? `[${index + 1}]` : '';
      paths.unshift(`${tagName}${pathIndex}`);
      
      currentElement = currentElement.parentElement;
    }
    
    return '/' + paths.join('/');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updatedHTML = reconstructHTML();
      setHtmlContent(updatedHTML);
      
      await onSave(updatedHTML);
      
      toast.success('Changes saved successfully!');
      setMode('preview');
    } catch (error) {
      console.error('Error saving HTML:', error);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg text-[#1c1c60]">
          Your Carousel {mode === 'edit' ? '- Edit Content' : '- Preview'}
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                mode === 'preview'
                  ? 'bg-white text-[#1c1c60] shadow-sm'
                  : 'text-gray-600 hover:text-[#1c1c60]'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Preview</span>
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                mode === 'edit'
                  ? 'bg-white text-[#1c1c60] shadow-sm'
                  : 'text-gray-600 hover:text-[#1c1c60]'
              }`}
            >
              <Code className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </button>
          </div>

          {mode === 'edit' && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#5b81ff] text-white hover:bg-[#4a6fe0]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="p-0">
        {mode === 'preview' ? (
          <div className="relative">
            <iframe
              ref={iframeRef}
              className="w-full border-0 bg-white"
              style={{ minHeight: '600px', height: '70vh' }}
              title="Carousel Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="p-6" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#1c1c60]">
                💡 <strong>Tip:</strong> Expand each testimonial to edit its content. Changes will be reflected in the carousel when you save.
              </p>
            </div>

            {groupedTestimonials.length === 0 ? (
              <div>
                <div className="text-center py-12 text-gray-500">
                  <p>No editable content found.</p>
                  <p className="text-sm mt-2">Debugging information below:</p>
                </div>
                
                {/* Debug Panel */}
                <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3 text-gray-900">Debug Information</h4>
                  <div className="space-y-3 text-xs font-mono">
                    <div>
                      <div className="text-gray-600 mb-1">Testimonial Count:</div>
                      <div className="bg-white p-2 rounded border border-gray-200">{testimonialCount || 'undefined'}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">HTML Length:</div>
                      <div className="bg-white p-2 rounded border border-gray-200">{htmlContent.length} characters</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">HTML Preview (first 1000 chars):</div>
                      <div className="bg-white p-2 rounded border border-gray-200 max-h-40 overflow-auto whitespace-pre-wrap break-all">
                        {htmlContent.substring(0, 1000)}
                      </div>
                    </div>
                    {parsedDoc && (
                      <>
                        <div>
                          <div className="text-gray-600 mb-1">Body Text Content (first 500 chars):</div>
                          <div className="bg-white p-2 rounded border border-gray-200 max-h-32 overflow-auto whitespace-pre-wrap">
                            {parsedDoc.body.textContent?.substring(0, 500) || 'No text content'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Found Elements:</div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            {editableElements.length} editable elements detected
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-3">
                {groupedTestimonials.map((group) => (
                  <AccordionItem 
                    key={`testimonial-${group.testimonialNumber}`} 
                    value={`testimonial-${group.testimonialNumber}`}
                    className="border border-gray-200 rounded-lg px-4 bg-gray-50"
                  >
                    <AccordionTrigger className="text-[#1c1c60] hover:no-underline">
                      <span className="text-base">
                        Testimonial {group.testimonialNumber}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2 pb-4">
                        {group.elements.map((element) => (
                          <div key={element.id}>
                            <Label htmlFor={element.id} className="text-sm text-gray-900">
                              {element.label}
                            </Label>
                            {element.type === 'textarea' ? (
                              <Textarea
                                id={element.id}
                                value={element.value}
                                onChange={(e) => updateElement(element.id, e.target.value)}
                                rows={3}
                                className="mt-1.5"
                              />
                            ) : (
                              <Input
                                id={element.id}
                                value={element.value}
                                onChange={(e) => updateElement(element.id, e.target.value)}
                                className="mt-1.5"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        )}
      </div>
    </div>
  );
};