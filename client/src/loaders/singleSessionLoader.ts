import { LoaderFunctionArgs } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { useData } from '../components/DataProvider';  // Adjust the import path as necessary
import { Session } from '../types';

export async function singleSessionLoader({ params }: LoaderFunctionArgs): Promise<Session> {
  // Use a React hook to access the context (note: this is pseudo-code as hooks cannot actually be run directly in loaders)
  const { userDataBundle } = useData();
  
  // Attempt to find the session in the local context first
  const session = userDataBundle.sessions.find(s => s.id === Number(params.id));

  if (session) {
    return session;
  } else {
    // If not found, fetch from the database
    try {
      const response = await axios.get<Session>(`https://yourapi.com/sessions/${params.id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch session: ${error}`);
    }
  }
}
