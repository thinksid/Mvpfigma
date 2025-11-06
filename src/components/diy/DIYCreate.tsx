import React, { useState, useEffect } from 'react';
import { Navigation } from '../Navigation';
import { ProgressIndicator } from './ProgressIndicator';
import { useDIY } from '../../contexts/DIYContext';
import { Testimonial } from '../../types/diy';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { Plus, Trash2, Upload, AlertCircle, User, Image, FileText, AlertTriangle, CheckCircle2, Lightbulb, TrendingUp, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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
    customer_name: 'Sarah Johnson',
    location: 'San Francisco, CA',
    product_service: 'Marketing Analytics Platform',
    photo_url: '',
    use_photo_placeholder: true,
    context: 'Sarah runs a mid-sized digital marketing agency with 25 employees. They were struggling to track ROI across multiple client campaigns and needed better data visualization tools.',
    problem: 'Our team was spending 15+ hours per week manually compiling reports from different platforms. We had data scattered across Google Analytics, Facebook Ads, LinkedIn, and email marketing tools with no unified view.',
    solution: 'We implemented the Marketing Analytics Platform which automatically pulls data from all our marketing channels and creates unified dashboards. The setup took just 2 days and required minimal technical knowledge.',
    technical_result: 'Reduced reporting time from 15 hours to 2 hours per week. Automated data integration from 8 different platforms. Generated client-ready reports with one click instead of manual compilation.',
    meaningful_result: 'Our team now focuses on strategy instead of data entry. We can respond to client questions in minutes instead of days. Client satisfaction scores increased by 40% because we provide insights faster.',
    quote: 'This platform gave us back 13 hours per week. That\'s like hiring another team member, except it cost a fraction of the price.',
    use_quote_placeholder: false,
  },
  {
    id: '2',
    customer_name: 'Michael Chen',
    location: 'Austin, TX',
    product_service: 'E-commerce Platform Migration',
    photo_url: '',
    use_photo_placeholder: true,
    context: 'Michael owns an online retail store selling outdoor gear. His legacy platform was slow, difficult to update, and couldn\'t handle mobile traffic effectively.',
    problem: 'Our website was losing 60% of mobile visitors due to slow load times. The checkout process had 7 steps and our cart abandonment rate was 78%. We were losing sales daily.',
    solution: 'We migrated to a modern e-commerce platform with mobile-first design and one-click checkout. The migration was completed over a weekend with zero downtime for customers.',
    technical_result: 'Page load time decreased from 8 seconds to 1.2 seconds. Mobile conversion rate improved by 340%. Cart abandonment dropped from 78% to 45%. Checkout process reduced from 7 steps to 3.',
    meaningful_result: 'Monthly revenue increased by 165% within the first three months. We can now compete with larger retailers on user experience. Customer support tickets about website issues dropped by 80%.',
    quote: 'The ROI was immediate. We made back the entire migration cost in the first month just from improved mobile conversions.',
    use_quote_placeholder: false,
  },
  {
    id: '3',
    customer_name: 'Emily Rodriguez',
    location: 'Seattle, WA',
    product_service: 'Customer Support AI Chatbot',
    photo_url: '',
    use_photo_placeholder: true,
    context: 'Emily manages customer support for a SaaS company with 10,000 active users. Her team of 5 support agents was overwhelmed with repetitive questions about password resets, billing, and basic feature usage.',
    problem: 'Our support team was handling 200+ tickets per day, with 70% being repetitive questions. Average response time was 6 hours. We needed to hire more agents but couldn\'t afford it.',
    solution: 'We implemented an AI chatbot that handles common questions automatically and routes complex issues to human agents. The chatbot learned from our existing support documentation and ticket history.',
    technical_result: 'The chatbot now handles 65% of all support inquiries automatically. Average response time for automated queries is under 30 seconds. Our human agents only handle 70 tickets per day instead of 200.',
    meaningful_result: 'Customer satisfaction scores improved from 3.2 to 4.6 out of 5. Our support team is happier because they work on interesting problems instead of password resets. We avoided hiring 3 additional support agents.',
    quote: 'Our customers get help instantly, our team focuses on complex issues, and we saved $180,000 in hiring costs. It\'s been transformative.',
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

  const handlePhotoUpload = async (id: string, file: File) => {
    try {
      setUploadingPhotos(prev => ({ ...prev, [id]: true }));
      
      // Create bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'testimonial-photos');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('testimonial-photos', {
          public: true,
        });
      }

      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('testimonial-photos')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('testimonial-photos')
        .getPublicUrl(fileName);

      handleInputChange(id, 'photo_url', publicUrl);
      handleInputChange(id, 'use_photo_placeholder', false);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhotos(prev => ({ ...prev, [id]: false }));
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
      use_photo_placeholder: true,
      context: '',
      problem: '',
      solution: '',
      technical_result: '',
      meaningful_result: '',
      quote: '',
      use_quote_placeholder: false,
    };

    setTestimonials([...testimonials, newTestimonial]);
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
        <Accordion type="single" collapsible defaultValue={testimonials[0]?.id} className="space-y-4">
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
                        className={`bg-white ${errors[`${testimonial.id}-customer_name`] ? 'border-red-500' : ''}`}
                        data-error={!!errors[`${testimonial.id}-customer_name`]}
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
                        className={`bg-white ${errors[`${testimonial.id}-location`] ? 'border-red-500' : ''}`}
                        data-error={!!errors[`${testimonial.id}-location`]}
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
                        className={`bg-white ${errors[`${testimonial.id}-product_service`] ? 'border-red-500' : ''}`}
                        data-error={!!errors[`${testimonial.id}-product_service`]}
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
                        <label htmlFor={`${testimonial.id}-photo`}>
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => document.getElementById(`${testimonial.id}-photo`)?.click()}
                            disabled={uploadingPhotos[testimonial.id]}
                            asChild
                          >
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              {uploadingPhotos[testimonial.id] ? 'Uploading...' : testimonial.photo_url ? 'Change Photo' : 'Upload Photo'}
                            </span>
                          </Button>
                        </label>
                        {testimonial.photo_url && (
                          <div className="mt-4">
                            <img
                              src={testimonial.photo_url}
                              alt="Customer"
                              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            />
                          </div>
                        )}
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
                            className={`mt-2 bg-white ${errors[`${testimonial.id}-context`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-context`]}
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
                            className={`mt-2 bg-white ${errors[`${testimonial.id}-problem`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-problem`]}
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
                            className={`mt-2 bg-white ${errors[`${testimonial.id}-solution`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-solution`]}
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
                            className={`mt-2 bg-white ${errors[`${testimonial.id}-technical_result`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-technical_result`]}
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
                            className={`mt-2 bg-white ${errors[`${testimonial.id}-meaningful_result`] ? 'border-red-500' : ''}`}
                            data-error={!!errors[`${testimonial.id}-meaningful_result`]}
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
                          className={`mt-2 bg-white ${errors[`${testimonial.id}-quote`] ? 'border-red-500' : ''}`}
                          data-error={!!errors[`${testimonial.id}-quote`]}
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