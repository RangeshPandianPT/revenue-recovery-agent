'use client';
import EmptyState from '@/components/EmptyState';

export default function Promises() {
  return (
    <div className="h-full flex items-center justify-center pt-20">
      <EmptyState 
        title="Promise-to-Pay Under Development" 
        description="The Promise-to-Pay tracker is being polished for the demo."
        actionText="Back to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
