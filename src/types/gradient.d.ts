type MeshT = {
  type?: "plane" | "sphere" | "waterPlane";
  animate?: "on" | "off";
  uTime?: number;
  uSpeed?: number;
  uStrength?: number;
  uDensity?: number;
  uFrequency?: number;
  // renamed to Sprial on Framer & shadergradient.co
  uAmplitude?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  reflection?: number;
  wireframe?: boolean;
  shader?: string;
  rotSpringOption?: any;
  posSpringOption?: any;
};

type GradientT = MeshT & {
  control?: "query" | "props";
  isFigmaPlugin?: boolean;
  dampingFactor?: number;

  // View (camera) props
  cAzimuthAngle?: number;
  cPolarAngle?: number;
  // for both plane and waterPlane type
  cDistance?: number;
  // only for sphere type
  cameraZoom?: number;

  // Effect props
  lightType?: "3d" | "env";
  brightness?: number;
  envPreset?: "city" | "dawn" | "lobby";
  grain?: "on" | "off";
  grainBlending?: number;

  // Tool props
  zoomOut?: boolean;
  toggleAxis?: boolean;
  hoverState?: string;

  enableTransition?: boolean;
};
