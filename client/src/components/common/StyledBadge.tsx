import { styled, Badge, BadgeProps } from "@mui/material";

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
      right: 10,
      top: 10,
    },
}));

export default StyledBadge;