import React, { createContext, useState } from 'react';

export const StatusContext = createContext();

const StatusProvider = ({ children }) => {
  const [statuses, setStatuses] = useState([]);

  const addStatus = (newStatus) => {
    console.log('Adding new status:', newStatus);
    setStatuses((prevStatuses) => [newStatus, ...prevStatuses]);
  };

  return (
    <StatusContext.Provider value={{ statuses, setStatuses, addStatus }}>
      {children}
    </StatusContext.Provider>
  );
};

export default StatusProvider;
