'use client';

import { Button } from '@/components/ui/button';
import { Squares2X2Icon, CheckIcon } from '@heroicons/react/24/outline';
import { useLinkBoard } from '@/store/useLinkBoard';

export function ArrangeToggle() {
  const { isArrangeMode, setArrangeMode } = useLinkBoard();

  return (
    <Button
      onClick={() => setArrangeMode(!isArrangeMode)}
      variant={isArrangeMode ? 'default' : 'outline'}
      size="sm"
      className="gap-2"
    >
      {isArrangeMode ? (
        <>
          <CheckIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Done</span>
        </>
      ) : (
        <>
          <Squares2X2Icon className="w-4 h-4" />
          <span className="hidden sm:inline">Arrange</span>
        </>
      )}
    </Button>
  );
}
