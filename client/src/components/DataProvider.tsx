import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserDataBundle, Session } from '../types'; // Import your interfaces
import { DateTime } from 'luxon';
import demoData from '../assets/demoData';

// Define the shape of the context's value
interface DataProviderValue {
    userDataBundle: UserDataBundle;
    dateRange: [string, string];
    addSession: (session: Session) => void;
    editSession: (sesion: Session) => void;
    isDateRangeComplete: (startDate: string, endDate: string) => boolean;
}

// Create the context
const DataContext = createContext<DataProviderValue | undefined>(undefined);

// Component to provide the context and manage it with functions
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userDataBundle, setUserDataBundle] = useState<UserDataBundle>({
        sessions: [],
        fingerMetrics: {},
        upperMetrics: {},
        lowerMetrics: {}
    });

    const [dateRange, setDateRange] = useState<[string, string]>(['', '']); // Start and end date

    const updateDateRange = useCallback(() => {
        if (userDataBundle.sessions.length === 0) {
            setDateRange(['', '']); // Reset if no sessions exist
            return;
        }
    
        // Extract dates from sessions and ensure all are valid
        const dates = userDataBundle.sessions
            .map(session => DateTime.fromISO(session.date))
            .filter(date => date.isValid); // Filter out invalid dates
    
        if (dates.length === 0) {
            setDateRange(['', '']); // Reset if no valid dates are found
            return;
        }
    
        const minDate = DateTime.min(...dates).toISODate() || ''; // Use fallback empty string if null
        const maxDate = DateTime.max(...dates).toISODate() || ''; // Use fallback empty string if null
    
        // Update the date range state
        setDateRange([minDate, maxDate]);
    }, [userDataBundle.sessions]); // Dependency on sessions
    
    // Function to update the session in the userDataBundle
    const addSession = useCallback((session: Session) => {
        // TODO: send new session w/ tempID, get actual ID back, set here with that actual ID
        setUserDataBundle(prev => ({
            ...prev,
            sessions: [...prev.sessions, session]
        }));
    }, []);

    const updateUserDataBundle = useCallback((newBundle: UserDataBundle) => {
        // Update the whole userDataBundle with the provided new bundle
        setUserDataBundle(newBundle);
    
        // Update the date range based on the new sessions
        updateDateRange();
    }, [updateDateRange]);
    
    // Function to edit the session in the userDataBundle
    const editSession = useCallback((session: Session) => {
        setUserDataBundle(prev => {
            const updatedSessions = prev.sessions.map(s => s.id === session.id ? session : s);
            return {
                ...prev,
                sessions: updatedSessions
            };
        });
    }, []);
    

    // Function to check if the provided date range is within the complete date range
    const isDateRangeComplete = useCallback((startDate: string, endDate: string): boolean => {
        return DateTime.fromISO(startDate) >= DateTime.fromISO(dateRange[0]) &&
               DateTime.fromISO(endDate) <= DateTime.fromISO(dateRange[1]);
    }, [dateRange]);

    useEffect(() => {
        updateUserDataBundle(demoData);
        console.log(demoData);
    }, [updateUserDataBundle]);

    // Context value
    const value = {
        userDataBundle,
        dateRange,
        addSession,
        editSession,
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
