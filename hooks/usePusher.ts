import { useEffect } from 'react';
import { Pusher } from 'pusher-js/react-native';

// Get these from your pusher.com dashboard
const PUSHER_KEY = process.env.EXPO_PUBLIC_PUSHER_KEY || 'your_pusher_key_here';
const PUSHER_CLUSTER = process.env.EXPO_PUBLIC_PUSHER_CLUSTER || 'ap2';

let pusherInstance: Pusher | null = null;

export const getPusherClient = () => {
  if (!pusherInstance) {
    // We are now explicitly invoking the named class constructor correctly decoupled from the module wrapper!
    pusherInstance = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    });
  }
  return pusherInstance;
};

export function usePusherChannel(channels: string | string[], eventName: string, callback: (data: any) => void) {
  useEffect(() => {
    const pusher = getPusherClient();
    const targetChannels = Array.isArray(channels) ? channels : [channels];
    
    // Subscribe and bind to all array channels
    const activeChannels = targetChannels.map(ch => {
      const channel = pusher.subscribe(ch);
      channel.bind(eventName, callback);
      return channel;
    });

    return () => {
      // Unbind and unsubscribe on cleanup
      activeChannels.forEach((channel, index) => {
        channel.unbind(eventName, callback);
        pusher.unsubscribe(targetChannels[index]);
      });
    };
  }, [JSON.stringify(channels), eventName, callback]);
}
