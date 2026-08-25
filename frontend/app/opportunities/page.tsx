'use client';
import EmptyState from '@/components/EmptyState';

export default function Opportunities() {
  return (
    <div className="h-full flex items-center justify-center pt-20">
      <EmptyState 
        title="Opportunities Under Development" 
        description="The detailed revenue risk opportunities view is being polished for the demo."
        actionText="Back to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
