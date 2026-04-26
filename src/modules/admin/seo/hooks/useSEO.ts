"use client";

import { useState, useEffect } from "react";
import { seoService } from "../services/seoService";
import { toast } from "sonner";

export const useSEO = () => {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await seoService.fetchConfigs();
      setConfigs(data || []);
    } catch (e: any) {
      toast.error("Failed to fetch SEO configs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateConfig = async (id: string, updates: any) => {
    try {
      await seoService.updateConfig(id, updates);
      toast.success("SEO Config updated");
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const createConfig = async (config: any) => {
    try {
      await seoService.createConfig(config);
      toast.success("New SEO route created");
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      await seoService.deleteConfig(id);
      toast.success("SEO route deleted");
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return {
    configs,
    loading,
    updateConfig,
    createConfig,
    deleteConfig,
    refresh: fetchAll
  };
};
