import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import useWindowSize from "../hooks/useWindowSize";
import AccountComponent from "../components/AccountComponent";
import NotificationComponenet from "../components/NotificationComponent";

const Account = () => {
  const windowSize = useWindowSize();
  const role = localStorage.getItem("userRole");

  return (
    <>
      {windowSize.width > 600 && (
        <Box
          sx={{
            width: 1,
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 5,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight={600}
            color={"#242D5D"}
          >
            USERS
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          width: 1,
          marginTop: 2,
          height: "auto",
          display: "flex",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFFFFB",
            flex: 1,
            display: "flex",
            borderRadius: 3,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            minHeight: "fit-content",
            marginBottom: 5,
            height: 1,
            py: 3,
            px: 3,
          }}
        >
          <AccountComponent />
        </Box>
      </Box>
      <Box
        sx={{
          width: 1,
          display: "flex",
          justifyContent: "flex-start",
          mt: 1,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          color={"#242D5D"}
        >
          NOTIFICATION
        </Typography>
      </Box>
      <Box
        sx={{
          width: 1,
          marginTop: 2,
          height: "auto",
          display: "flex",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFFFFB",
            flex: 1,
            display: "flex",
            borderRadius: 3,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            minHeight: "fit-content",
            marginBottom: 5,
            height: 1,
            py: 3,
            px: 3,
          }}
        >
          <NotificationComponenet />
        </Box>
      </Box>
    </>
  );
};

export default Account;
