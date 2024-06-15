import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserDataBundle, Session } from '../types'; // Import your interfaces
import { DateTime } from 'luxon';

// Define the shape of the context's value
interface DataProviderValue {
    userDataBundle: UserDataBundle;
    dateRange: [string, string];
    updateSession: (session: Session) => void;
    isDateRangeComplete: (startDate: string, endDate: string) => boolean;
}

// Create the context
const DataContext = createContext<DataProviderValue | undefined>(undefined);

// Component to provide the context
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userDataBundle, setUserDataBundle] = useState<UserDataBundle>({
        sessions: [],
        fingerMetrics: {},
        upperMetrics: {},
        lowerMetrics: {}
    });
    const [dateRange, setDateRange] = useState<[string, string]>(['', '']); // Start and end date

    // Function to update the session in the userDataBundle
    const updateSession = useCallback((session: Session) => {
        setUserDataBundle(prev => {
            const sessionsUpdated = prev.sessions.map(s => s.id === session.id ? session : s);
            return { ...prev, sessions: sessionsUpdated };
        });
    }, []);

    // Function to check if the provided date range is within the complete date range
    const isDateRangeComplete = useCallback((startDate: string, endDate: string): boolean => {
        return DateTime.fromISO(startDate) >= DateTime.fromISO(dateRange[0]) &&
               DateTime.fromISO(endDate) <= DateTime.fromISO(dateArray[1]);
    }, [dateRange]);

    // Context value
    const value = {
        userDataBundle,
        dateRange,
        updateSession,
        isDateRangeComplete
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

// Hook to use the context
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
