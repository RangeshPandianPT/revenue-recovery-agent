'use client';
import EmptyState from '@/components/EmptyState';

export default function Transactions() {
  return (
    <div className="h-full flex items-center justify-center pt-20">
      <EmptyState 
        title="Transactions Under Development" 
        description="The detailed transaction history view is being polished for the demo."
        actionText="Back to Dashboard"
        onAction={() => window.location.href = '/dashboard'}
      />
    </div>
  );
}
