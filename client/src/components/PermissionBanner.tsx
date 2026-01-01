import { Bell, BellOff } from "lucide-react";

interface PermissionBannerProps {
  status: NotificationPermission;
  onRequest: () => void;
}

export function PermissionBanner({ status, onRequest }: PermissionBannerProps) {
  if (status === 'granted') return null;

  return (
    <div className="bg-primary/5 border-b border-primary/10 px-4 py-3">
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {status === 'denied' ? <BellOff size={16} /> : <Bell size={16} />}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-foreground">Enable Alerts</p>
            <p className="text-muted-foreground text-xs">Get notified when near a station</p>
          </div>
        </div>
        
        {status !== 'denied' && (
          <button
            onClick={onRequest}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all"
          >
            Allow
          </button>
        )}
        
        {status === 'denied' && (
          <span className="text-xs text-muted-foreground italic px-2">
            Blocked in settings
          </span>
        )}
      </div>
    </div>
  );
}
