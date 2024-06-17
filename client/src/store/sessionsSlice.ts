import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '../types'; 
import { updateSessionCalculations } from '../utils/metricCalculations';

interface SessionsState {
  sessions: Session[];
}

const initialState: SessionsState = {
  sessions: [
    {
      id: 1,
      completedOn: '2024-03-17T19:00:00', // ISO format
      name: 'Bouldering',
      duration: 2,
      notes: 'slab, cave',
      activities: [
        {
          id: 1,
          name: 'Bouldering',
          startTime: '2024-03-17T19:00:00', // ISO format
          endTime: '2024-03-17T20:00:00', // ISO format
          notes: 'slab',
          duration: 60,
          intensities: {
            fingers: 6,
            upperBody: 6,
            lowerBody: 3
          },
          loads: {
            fingers: 7,
            upperBody: 7.5,
            lowerBody: 2.5
          }
        },
        {
          id: 2,
          name: 'Bouldering',
          startTime: '2024-03-17T20:00:00', // ISO format
          endTime: '2024-03-17T21:00:00', // ISO format
          notes: 'cave',
          duration: 60,
          intensities: {
            fingers: 8,
            upperBody: 9,
            lowerBody: 2
          },
          loads: {
            fingers: 7,
            upperBody: 7.5,
            lowerBody: 2.5
          }
        }
      ],
      loads: {
        fingers: 14,
        upperBody: 15,
        lowerBody: 5
      }
    },
    {
      id: 2,
      completedOn: '2024-03-27T20:00:00', // ISO format
      name: 'Cardio, Bouldering, Power/Strength Endurance',
      duration: 2,
      notes: 'At Slaughter Recreation Center',
      activities: [
        {
          id: 3,
          name: 'Cardio',
          startTime: '2024-03-27T20:00:00', // ISO format
          endTime: '2024-03-27T20:30:00', // ISO format
          notes: 'biking to Slaughter',
          duration: 30,
          intensities: {
            fingers: 0,
            upperBody: 0,
            lowerBody: 8
          },
          loads: {
            fingers: 0,
            upperBody: 0,
            lowerBody: 7
          }
        },
        {
          id: 4,
          name: 'Bouldering',
          startTime: '2024-03-27T20:30:00', // ISO format
          endTime: '2024-03-27T21:30:00', // ISO format
          notes: 'cave',
          duration: 60,
          intensities: {
            fingers: 6,
            upperBody: 6,
            lowerBody: 2
          },
          loads: {
            fingers: 5.25,
            upperBody: 4.75,
            lowerBody: 0
          }
        },
        {
          id: 5,
          name: 'Power/Strength Endurance',
          startTime: '2024-03-27T21:30:00', // ISO format
          endTime: '2024-03-27T22:00:00', // ISO format
          notes: 'felt great on the wall!',
          duration: 30,
          intensities: {
            fingers: 9,
            upperBody: 7,
            lowerBody: 2
          },
          loads: {
            fingers: 5.25,
            upperBody: 4.75,
            lowerBody: 0
          }
        }
      ],
      loads: {
        fingers: 10.5,
        upperBody: 9.5,
        lowerBody: 7
      }
    }
  ],
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    createSession(state, action: PayloadAction<Session>) { // receive session w/o defined duration or loads nor activity duration or loads
      const newSession = action.payload;
      updateSessionCalculations(newSession);
      state.sessions.push(newSession);
      // logic for updating metricsSlice
    },
    updateSession(state, action: PayloadAction<Session>) { // receive session w/o defined duration or loads nor activity duration or loads
      const index = state.sessions.findIndex(session => session.id === action.payload.id);
      if (index !== -1) {
        updateSessionCalculations(action.payload);
        state.sessions[index] = action.payload;
      }
      // logic for updating metricsSlice
    },
    deleteSession(state, action: PayloadAction<number>) {
      state.sessions = state.sessions.filter(session => session.id !== action.payload);
      // logic for updating metricsSlice - all metrics on and after this session's date
    },
  },
});

export const { createSession, updateSession, deleteSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;
