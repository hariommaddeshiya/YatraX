import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [latestAdaptation, setLatestAdaptation] = useState(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL 
      : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/');

    const newSocket = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected to SafarAI real-time stream:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected from stream');
      setIsConnected(false);
    });

    newSocket.on('TRIP_ADAPTED', (data) => {
      console.log('[Socket Event] TRIP_ADAPTED received:', data);
      if (data.adaptation) {
        setLatestAdaptation(data.adaptation);
        setLiveAlerts(prev => [data.adaptation, ...prev.slice(0, 9)]);
      }
    });

    newSocket.on('INCIDENT_ALERT', (incident) => {
      console.log('[Socket Event] INCIDENT_ALERT:', incident);
      setLiveAlerts(prev => [{
        id: incident.id,
        timestamp: incident.timestamp,
        triggerType: 'SAFETY_GEOFENCE',
        title: `🚨 Incident Alert: ${incident.triggerType}`,
        message: incident.details,
        actionTaken: incident.recommendedAction
      }, ...prev.slice(0, 9)]);
    });

    newSocket.on('SOS_BROADCAST', (sosData) => {
      console.log('[Socket Event] SOS_BROADCAST:', sosData);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const dismissAdaptation = () => {
    setLatestAdaptation(null);
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      liveAlerts,
      latestAdaptation,
      dismissAdaptation
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
