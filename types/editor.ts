export interface GlowEffect {
  enabled: boolean;
  color: string;
  intensity: number;
}

export interface Position {
  horizontal: number;
  vertical: number;
}

export interface TextSet {
  id: number;
  text: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: Position;
  rotation: number;
  glow?: GlowEffect;
}

export interface ShapeSet {
  id: number;
  type: string;
  color: string;
  width?: number;   // Changed from scale
  height?: number;  // Added height
  opacity: number;
  position: Position;
  rotation: number;
  isFilled: boolean;
  strokeWidth?: number;
  glow?: GlowEffect;
}
