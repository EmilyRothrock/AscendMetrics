import React from "react";
import ConstructionIcon from '@mui/icons-material/Construction';
import StyledBadge from "./StyledBadge";

interface UnderConstructionBadgeProps {
  children: React.ReactNode; // Explicitly include children
}

const UnderConstructionBadge: React.FC<UnderConstructionBadgeProps> = ({ children }) => {
  return (
    <StyledBadge badgeContent={<ConstructionIcon sx={{ fontSize: 'small' }} />} color="secondary">
      {children}
    </StyledBadge>
  );
}

export default UnderConstructionBadge;