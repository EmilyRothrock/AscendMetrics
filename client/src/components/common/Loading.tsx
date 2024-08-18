import { Skeleton, Stack } from "@mui/material";
import React from "react";

const Loading: React.FC = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rounded" width={"100%"} height={"10vh"} />
      <Skeleton variant="rounded" width={"100%"} height={"87vh"} />
    </Stack>
  );
};

export default Loading;
