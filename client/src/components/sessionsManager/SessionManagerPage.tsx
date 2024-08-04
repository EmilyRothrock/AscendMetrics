import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SessionSummaryCard from "./SessionSummaryCard";

const SessionsManagerPage = () => {
    // display sessions (pagination?)
    // say what range you have
    // prompt fetching of more sessions
    // be able to open session editor
    // filter by date range
    const sessions = useSelector((state: RootState) => state.sessions.sessions);
    const sessionIds = useSelector((state: RootState) => state.sessions.sessionIds);

    return (
        <>
            {sessionIds.map((id: number) => {
                const session = sessions[id];
                return <SessionSummaryCard key={id} session={session} />;
            })}
        </>
    );
}

export default SessionsManagerPage;