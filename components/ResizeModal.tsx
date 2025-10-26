'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  MeasurementUnit,
  convertUnits,
  validateSize,
  formatMeasurement,
  GRID_COLS,
} from '@/lib/resizeUtils';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ResizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (width: number, height: number) => void;
  currentWidth: number;
  currentHeight: number;
  itemName: string;
  containerWidth?: number;
}

export function ResizeModal({
  isOpen,
  onClose,
  onApply,
  currentWidth,
  currentHeight,
  itemName,
  containerWidth = 1200,
}: ResizeModalProps) {
  const [unit, setUnit] = useState<MeasurementUnit>('grid');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const displayWidth = convertUnits(currentWidth, 'grid', unit, containerWidth);
      const displayHeight = convertUnits(currentHeight, 'grid', unit, containerWidth);
      setWidth(displayWidth.toFixed(2));
      setHeight(displayHeight.toFixed(2));
      setAspectRatio(currentWidth / currentHeight);
      setErrors([]);
    }
  }, [isOpen, currentWidth, currentHeight, unit, containerWidth]);

  const handleUnitChange = (newUnit: MeasurementUnit) => {
    const currentWidthValue = parseFloat(width);
    const currentHeightValue = parseFloat(height);

    if (!isNaN(currentWidthValue) && !isNaN(currentHeightValue)) {
      const newWidth = convertUnits(currentWidthValue, unit, newUnit, containerWidth);
      const newHeight = convertUnits(currentHeightValue, unit, newUnit, containerWidth);
      setWidth(newWidth.toFixed(2));
      setHeight(newHeight.toFixed(2));
    }

    setUnit(newUnit);
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);

    if (maintainAspectRatio && !isNaN(parseFloat(value))) {
      const newWidth = parseFloat(value);
      const newHeight = newWidth / aspectRatio;
      setHeight(newHeight.toFixed(2));
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);

    if (maintainAspectRatio && !isNaN(parseFloat(value))) {
      const newHeight = parseFloat(value);
      const newWidth = newHeight * aspectRatio;
      setWidth(newWidth.toFixed(2));
    }
  };

  const handleApply = () => {
    const widthValue = parseFloat(width);
    const heightValue = parseFloat(height);

    if (isNaN(widthValue) || isNaN(heightValue)) {
      setErrors(['Please enter valid numbers for width and height']);
      return;
    }

    const gridWidth = Math.round(convertUnits(widthValue, unit, 'grid', containerWidth));
    const gridHeight = Math.round(convertUnits(heightValue, unit, 'grid', containerWidth));

    const validation = validateSize(gridWidth, gridHeight);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onApply(gridWidth, gridHeight);
    onClose();
  };

  const getUnitLabel = (u: MeasurementUnit): string => {
    switch (u) {
      case 'grid':
        return 'Grid Units';
      case 'px':
        return 'Pixels';
      case 'in':
        return 'Inches';
      case 'cm':
        return 'Centimeters';
      default:
        return u;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resize: {itemName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Current size: {formatMeasurement(currentWidth, 'grid')} × {formatMeasurement(currentHeight, 'grid')}</p>
              <p className="text-xs">Grid spans {GRID_COLS} columns. Minimum size is 1×1, maximum is {GRID_COLS}×{GRID_COLS}.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Measurement Unit</Label>
            <Select value={unit} onValueChange={(value) => handleUnitChange(value as MeasurementUnit)}>
              <SelectTrigger id="unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">{getUnitLabel('grid')}</SelectItem>
                <SelectItem value="px">{getUnitLabel('px')}</SelectItem>
                <SelectItem value="in">{getUnitLabel('in')}</SelectItem>
                <SelectItem value="cm">{getUnitLabel('cm')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className={errors.length > 0 ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className={errors.length > 0 ? 'border-red-500' : ''}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="aspect-ratio" className="cursor-pointer">Maintain Aspect Ratio</Label>
            <Switch
              id="aspect-ratio"
              checked={maintainAspectRatio}
              onCheckedChange={setMaintainAspectRatio}
            />
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleApply}>
              Apply Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
