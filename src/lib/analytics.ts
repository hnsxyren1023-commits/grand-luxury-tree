import { supabase } from './supabase';

export async function logEvent(eventType: string, metadata: any = {}) {
    try {
        // 1. Get Location Data (Client-side best effort)
        let location = 'Unknown';
        let ip = 'Unknown';

        try {
            // Using a free GeoIP service (Rate limits apply, fallback gracefully)
            // Alternative: use Supabase Edge Functions for reliable IP detection
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
                const data = await res.json();
                location = `${data.city}, ${data.region}, ${data.country_name}`;
                ip = data.ip;
            }
        } catch (e) {
            // Silent fail for geoip
        }

        // 2. Log to Database
        const { error } = await supabase.from('analytics_events').insert([{
            event_type: eventType,
            visitor_ip: ip,
            location: location,
            user_agent: window.navigator.userAgent,
            capsule_id: metadata.capsule_id || null
        }]);

        if (error) console.error('Analytics log error:', error);

    } catch (e) {
        console.error('Analytics system error:', e);
    }
}
