import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserDataBundle, Session } from '../types';
import { DateTime } from 'luxon';
import demoData from '../assets/demoData';

interface DataProviderValue {
    userDataBundle: UserDataBundle;
    dateRange: [string, string];
    addSession: (session: Session) => void;
    editSession: (session: Session) => void;
    isDateRangeComplete: (startDate: string, endDate: string) => boolean;
}

const DataContext = createContext<DataProviderValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userDataBundle, setUserDataBundle] = useState<UserDataBundle>(demoData); // Direct initialization

    const [dateRange, setDateRange] = useState<[string, string]>(['2024-03-17T19:00:00', '2024-03-27T20:00:00']);

    const updateDateRange = useCallback(() => {
        const dates = userDataBundle.sessions.map(session => DateTime.fromISO(session.date)).filter(date => date.isValid);
        if (dates.length === 0) {
            setDateRange(['', '']);
            return;
        }
        const minDate = DateTime.min(...dates).toISODate() || '';
        const maxDate = DateTime.max(...dates).toISODate() || '';
        setDateRange([minDate, maxDate]);
    }, [userDataBundle.sessions]);

    const addSession = useCallback((session: Session) => {
        setUserDataBundle(prev => ({ ...prev, sessions: [...prev.sessions, session] }));
    }, []);

    const editSession = useCallback((session: Session) => {
        setUserDataBundle(prev => ({
            ...prev,
            sessions: prev.sessions.map(s => s.id === session.id ? session : s)
        }));
    }, []);

    const isDateRangeComplete = useCallback((startDate: string, endDate: string): boolean => {
        return DateTime.fromISO(startDate) >= DateTime.fromISO(dateRange[0]) && DateTime.fromISO(endDate) <= DateTime.fromISO(dateRange[1]);
    }, [dateRange]);

    // Only log when actually needed, separate from state updates
    useEffect(() => {
        console.log("Current UserDataBundle:", userDataBundle);
        console.log("Current Date Range:", dateRange);
    }, [userDataBundle, dateRange]);

    // Context value
    const value = { userDataBundle, dateRange, addSession, editSession, isDateRangeComplete };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
