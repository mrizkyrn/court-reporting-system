import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useJobPayment } from '@/lib/hooks/queries/useJobQueries';

interface PaymentSummaryCardProps {
  jobId: string;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

/**
 * Displays the payment breakdown (reporter pay, editor pay, total) for a job.
 */
export function PaymentSummaryCard({ jobId }: PaymentSummaryCardProps) {
  const { data, isLoading } = useJobPayment(jobId);

  const breakdown = data?.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reporter Pay</span>
              <span>{formatIDR(breakdown?.reporterPay ?? 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Editor Pay</span>
              <span>{formatIDR(breakdown?.editorPay ?? 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm font-semibold">
              <span>Total</span>
              <span>{formatIDR(breakdown?.total ?? 0)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}