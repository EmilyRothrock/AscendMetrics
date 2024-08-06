import ControlPanel from "./ControlPanel";
import { ControlPanelProvider } from "./ControlPanelContext";
import SessionCardsContainer from "./SessionsCardContainer";

const SessionsManagerPage = () => {
    return (
        <ControlPanelProvider>
            <ControlPanel/>
            <SessionCardsContainer/>
        </ControlPanelProvider>
    );
}

export default SessionsManagerPage;