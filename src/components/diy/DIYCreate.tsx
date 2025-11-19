import React, { useState, useEffect } from 'react';
import { Navigation } from '../Navigation';
import { ProgressIndicator } from './ProgressIndicator';
import { useDIY } from '../../contexts/DIYContext';
import { Testimonial } from '../../types/diy';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox-simple';
import { Label } from '../ui/label-simple';
import { Button } from '../ui/button-simple';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion-simple';
import { Plus, Trash2, Upload, AlertCircle, User, Image, FileText, AlertTriangle, CheckCircle2, Lightbulb, TrendingUp, MessageSquare } from 'lucide-react';
import { toast } from '../ui/sonner';
import { getDIYSupabaseClient } from '../../utils/supabase/diy-client';
import { trackDIYTestimonialAdded } from '../../utils/analytics';

interface DIYCreateProps {
  onNavigateHome: () => void;
  onNavigateToThermometer: () => void;
  onNavigateToDIY: () => void;
  onNavigateToPricing: () => void;
  onNavigateToDIYProcessing: () => void;
}

// Sample testimonials to pre-fill
const getSampleTestimonials = (): Testimonial[] => [
  {
    id: '1',
    customer_name: 'Tom Harris',
    location: 'Iowa',
    product_service: 'Precision Agriculture Platform',
    photo_url: '',
    use_photo_placeholder: false,
    context: 'Tom manages a 1,200-acre corn and soybean operation in central Iowa. He was struggling with variable yields across different field zones and wanted to optimize his fertilizer application to reduce costs.',
    problem: 'I was applying the same fertilizer rate across all 1,200 acres, even though soil quality varied dramatically. This meant over-fertilizing some areas and under-fertilizing others. I was wasting thousands on inputs and still seeing inconsistent yields.',
    solution: 'I adopted a precision ag platform that uses satellite imagery and soil data to create variable rate application maps. The system integrates with my existing equipment and provides field-specific recommendations.',
    technical_result: 'Reduced fertilizer costs by $42 per acre while maintaining yields. Created variable rate maps for all 1,200 acres in minutes instead of days. Cut input waste by 35% through targeted application.',
    meaningful_result: 'Saved $50,400 in the first season alone on fertilizer costs. My corn yields actually increased by 8 bushels per acre in previously under-fertilized zones. I can now make data-driven decisions instead of guessing.',
    quote: 'This system paid for itself in one season. I wish I had started using precision ag five years ago.',
    use_quote_placeholder: false,
  },
  {
    id: '2',
    customer_name: 'Maria Santos',
    location: 'California Central Valley',
    product_service: 'Irrigation Management System',
    photo_url: '',
    use_photo_placeholder: false,
    context: 'Maria runs a 400-acre almond orchard in California. With increasing water restrictions and rising costs, she needed to optimize irrigation while maintaining tree health and nut quality.',
    problem: 'Water costs were eating into our profit margins, and drought restrictions limited our allocation. I was irrigating on a fixed schedule, which meant overwatering some areas and stressing trees in others. Our water bill was $85,000 annually.',
    solution: 'We installed soil moisture sensors throughout the orchard and implemented an automated irrigation system that adjusts watering based on real-time soil conditions and weather forecasts.',
    technical_result: 'Reduced water usage by 28% across all 400 acres. Automated irrigation scheduling eliminated manual valve adjustments. Cut labor costs by 12 hours per week previously spent on irrigation management.',
    meaningful_result: 'Saved $23,800 on water costs in the first year. Almond yield quality improved because trees received optimal water at critical growth stages. We\'re now compliant with water restrictions while producing better crops.',
    quote: 'We\'re using less water, spending less money, and growing better almonds. The ROI was incredible.',
    use_quote_placeholder: false,
  },
  {
    id: '3',
    customer_name: 'Jake Mitchell',
    location: 'Nebraska',
    product_service: 'Crop Monitoring & Scouting App',
    photo_url: '',
    use_photo_placeholder: false,
    context: 'Jake farms 2,500 acres of wheat and corn across multiple fields in Nebraska. He was struggling to keep track of pest pressure, disease, and crop health across such a large operation with limited scouting time.',
    problem: 'I could only physically scout about 30% of my acres each week. By the time I discovered pest issues or disease, it had already spread. I was making spray decisions with incomplete information and often treating entire fields unnecessarily.',
    solution: 'I started using a crop monitoring app with drone imagery integration. The app flags problem areas using AI, so I only scout where issues are detected. I can track every field from my phone.',
    technical_result: 'Now monitoring 100% of acres weekly instead of 30%. Reduced scouting time from 20 hours to 6 hours per week. Cut unnecessary pesticide applications by 40% through targeted treatment.',
    meaningful_result: 'Caught armyworm infestation 10 days earlier than I would have with manual scouting, saving an estimated $45,000 in crop damage. Reduced chemical costs by $18,000 through spot spraying. I can manage more acres with the same time.',
    quote: 'This app is like having eyes in the sky over every acre. I catch problems early and save money on chemicals.',
    use_quote_placeholder: false,
  },
];

