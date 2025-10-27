'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface RefreshIntervalSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const REFRESH_INTERVALS = [
  { value: 30000, label: '30 seconds' },
  { value: 60000, label: '1 minute' },
  { value: 300000, label: '5 minutes' },
  { value: 900000, label: '15 minutes' },
  { value: 1800000, label: '30 minutes' },
  { value: 3600000, label: '1 hour' },
  { value: 14400000, label: '4 hours' },
  { value: 28800000, label: '8 hours' },
  { value: 86400000, label: '24 hours' },
];

export function RefreshIntervalSelector({ value, onChange }: RefreshIntervalSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="refresh-interval">Auto-Refresh Interval</Label>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val, 10))}
      >
        <SelectTrigger id="refresh-interval">
          <SelectValue placeholder="Select interval" />
        </SelectTrigger>
        <SelectContent>
          {REFRESH_INTERVALS.map((interval) => (
            <SelectItem key={interval.value} value={interval.value.toString()}>
              {interval.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        How often this link's live preview should automatically refresh
      </p>
    </div>
  );
}
