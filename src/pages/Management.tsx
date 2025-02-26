import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/system";
import { Pencil, Trash2 } from "lucide-react";
import useWindowSize from "../hooks/useWindowSize";
import ManageComponent from "../components/DeviceManageComponent";
import Usermanagemnet from "../components/UserManagement";

const Management: React.FC = () => {
  const windowSize = useWindowSize();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "admin" || role === "superadmin") {
      setIsAdmin(true);
    }
  }, []);

  const handleEdit = (deviceId: string) => {
    console.log("Edit device:", deviceId);
    // Add your edit logic here
  };

  const handleDelete = (deviceId: string) => {
    console.log("Delete device:", deviceId);
    // Add your delete logic here
  };

  // Column headers for the grid
  const columns = [
    { field: "hostname", label: "Hostname" },
    { field: "ip_address", label: "IP Address" },
    { field: "details.location", label: "Location" },
    { field: "_id", label: "ID" },
    { field: "actions", label: "Actions" },
  ];

  return (
    <>
      {windowSize.width > 600 && (
        <Box
          sx={{
            width: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 5,
            height: "auto",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight={600}
            color={"#242D5D"}
          >
            DEVICE MANAGEMENT
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
            justifyContent: windowSize.width >= 1100 ? "center" : "start",
            alignItems: "center",
            minHeight: "fit-content",
            py: 2,
          }}
        >
          <ManageComponent />
        </Box>
      </Box>

      {isAdmin ? (
        <Box>
          <Box
            sx={{
              width: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 5,
              height: "auto",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              color={"#242D5D"}
            >
              USER MANAGEMENT
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              marginTop: 2,
              height: "auto",
              display: "flex",
              paddingBottom: 5,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                overflowY: "auto",
                backgroundColor: "#FFFFFB",
                borderRadius: 3,
                py: 2,
                px: 3,
                // paddingLeft: 3,
                // paddingRight: 3,
              }}
            >
              <Usermanagemnet />
            </Box>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default Management;
