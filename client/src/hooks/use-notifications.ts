import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not Supported",
        description: "This browser does not support desktop notifications",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "We'll let you know when you're near a station.",
        });
        
        // Test notification
        new Notification("TTC Tracker Active", {
          body: "You will be notified when approaching stations.",
          icon: "/favicon.png"
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "We can't alert you without notification permissions.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }, [toast]);

  const sendNotification = useCallback((title: string, body: string) => {
    if (permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.png' });
    }
  }, [permission]);

  return { permission, requestPermission, sendNotification };
}
