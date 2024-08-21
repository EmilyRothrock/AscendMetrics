import { Skeleton, Stack } from "@mui/material";

const Loading: React.FC = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rounded" width={"100%"} height={"20vh"} />
      <Skeleton variant="rounded" width={"100%"} height={"77vh"} />
    </Stack>
  );
};

export default Loading;
