'use client';
import EmptyState from '@/components/EmptyState';

export default function Receivables() {
  return (
    <div className="h-full flex items-center justify-center pt-20">
      <EmptyState 
        title="B2B Receivables Under Development" 
        description="The B2B receivables tracking view is being polished for the demo."
        actionText="Back to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
