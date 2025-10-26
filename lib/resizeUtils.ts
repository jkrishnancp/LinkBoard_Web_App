export type MeasurementUnit = 'grid' | 'px' | 'cm' | 'in';

export interface ResizeConstraints {
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
}

export const DEFAULT_CONSTRAINTS: ResizeConstraints = {
  minW: 1,
  minH: 1,
  maxW: 12,
  maxH: 12,
};

export const GRID_ROW_HEIGHT = 100;
export const GRID_COLS = 12;
export const PX_PER_INCH = 96;
export const CM_PER_INCH = 2.54;

export function gridToPixels(gridUnits: number, containerWidth: number): number {
  const colWidth = containerWidth / GRID_COLS;
  return gridUnits * colWidth;
}

export function pixelsToGrid(pixels: number, containerWidth: number): number {
  const colWidth = containerWidth / GRID_COLS;
  return Math.round(pixels / colWidth);
}

export function gridToInches(gridUnits: number, containerWidth: number): number {
  const pixels = gridToPixels(gridUnits, containerWidth);
  return pixels / PX_PER_INCH;
}

export function inchesToGrid(inches: number, containerWidth: number): number {
  const pixels = inches * PX_PER_INCH;
  return pixelsToGrid(pixels, containerWidth);
}

export function gridToCentimeters(gridUnits: number, containerWidth: number): number {
  const inches = gridToInches(gridUnits, containerWidth);
  return inches * CM_PER_INCH;
}

export function centimetersToGrid(cm: number, containerWidth: number): number {
  const inches = cm / CM_PER_INCH;
  return inchesToGrid(inches, containerWidth);
}

export function convertUnits(
  value: number,
  fromUnit: MeasurementUnit,
  toUnit: MeasurementUnit,
  containerWidth: number
): number {
  if (fromUnit === toUnit) return value;

  let gridValue: number;

  switch (fromUnit) {
    case 'grid':
      gridValue = value;
      break;
    case 'px':
      gridValue = pixelsToGrid(value, containerWidth);
      break;
    case 'in':
      gridValue = inchesToGrid(value, containerWidth);
      break;
    case 'cm':
      gridValue = centimetersToGrid(value, containerWidth);
      break;
    default:
      gridValue = value;
  }

  switch (toUnit) {
    case 'grid':
      return gridValue;
    case 'px':
      return gridToPixels(gridValue, containerWidth);
    case 'in':
      return gridToInches(gridValue, containerWidth);
    case 'cm':
      return gridToCentimeters(gridValue, containerWidth);
    default:
      return gridValue;
  }
}

export function formatMeasurement(value: number, unit: MeasurementUnit): string {
  const rounded = Math.round(value * 100) / 100;

  switch (unit) {
    case 'grid':
      return `${rounded} grid`;
    case 'px':
      return `${rounded}px`;
    case 'in':
      return `${rounded}"`;
    case 'cm':
      return `${rounded}cm`;
    default:
      return `${rounded}`;
  }
}

export function validateSize(
  width: number,
  height: number,
  constraints: ResizeConstraints = DEFAULT_CONSTRAINTS
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (width < constraints.minW) {
    errors.push(`Width must be at least ${constraints.minW} grid units`);
  }
  if (width > constraints.maxW) {
    errors.push(`Width cannot exceed ${constraints.maxW} grid units`);
  }
  if (height < constraints.minH) {
    errors.push(`Height must be at least ${constraints.minH} grid units`);
  }
  if (height > constraints.maxH) {
    errors.push(`Height cannot exceed ${constraints.maxH} grid units`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
