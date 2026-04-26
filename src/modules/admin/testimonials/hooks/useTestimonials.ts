"use client";

import { useState, useEffect } from "react";
import { testimonialService } from "../services/testimonialService";
import { toast } from "sonner";

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await testimonialService.fetchTestimonials();
      setTestimonials(data || []);
    } catch (e: any) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateTestimonial = async (id: string, updates: any) => {
    try {
      await testimonialService.updateTestimonial(id, updates);
      toast.success("Testimonial updated");
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const createTestimonial = async (testimonial: any) => {
    try {
      await testimonialService.createTestimonial(testimonial);
      toast.success("New testimonial added");
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await testimonialService.deleteTestimonial(id);
      toast.success("Testimonial deleted");
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return {
    testimonials,
    loading,
    updateTestimonial,
    createTestimonial,
    deleteTestimonial,
    refresh: fetchAll
  };
};
