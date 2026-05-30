import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NewCalendar from '../../components/NewCalendar';

const GlobalCalendar = () => {
  const location = useLocation();
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    if (location.state) {
      console.log('📅 [GlobalCalendar] Données de notification reçues:', location.state);
      setNotificationData(location.state);
      // Nettoyer le state après utilisation
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col flex-1 overflow-hidden">
      <NewCalendar 
        fillViewport 
        notificationData={notificationData}
      />
    </div>
  );
};

export default GlobalCalendar;
