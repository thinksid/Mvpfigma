// Testimonial interface for user input
export interface Testimonial {
  id: string;
  customer_name: string;
  location: string;
  product_service: string;
  photo_url: string;
  use_photo_placeholder: boolean;
  context: string; // max 500 words
  problem: string; // max 500 words
  solution: string; // max 500 words
  technical_result: string; // max 500 words
  meaningful_result: string; // max 500 words
  quote: string; // max 300 words
  use_quote_placeholder: boolean;
}

// CarouselSlide interface for generated preview data
export interface CarouselSlide {
  slide_number: number;
  name?: string | any; // customer name (can be string or object from N8N)
  customer_name?: string | any; // legacy support
  location?: string | any;
  product_service?: string | any;
  photo_url?: string;
  headline?: string;
  challenge?: string;
  solution?: string;
  technical_metric?: string;
  financial_metric?: string;
  farm_context?: string | any; // can be object from N8N
  challenge_section?: string;
  solution_section?: string;
  results?: string[];
  customer_quote?: string;
  // Legacy fields
  context?: string | any;
  problem?: string;
  technical_result?: string;
  meaningful_result?: string;
  quote?: string;
}

// GenerationResponse interface from backend
export interface GenerationResponse {
  generation_id: string;
  html_code: string;
  preview_data: CarouselSlide[];
  testimonial_count: number;
}
