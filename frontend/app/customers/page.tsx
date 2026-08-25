'use client';
import EmptyState from '@/components/EmptyState';

export default function Customers() {
  return (
    <div className="h-full flex items-center justify-center pt-20">
      <EmptyState 
        title="Customers Under Development" 
        description="The customer intelligence view is being polished for the demo."
        actionText="Back to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
