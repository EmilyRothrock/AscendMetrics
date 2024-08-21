import ConstructionIcon from "@mui/icons-material/Construction";
import { Badge, BadgeProps, styled } from "@mui/material";

interface UnderConstructionBadgeProps {
  children: React.ReactNode; // Explicitly include children
}

const UnderConstructionBadge: React.FC<UnderConstructionBadgeProps> = ({
  children,
}) => {
  const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    "& .MuiBadge-badge": {
      left: 30,
      top: 5,
    },
  }));

  return (
    <StyledBadge
      badgeContent={<ConstructionIcon sx={{ fontSize: "small" }} />}
      color="secondary"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {children}
    </StyledBadge>
  );
};

export default UnderConstructionBadge;
