'use client';

import { useEditor } from '@/hooks/useEditor';
import {  ChevronDown, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { FONT_OPTIONS, FONT_WEIGHTS } from '@/constants/fonts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShapeEditor } from './ShapeEditor';
import { Switch } from './ui/switch';
import { GlowEffect } from '@/types/editor'; // Add this import at the top

// Add this helper function at the top
const scrollToElement = (element: HTMLElement | null) => {
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

import { EditorTabs } from './EditorTabs';

export function EditorTools() {
  return (
    <div className="space-y-6">
      <EditorTabs />
    </div>
  );
}
