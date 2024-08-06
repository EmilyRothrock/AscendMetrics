import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SessionSummaryCard from "./SessionSummaryCard";
import { useControlPanel } from "./ControlPanelContext";
import { sortSessions, filterSessions } from "../../utils/sessionUtils";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const SessionCardsContainer = () => {
    const { sortAscending, selectedField, filterValue } = useControlPanel();
    const sessions = useSelector((state: RootState) => state.sessions.sessions);
    const sessionIds = useSelector((state: RootState) => state.sessions.sessionIds);
    const filteredSessionIds = filterSessions(sessionIds, sessions, selectedField, filterValue);
    const sortedSessionIds = sortSessions(filteredSessionIds, sessions, selectedField, sortAscending);

    const [displayedSessions, setDisplayedSessions] = useState<number[]>([]);
    const [sessionIndex, setSessionIndex] = useState(0);
    const sessionStep = 10;

    useEffect(() => {
        setDisplayedSessions(sortedSessionIds.slice(0, sessionStep));
        setSessionIndex(sessionStep);
    }, [sortedSessionIds]);

    const loadMoreSessions = () => {
        const nextIndex = sessionIndex + sessionStep;
        const moreSessions = sortedSessionIds.slice(sessionIndex, nextIndex);
        setDisplayedSessions(prevSessions => [...prevSessions, ...moreSessions]);
        setSessionIndex(nextIndex);
    };

    return (<>
        {displayedSessions.map((id: number) => {
            const session = sessions[id];
            return <SessionSummaryCard key={id} session={session} />;
        })}
        <Button variant="contained" onClick={loadMoreSessions} fullWidth>Load More</Button>
    </>);
}

export default SessionCardsContainer;