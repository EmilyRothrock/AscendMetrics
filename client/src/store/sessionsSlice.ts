import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity, BodyPartMetrics, Session } from '../types'; 
import { DateTime } from 'luxon';

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
    addSession(state, action: PayloadAction<Session>) { // receive session w/o defined duration or loads nor activity duration or loads
      const newSession = action.payload;
      updateSessionCalculations(newSession);
      state.sessions.push(newSession);
      // logic for updating metricsSlice
    },
    editSession(state, action: PayloadAction<Session>) { // receive session w/o defined duration or loads nor activity duration or loads
      const index = state.sessions.findIndex(session => session.id === action.payload.id);
      if (index !== -1) {
        updateSessionCalculations(action.payload);
        state.sessions[index] = action.payload;
      }
      // logic for updating metricsSlice
    },
    deleteSession(state, action: PayloadAction<Session>) {
      state.sessions = state.sessions.filter(session => session.id !== action.payload.id); // payload is the id
      // logic for updating metricsSlice - all metrics on and after this session's date - lazy load it?
    },
  },
});

export const { addSession, editSession, deleteSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;

function calculateActivityDuration(startTime: string, endTime: string): number {
  // Assuming startTime and endTime are ISO 8601 strings
  const start = DateTime.fromISO(startTime);
  const end = DateTime.fromISO(endTime);
  return end.diff(start, 'hours').hours;
}

function calculateActivityLoad(activity: Activity): BodyPartMetrics {
  const intensities = activity.intensities;
  const duration = activity.duration;
  const newActivityLoads = {
    fingers: intensities.fingers * duration,
    upperBody: intensities.upperBody * duration,
    lowerBody: intensities.lowerBody * duration,
  }
  return newActivityLoads;
}

function updateSessionCalculations(session: Session) {
  session.duration = session.activities.reduce((total, activity) => {
    const activityDuration = calculateActivityDuration(activity.startTime, activity.endTime);
    activity.duration = activityDuration; // Update the activity duration
    return total + activityDuration;
  }, 0);

  // loads must be done after durations have been done for activites.
  session.loads = session.activities.reduce((totalLoads, activity) => {
    const activityLoads = calculateActivityLoad(activity);
    totalLoads.fingers += activityLoads.fingers;
    totalLoads.upperBody += activityLoads.upperBody;
    totalLoads.lowerBody += activityLoads.lowerBody;
    return totalLoads;
  }, { fingers: 0, upperBody: 0, lowerBody: 0 });
}