const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const DIYCreate: React.FC<DIYCreateProps> = ({
  onNavigateHome,
  onNavigateToThermometer,
  onNavigateToDIY,
  onNavigateToPricing,
  onNavigateToDIYProcessing,
}) => {
  const { testimonials, setTestimonials } = useDIY();
  const [uploadingPhotos, setUploadingPhotos] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize with sample testimonials if empty
  useEffect(() => {
    if (testimonials.length === 0) {
      setTestimonials(getSampleTestimonials());
    }
  }, []);

  const handleInputChange = (id: string, field: keyof Testimonial, value: any) => {
    setTestimonials(
      testimonials.map(t => t.id === id ? { ...t, [field]: value } : t)
    );
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${id}-${field}`];
      return newErrors;
    });
  };

  // Helper function to check if a field still has sample/placeholder text
  const isSampleText = (testimonialId: string, field: keyof Testimonial): boolean => {
    const testimonial = testimonials.find(t => t.id === testimonialId);
    if (!testimonial) return false;
    
    const currentValue = testimonial[field];
    const sampleTestimonials = getSampleTestimonials();
    const sampleTestimonial = sampleTestimonials.find(t => t.id === testimonialId);
    
    if (sampleTestimonial && currentValue === sampleTestimonial[field]) {
      return true;
    }
    return false;
  };

  // Clear field on focus if it contains placeholder text
  const handleFieldFocus = (id: string, field: keyof Testimonial, e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const testimonial = testimonials.find(t => t.id === id);
    if (!testimonial) return;
    
    const value = testimonial[field];
    // Check if the value matches any of the sample data
    const sampleTestimonials = getSampleTestimonials();
    const sampleTestimonial = sampleTestimonials.find(t => t.id === id);
    
    if (sampleTestimonial && value === sampleTestimonial[field]) {
      // Clear the field if it still has the placeholder/sample text
      handleInputChange(id, field, '');
    }
  };

  const handlePhotoUpload = async (id: string, file: File) => {
    try {
      console.log('Starting photo upload for testimonial:', id);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      setUploadingPhotos(prev => ({ ...prev, [id]: true }));
      
      const supabase = getDIYSupabaseClient();
      const bucketName = 'carousel_pictures';
      
      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      
      console.log('Uploading to bucket:', bucketName, 'as:', fileName);
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);
      
      if (error) {
        console.error('Upload error:', error);
        // Check if it's an RLS policy error
        if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
          throw new Error('Storage permissions not configured. Please disable RLS on the carousel_pictures bucket or add an INSERT policy that allows public uploads.');
        }
        throw error;
      }

      console.log('Upload successful! Data:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('Public URL generated:', publicUrl);

      // Update testimonial state directly
      setTestimonials(prev =>
        prev.map(t => t.id === id ? { 
          ...t, 
          photo_url: publicUrl,
          use_photo_placeholder: false 
        } : t)
      );
      
      // Clear ALL photo-related errors for this testimonial
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${id}-photo`];
        delete newErrors[`${id}-photo_url`];
        console.log('Cleared photo errors for:', id);
        return newErrors;
      });
      
      console.log('Photo upload complete! URL saved to state.');
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhotos(prev => ({ ...prev, [id]: false }));
      console.log('Upload process finished');
    }
  };

  const addTestimonial = () => {
    if (testimonials.length >= 5) {
      toast.error('Maximum 5 testimonials allowed');
      return;
    }

    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      customer_name: '',
      location: '',
      product_service: '',
      photo_url: '',
      use_photo_placeholder: false,
      context: '',
      problem: '',
      solution: '',
      technical_result: '',
      meaningful_result: '',
      quote: '',
      use_quote_placeholder: false,
    };

    setTestimonials([...testimonials, newTestimonial]);
    trackDIYTestimonialAdded(testimonials.length + 1);
  };

  const removeTestimonial = (id: string) => {
    if (testimonials.length <= 3) {
      toast.error('Minimum 3 testimonials required');
      return;
    }
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    testimonials.forEach(testimonial => {
      // Required text fields
      if (!testimonial.customer_name.trim()) {
        newErrors[`${testimonial.id}-customer_name`] = 'Customer name is required';
      }
      if (!testimonial.location.trim()) {
        newErrors[`${testimonial.id}-location`] = 'Location is required';
      }
      if (!testimonial.product_service.trim()) {
        newErrors[`${testimonial.id}-product_service`] = 'Product/Service is required';
      }

      // Photo validation
      if (!testimonial.use_photo_placeholder && !testimonial.photo_url) {
        newErrors[`${testimonial.id}-photo`] = 'Please upload a photo or use placeholder';
      }

      // Textarea fields with word count
      const textFields = [
        { field: 'context', max: 500 },
        { field: 'problem', max: 500 },
        { field: 'solution', max: 500 },
        { field: 'technical_result', max: 500 },
        { field: 'meaningful_result', max: 500 },
      ];

      textFields.forEach(({ field, max }) => {
        const value = testimonial[field as keyof Testimonial] as string;
        if (!value.trim()) {
          newErrors[`${testimonial.id}-${field}`] = `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
        } else if (countWords(value) > max) {
          newErrors[`${testimonial.id}-${field}`] = `Maximum ${max} words allowed`;
        }
      });

      // Quote validation
      if (!testimonial.use_quote_placeholder) {
        if (!testimonial.quote.trim()) {
          newErrors[`${testimonial.id}-quote`] = 'Quote is required or use placeholder';
        } else if (countWords(testimonial.quote) > 300) {
          newErrors[`${testimonial.id}-quote`] = 'Maximum 300 words allowed';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeneratePreview = () => {
    if (validateForm()) {
      onNavigateToDIYProcessing();
    } else {
      toast.error('Please fix all errors before continuing');
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navigation
        onNavigateHome={onNavigateHome}
        onNavigateToThermometer={onNavigateToThermometer}
        onNavigateToDIY={onNavigateToDIY}
        onNavigateToPricing={onNavigateToPricing}
        currentPage="diy"
      />

      {/* Spacer for fixed nav */}
      <div style={{ height: '80px' }} />

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={1} />

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-[#5b81ff]/5 to-[#ebff82]/10 rounded-lg p-6 mb-8 border border-[#5b81ff]/20">
          <p className="text-gray-700 leading-relaxed">
            Add 3-5 customer success stories. The more detail you provide, the better your carousel will be. 
            Each story should highlight the customer's journey from problem to solution to results.
          </p>
        </div>

        {/* Testimonials Forms */}
        <Accordion type="single" collapsible defaultValue="1" className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <AccordionItem
              key={testimonial.id}
              value={testimonial.id}
              className="bg-white rounded-xl shadow-md border-0 overflow-hidden data-[state=open]:border-t-4 data-[state=open]:border-t-[#5b81ff]"
            >
              <div className="px-8 pt-6">
                {/* Header with Accordion Trigger */}
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="flex-1 hover:no-underline">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl text-[#1c1c60]">
                        Testimonial {index + 1}
                      </h3>
                      {testimonial.customer_name && (
                        <span className="text-sm text-gray-500">
                          - {testimonial.customer_name}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  {testimonials.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTestimonial(testimonial.id);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <AccordionContent className="px-8 pb-8 pt-6">
                {/* Basic Information Section */}
                <div className="bg-gradient-to-r from-blue-50/50 to-transparent border-l-4 border-[#5b81ff] rounded-r-lg p-6 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#5b81ff]/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#5b81ff]" />
                    </div>
                    <div>
                      <h4 className="text-[#1c1c60] mb-1">Customer Information</h4>
                      <p className="text-sm text-gray-600">Who are we featuring in this success story?</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor={`${testimonial.id}-name`} className="text-sm mb-2">Customer Name *</Label>
                      <Input
                        id={`${testimonial.id}-name`}
                        value={testimonial.customer_name}
                        onChange={(e) => handleInputChange(testimonial.id, 'customer_name', e.target.value)}
                        placeholder="e.g., Sarah Johnson"
                        className={`bg-white ${
                          isSampleText(testimonial.id, 'customer_name') 
                            ? 'text-gray-400' 
                            : 'text-[#1c1c60]'
                        } ${errors[`${testimonial.id}-customer_name`] ? 'border-red-500' : ''}`}
                        data-error={!!errors[`${testimonial.id}-customer_name`]}
                        onFocus={(e) => handleFieldFocus(testimonial.id, 'customer_name', e)}
                      />
                      {errors[`${testimonial.id}-customer_name`] && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[`${testimonial.id}-customer_name`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`${testimonial.id}-location`} className="text-sm mb-2">Location *</Label>
                      <Input
                        id={`${testimonial.id}-location`}
                        value={testimonial.location}
                        onChange={(e) => handleInputChange(testimonial.id, 'location', e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                        className={`bg-white ${
                          isSampleText(testimonial.id, 'location') 
                            ? 'text-gray-400' 
                            : 'text-[#1c1c60]'
                        } ${errors[`${testimonial.id}-location`] ? 'border-red-500' : ''}`}
                        data-error={!!errors[`${testimonial.id}-location`]}
                        onFocus={(e) => handleFieldFocus(testimonial.id, 'location', e)}
                      />
                      {errors[`${testimonial.id}-location`] && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[`${testimonial.id}-location`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`${testimonial.id}-product`} className="text-sm mb-2">Product/Service *</Label>
                      <Input
                        id={`${testimonial.id}-product`}
                        value={testimonial.product_service}
                        onChange={(e) => handleInputChange(testimonial.id, 'product_service', e.target.value)}
                        placeholder="e.g., Analytics Platform"
                        className={`bg-white ${
                          isSampleText(testimonial.id, 'product_service') 
                            ? 'text-gray-400' 
                            : 'text-[#1c1c60]'
                        } ${errors[`${testimonial.id}-product_service`] ? 'border-red-500' : ''}`}
                        data-error={!!errors[`${testimonial.id}-product_service`]}
                        onFocus={(e) => handleFieldFocus(testimonial.id, 'product_service', e)}
                      />
                      {errors[`${testimonial.id}-product_service`] && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[`${testimonial.id}-product_service`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo Section */}
                <div className="bg-gradient-to-r from-purple-50/50 to-transparent border-l-4 border-purple-400 rounded-r-lg p-6 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Image className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-[#1c1c60] mb-1">Customer Photo</h4>
                      <p className="text-sm text-gray-600">Optional: Add a photo or use our placeholder</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {!testimonial.use_photo_placeholder && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(testimonial.id, file);
                          }}
                          className="hidden"
                          id={`${testimonial.id}-photo`}
                        />
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`${testimonial.id}-photo`)?.click()}
                            disabled={uploadingPhotos[testimonial.id]}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingPhotos[testimonial.id] ? 'Uploading...' : testimonial.photo_url ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                          {testimonial.photo_url && (
                            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
                              <img
                                src={testimonial.photo_url}
                                alt="Customer preview"
                                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-300"
                              />
                              <div className="flex items-center gap-2 text-emerald-700">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm">Photo uploaded</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                      <Checkbox
                        id={`${testimonial.id}-placeholder`}
                        checked={testimonial.use_photo_placeholder}
                        onCheckedChange={(checked) => handleInputChange(testimonial.id, 'use_photo_placeholder', checked)}
                      />
                      <Label htmlFor={`${testimonial.id}-placeholder`} className="cursor-pointer text-sm">
                        Use placeholder photo
                      </Label>
                    </div>
                  </div>
                  {errors[`${testimonial.id}-photo`] && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors[`${testimonial.id}-photo`]}
                    </p>
                  )}
                </div>

                {/* Customer Journey Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#ebff82]/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#1c1c60]" />
                    </div>
                    <div>
                      <h4 className="text-[#1c1c60] mb-1">Customer Journey</h4>
                      <p className="text-sm text-gray-600">Tell the complete story from context to solution</p>
                    </div>
                  </div>

                  <div className="space-y-6 pl-6">
                    {/* Context */}
                    <div className="bg-gradient-to-r from-yellow-50/50 to-transparent border-l-2 border-[#ebff82] rounded-r-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <FileText className="w-4 h-4 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <Label htmlFor={`${testimonial.id}-context`} className="text-sm">Context *</Label>
                              <p className="text-xs text-gray-500 mt-1">Background and situation</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${countWords(testimonial.context) > 500 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                              {countWords(testimonial.context)} / 500 words
                            </span>
                          </div>
                          <Textarea
                            id={`${testimonial.id}-context`}
                            value={testimonial.context}
                            onChange={(e) => handleInputChange(testimonial.id, 'context', e.target.value)}
                            placeholder="Describe the customer's background and situation..."
                            rows={3}
                            className={`mt-2 bg-white ${
                              isSampleText(testimonial.id, 'context') 
                                ? 'text-gray-400' 
                                : 'text-[#1c1c60]'
                            } ${errors[`${testimonial.id}-context`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-context`]}
                            onFocus={(e) => handleFieldFocus(testimonial.id, 'context', e)}
                          />
                          {errors[`${testimonial.id}-context`] && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors[`${testimonial.id}-context`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Problem */}
                    <div className="bg-gradient-to-r from-yellow-50/50 to-transparent border-l-2 border-[#ebff82] rounded-r-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <Label htmlFor={`${testimonial.id}-problem`} className="text-sm">Problem *</Label>
                              <p className="text-xs text-gray-500 mt-1">Challenge or pain point</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${countWords(testimonial.problem) > 500 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                              {countWords(testimonial.problem)} / 500 words
                            </span>
                          </div>
                          <Textarea
                            id={`${testimonial.id}-problem`}
                            value={testimonial.problem}
                            onChange={(e) => handleInputChange(testimonial.id, 'problem', e.target.value)}
                            placeholder="What challenge or pain point were they facing?"
                            rows={3}
                            className={`mt-2 bg-white ${
                              isSampleText(testimonial.id, 'problem') 
                                ? 'text-gray-400' 
                                : 'text-[#1c1c60]'
                            } ${errors[`${testimonial.id}-problem`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-problem`]}
                            onFocus={(e) => handleFieldFocus(testimonial.id, 'problem', e)}
                          />
                          {errors[`${testimonial.id}-problem`] && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors[`${testimonial.id}-problem`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Solution */}
                    <div className="bg-gradient-to-r from-yellow-50/50 to-transparent border-l-2 border-[#ebff82] rounded-r-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <Lightbulb className="w-4 h-4 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <Label htmlFor={`${testimonial.id}-solution`} className="text-sm">Solution *</Label>
                              <p className="text-xs text-gray-500 mt-1">How you solved their problem</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${countWords(testimonial.solution) > 500 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                              {countWords(testimonial.solution)} / 500 words
                            </span>
                          </div>
                          <Textarea
                            id={`${testimonial.id}-solution`}
                            value={testimonial.solution}
                            onChange={(e) => handleInputChange(testimonial.id, 'solution', e.target.value)}
                            placeholder="How did your product/service solve their problem?"
                            rows={3}
                            className={`mt-2 bg-white ${
                              isSampleText(testimonial.id, 'solution') 
                                ? 'text-gray-400' 
                                : 'text-[#1c1c60]'
                            } ${errors[`${testimonial.id}-solution`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-solution`]}
                            onFocus={(e) => handleFieldFocus(testimonial.id, 'solution', e)}
                          />
                          {errors[`${testimonial.id}-solution`] && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors[`${testimonial.id}-solution`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-[#1c1c60] mb-1">Results & Impact</h4>
                      <p className="text-sm text-gray-600">Show the measurable outcomes and real-world impact</p>
                    </div>
                  </div>

                  <div className="space-y-6 pl-6">
                    {/* Technical Result */}
                    <div className="bg-gradient-to-r from-emerald-50/50 to-transparent border-l-2 border-emerald-400 rounded-r-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <Label htmlFor={`${testimonial.id}-technical`} className="text-sm">Technical Result *</Label>
                              <p className="text-xs text-gray-500 mt-1">Quantifiable metrics and improvements</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${countWords(testimonial.technical_result) > 500 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                              {countWords(testimonial.technical_result)} / 500 words
                            </span>
                          </div>
                          <Textarea
                            id={`${testimonial.id}-technical`}
                            value={testimonial.technical_result}
                            onChange={(e) => handleInputChange(testimonial.id, 'technical_result', e.target.value)}
                            placeholder="Quantifiable metrics and technical improvements..."
                            rows={3}
                            className={`mt-2 bg-white ${
                              isSampleText(testimonial.id, 'technical_result') 
                                ? 'text-gray-400' 
                                : 'text-[#1c1c60]'
                            } ${errors[`${testimonial.id}-technical_result`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-technical_result`]}
                            onFocus={(e) => handleFieldFocus(testimonial.id, 'technical_result', e)}
                          />
                          {errors[`${testimonial.id}-technical_result`] && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors[`${testimonial.id}-technical_result`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Meaningful Result */}
                    <div className="bg-gradient-to-r from-emerald-50/50 to-transparent border-l-2 border-emerald-400 rounded-r-lg p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <Label htmlFor={`${testimonial.id}-meaningful`} className="text-sm">Meaningful Result *</Label>
                              <p className="text-xs text-gray-500 mt-1">Real-world business outcomes</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${countWords(testimonial.meaningful_result) > 500 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                              {countWords(testimonial.meaningful_result)} / 500 words
                            </span>
                          </div>
                          <Textarea
                            id={`${testimonial.id}-meaningful`}
                            value={testimonial.meaningful_result}
                            onChange={(e) => handleInputChange(testimonial.id, 'meaningful_result', e.target.value)}
                            placeholder="Real-world impact and business outcomes..."
                            rows={3}
                            className={`mt-2 bg-white ${
                              isSampleText(testimonial.id, 'meaningful_result') 
                                ? 'text-gray-400' 
                                : 'text-[#1c1c60]'
                            } ${errors[`${testimonial.id}-meaningful_result`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-meaningful_result`]}
                            onFocus={(e) => handleFieldFocus(testimonial.id, 'meaningful_result', e)}
                          />
                          {errors[`${testimonial.id}-meaningful_result`] && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors[`${testimonial.id}-meaningful_result`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote Section */}
                <div className="bg-gradient-to-r from-amber-50/50 to-transparent border-l-4 border-amber-400 rounded-r-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-[#1c1c60] mb-1">Customer Quote</h4>
                      <p className="text-sm text-gray-600">Optional: A powerful statement from the customer</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {!testimonial.use_quote_placeholder && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor={`${testimonial.id}-quote`} className="text-sm">Quote *</Label>
                          <span className={`text-xs px-2 py-1 rounded ${countWords(testimonial.quote) > 300 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                            {countWords(testimonial.quote)} / 300 words
                          </span>
                        </div>
                        <Textarea
                          id={`${testimonial.id}-quote`}
                          value={testimonial.quote}
                          onChange={(e) => handleInputChange(testimonial.id, 'quote', e.target.value)}
                          placeholder="A powerful quote from the customer..."
                          rows={2}
                          className={`mt-2 bg-white ${
                            isSampleText(testimonial.id, 'quote') 
                              ? 'text-gray-400' 
                              : 'text-[#1c1c60]'
                          } ${errors[`${testimonial.id}-quote`] ? 'border-red-500' : ''}`}
                          data-error={!!errors[`${testimonial.id}-quote`]}
                          onFocus={(e) => handleFieldFocus(testimonial.id, 'quote', e)}
                        />
                        {errors[`${testimonial.id}-quote`] && (
                          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors[`${testimonial.id}-quote`]}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                      <Checkbox
                        id={`${testimonial.id}-quote-placeholder`}
                        checked={testimonial.use_quote_placeholder}
                        onCheckedChange={(checked) => handleInputChange(testimonial.id, 'use_quote_placeholder', checked)}
                      />
                      <Label htmlFor={`${testimonial.id}-quote-placeholder`} className="cursor-pointer text-sm">
                        Use placeholder quote
                      </Label>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Add Testimonial Button */}
        {testimonials.length < 5 && (
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={addTestimonial}
              className="w-full border-dashed border-2 border-[#5b81ff] text-[#5b81ff] hover:bg-[#5b81ff]/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Testimonial ({testimonials.length}/5)
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-12 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onNavigateToDIY}
          >
            Back
          </Button>
          <Button
            onClick={handleGeneratePreview}
            className="bg-[rgb(91,129,255)] text-[rgb(243,243,243)] hover:bg-[#1c1c60] px-8"
          >
            Generate Preview
          </Button>
        </div>
      </div>
    </div>
  );
};