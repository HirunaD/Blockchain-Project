import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        error: 'bg-destructive/10 text-destructive border border-destructive/20',
        info: 'bg-primary/10 text-primary border border-primary/20',
        neutral: 'bg-muted text-muted-foreground border border-border',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  pulse?: boolean;
}

export const StatusBadge = ({
  className,
  variant,
  pulse = false,
  children,
  ...props
}: StatusBadgeProps) => {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'error' && 'bg-destructive',
            variant === 'info' && 'bg-primary',
            variant === 'neutral' && 'bg-muted-foreground'
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'error' && 'bg-destructive',
            variant === 'info' && 'bg-primary',
            variant === 'neutral' && 'bg-muted-foreground'
          )} />
        </span>
      )}
      {children}
    </div>
  );
};
