import { Session, Part } from "../types";

const sessions: Session[] = [
  {
    id: 1,
    date: '2024-03-17T19:00:00', // ISO format
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
        intensities: {
          fingers: 6,
          upperBody: 6,
          lowerBody: 3
        }
      },
      { 
        id: 2, 
        name: 'Bouldering', 
        startTime: '2024-03-17T20:00:00', // ISO format
        endTime: '2024-03-17T21:00:00', // ISO format
        notes: 'cave',
        intensities: {
          fingers: 8,
          upperBody: 9,
          lowerBody: 2
        }
      }
    ],
    loads: [
      { part: Part.Fingers, load: 14 },
      { part: Part.UpperBody, load: 15 },
      { part: Part.LowerBody, load: 5 }
    ],
    strains: [
      { part: Part.Fingers, strain: 15 },
      { part: Part.UpperBody, strain: 16 },
      { part: Part.LowerBody, strain: 6 }
    ]
  },
  {
    id: 2,
    date: '2024-03-27T20:00:00', // ISO format
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
        intensities: {
          fingers: 0,
          upperBody: 0,
          lowerBody: 8
        }
      },
      { 
        id: 4, 
        name: 'Bouldering', 
        startTime: '2024-03-27T20:30:00', // ISO format
        endTime: '2024-03-27T21:30:00', // ISO format
        notes: 'cave',
        intensities: {
          fingers: 6,
          upperBody: 6,
          lowerBody: 2
        }
      },
      { 
        id: 5, 
        name: 'Power/Strength Endurance', 
        startTime: '2024-03-27T21:30:00', // ISO format
        endTime: '2024-03-27T22:00:00', // ISO format
        notes: 'felt great on the wall!',
        intensities: {
          fingers: 9,
          upperBody: 7,
          lowerBody: 2
        }
      }
    ],
    loads: [
      { part: Part.Fingers, load: 10.5 },
      { part: Part.UpperBody, load: 9.5 },
      { part: Part.LowerBody, load: 7 }
    ],
    strains: [
      { part: Part.Fingers, strain: 11.5 },
      { part: Part.UpperBody, strain: 10.5 },
      { part: Part.LowerBody, strain: 8 }
    ]
  },
];

export default sessions;
