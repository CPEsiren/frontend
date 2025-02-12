interface DashboardLayout {
  id: string;
  name: string;
  components: ActiveComponentWithGraph[];
}

import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Snackbar,
  Alert,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import useWindowSize from "../hooks/useWindowSize";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TableChartIcon from "@mui/icons-material/TableChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AnalogClock from "../components/DashBoardWidgets/AnalogClock";
import DigitalClock from "../components/DashBoardWidgets/DigitalClock";
import TableComponent from "../components/DashBoardWidgets/TableComponent";
import Graph from "../components/DashBoardWidgets/GraphInDashboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Calendar from "../components/DashBoardWidgets/Calendar";
import EventBlock from "../components/DashBoardWidgets/EventBlock";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { SearchIcon } from "lucide-react";
import DraggableDashboard from "../components/DraggableDashboard";

// Add new interfaces for graph selection
interface GraphSelection {
  graphName: string;
}

interface ActiveComponentWithGraph extends ActiveComponent {
  graphSelection?: GraphSelection;
}

const GraphSelectionDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect: (graphName: string) => void;
}> = ({ open, onClose, onSelect }) => {
  const [availableGraphs, setAvailableGraphs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchGraphs = async () => {
      if (!open) return;

      try {
        const res = await fetch("http://localhost:3000/host", {
          method: "GET",
        });
        if (!res.ok) throw new Error("Failed to fetch hosts");

        const result = await res.json();
        if (
          result.status === "success" &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          const host = result.data[0];

          const now = new Date();
          const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000);

          const dataRes = await fetch(
            `http://127.0.0.1:3000/data/between?startTime=${fifteenMinutesAgo.toISOString()}&endTime=${now.toISOString()}&host_id=${
              host._id
            }`
          );

          if (!dataRes.ok) throw new Error("Failed to fetch graph data");

          const dataResult = await dataRes.json();
          if (
            dataResult.status === "success" &&
            Array.isArray(dataResult.data)
          ) {
            const sortedData = dataResult.data[0].items.sort((a: any, b: any) =>
              a.item_id.item_name.localeCompare(b.item_id.item_name)
            );
            setAvailableGraphs(sortedData);
          }
        }
      } catch (error) {
        console.error("Error fetching graphs:", error);
      }
    };

    fetchGraphs();
  }, [open]);

  const filteredGraphs = availableGraphs.filter((graph) =>
    graph.item_id.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Graph</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search graphs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {filteredGraphs.length > 0 ? (
            filteredGraphs.map((graph) => (
              <ListItem
                key={graph.item_id.item_name}
                onClick={() => onSelect(graph.item_id.item_name)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon>
                  <ShowChartIcon />
                </ListItemIcon>
                <ListItemText
                  primary={graph.item_id.item_name}
                  secondary={`Unit: ${graph.item_id.unit}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="No matching graphs found"
                sx={{ textAlign: "center", color: "text.secondary" }}
              />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

interface ComponentConfig {
  id: string;
  name: string;
  icon: JSX.Element;
  component: React.ComponentType<any>; // Update to accept props
  defaultSize: {
    xs: number;
    sm?: number;
    md?: number;
  };
  allowMultiple: boolean;
}

interface ActiveComponent {
  id: string;
  position: number;
  graphSelection?: {
    graphName: string;
  };
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}
const DASHBOARD_STORAGE_KEY = "dashboard_layout";
const availableComponents: ComponentConfig[] = [
  {
    id: "digitalClock",
    name: "Digital Clock",
    icon: <AccessTimeFilledIcon />,
    component: DigitalClock,
    defaultSize: { xs: 10, sm: 5, md: 4 },
    allowMultiple: false,
  },
  {
    id: "analogClock",
    name: "Analog Clock",
    icon: <AccessTimeIcon />,
    component: AnalogClock,
    defaultSize: { xs: 12, sm: 6, md: 4 },
    allowMultiple: false,
  },
  {
    id: "table",
    name: "Table",
    icon: <TableChartIcon />,
    component: TableComponent,
    defaultSize: { xs: 12, md: 6 },
    allowMultiple: false,
  },
  {
    id: "graph",
    name: "Graph",
    icon: <ShowChartIcon />,
    component: Graph,
    defaultSize: { xs: 12, md: 6 },
    allowMultiple: true,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: <CalendarTodayIcon />,
    component: Calendar,
    defaultSize: { xs: 12, sm: 6, md: 4 },
    allowMultiple: false,
  },
  {
    id: "eventblock",
    name: "Event",
    icon: <NotificationImportantIcon />,
    component: EventBlock,
    defaultSize: { xs: 12, sm: 6, md: 6 },
    allowMultiple: false,
  },
];

const Dashboard = () => {
  const windowSize = useWindowSize();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [componentDialog, setComponentDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const [graphSelectionOpen, setGraphSelectionOpen] = useState(false);
  const [pendingGraphAdd, setPendingGraphAdd] = useState(false);
  const [activeComponents, setActiveComponents] = useState<
    ActiveComponentWithGraph[]
  >(() => {
    try {
      const savedLayout = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      return savedLayout
        ? JSON.parse(savedLayout)
        : [
            { id: "digitalClock", position: 0 },
            { id: "graph1", position: 1 },
          ];
    } catch (error) {
      console.error("Error loading layout:", error);
      return [
        { id: "digitalClock", position: 0 },
        { id: "graph1", position: 1 },
      ];
    }
  });
  const [dashboards, setDashboards] = useState<DashboardLayout[]>(() => {
    try {
      const savedDashboards = localStorage.getItem("dashboards");
      if (savedDashboards) {
        return JSON.parse(savedDashboards);
      }
      // Initialize with default dashboard
      return [
        {
          id: "dashboard1",
          name: "Dashboard 1",
          components: [
            { id: "digitalClock", position: 0 },
            { id: "graph1", position: 1 },
          ],
        },
      ];
    } catch (error) {
      console.error("Error loading dashboards:", error);
      return [
        {
          id: "dashboard1",
          name: "Dashboard 1",
          components: [
            { id: "digitalClock", position: 0 },
            { id: "graph1", position: 1 },
          ],
        },
      ];
    }
  });

  const [currentDashboardId, setCurrentDashboardId] =
    useState<string>("dashboard1");

  const handleDashboardChange = (event: any) => {
    setCurrentDashboardId(event.target.value);
    const dashboard = dashboards.find((d) => d.id === event.target.value);
    if (dashboard) {
      setActiveComponents(dashboard.components);
    }
  };

  const handleAddDashboard = () => {
    if (dashboards.length >= 3) {
      setSnackbar({
        open: true,
        message: "Maximum number of dashboards reached (3)",
        severity: "error",
      });
      return;
    }

    const newDashboardNumber = dashboards.length + 1;
    const newDashboard: DashboardLayout = {
      id: `dashboard${newDashboardNumber}`,
      name: `Dashboard ${newDashboardNumber}`,
      components: [],
    };

    setDashboards((prev) => {
      const updated = [...prev, newDashboard];
      localStorage.setItem("dashboards", JSON.stringify(updated));
      return updated;
    });
    setCurrentDashboardId(newDashboard.id);
    setActiveComponents([]);
  };

  useEffect(() => {
    try {
      setDashboards((prev) => {
        const updated = prev.map((dashboard) => {
          if (dashboard.id === currentDashboardId) {
            return {
              ...dashboard,
              components: activeComponents,
            };
          }
          return dashboard;
        });
        localStorage.setItem("dashboards", JSON.stringify(updated));
        return updated;
      });

      const userRole = localStorage.getItem("userRole");

      if (userRole === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error saving dashboard:", error);
    }
  }, [activeComponents, currentDashboardId]);

  const handleAddComponent = (componentId: string) => {
    const componentConfig = availableComponents.find(
      (c) => c.id === componentId
    );
    if (!componentConfig) return;

    const isAlreadyAdded = activeComponents.some(
      (comp) => comp.id === componentId && !componentConfig.allowMultiple
    );
    if (isAlreadyAdded && !componentConfig.allowMultiple) return;

    // If it's a graph component, show selection dialog
    if (componentId === "graph") {
      setPendingGraphAdd(true);
      setGraphSelectionOpen(true);
      return;
    }

    setActiveComponents((prev) => {
      const newLayout = [...prev, { id: componentId, position: prev.length }];
      return newLayout;
    });
    setComponentDialog(false);
    setSnackbar({
      open: true,
      message: "Widget added successfully",
      severity: "success",
    });
  };

  const handleGraphSelection = (graphName: string) => {
    setActiveComponents((prev) => {
      const newComponent = {
        id: "graph",
        position: prev.length,
        graphSelection: { graphName },
      };
      return [...prev, newComponent];
    });

    setGraphSelectionOpen(false);
    setComponentDialog(false);
    setPendingGraphAdd(false);

    setSnackbar({
      open: true,
      message: "Graph widget added successfully",
      severity: "success",
    });

    // Save to localStorage after updating
    try {
      const updatedLayout = [
        ...activeComponents,
        {
          id: "graph",
          position: activeComponents.length,
          graphSelection: { graphName },
        },
      ];
      localStorage.setItem(
        DASHBOARD_STORAGE_KEY,
        JSON.stringify(updatedLayout)
      );
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  const handleRemoveComponent = (position: number) => {
    setActiveComponents((prev) => {
      const newLayout = prev
        .filter((comp) => comp.position !== position)
        .map((comp, index) => ({
          ...comp,
          position: index,
        }));
      return newLayout;
    });
    setSnackbar({
      open: true,
      message: "Widget removed successfully",
      severity: "success",
    });
  };

  const toggleEdit = () => {
    if (isEditing) {
      try {
        localStorage.setItem(
          DASHBOARD_STORAGE_KEY,
          JSON.stringify(activeComponents)
        );
        setSnackbar({
          open: true,
          message: "Dashboard layout saved successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to save dashboard layout",
          severity: "error",
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const canAddComponent = (componentId: string) => {
    const componentConfig = availableComponents.find(
      (c) => c.id === componentId
    );
    if (!componentConfig) return false;

    if (componentConfig.allowMultiple) return true;

    return !activeComponents.some((comp) => comp.id === componentId);
  };

  const handleReorder = (newLayout: ActiveComponentWithGraph[]) => {
    setActiveComponents(newLayout);
    try {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(newLayout));
      setSnackbar({
        open: true,
        message: "Dashboard layout updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving layout:", error);
      setSnackbar({
        open: true,
        message: "Failed to save dashboard layout",
        severity: "error",
      });
    }
  };

  const renderComponent = (
    activeComp: ActiveComponentWithGraph,
    componentConfig: ComponentConfig,
    index: number
  ) => {
    const Component = componentConfig.component;

    return (
      <Box sx={{ position: "relative", height: "100%" }}>
        {isEditing && (
          <IconButton
            size="small"
            onClick={() => handleRemoveComponent(activeComp.position)}
            sx={{
              position: "absolute",
              right: 2,
              top: 2,
              zIndex: 10,
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
              boxShadow: "0 0 4px rgba(0,0,0,0.1)",
            }}
          >
            <AddIcon
              sx={{
                transform: "rotate(45deg)",
                zIndex: 11,
              }}
            />
          </IconButton>
        )}
        <Component
          graphKey={`graph-${activeComp.position}`}
          graphSelection={activeComp.graphSelection}
        />
      </Box>
    );
  };

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
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight={600}
            color={"#242D5D"}
          >
            DASHBOARD
          </Typography>
          {isAdmin ? (
            <>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Tooltip title={isEditing ? "Save & Done" : "Edit Dashboard"}>
                  <IconButton
                    onClick={toggleEdit}
                    sx={{
                      mr: 1,
                      "&:focus": {
                        outline: "none",
                        border: "none",
                      },
                    }}
                  >
                    {isEditing ? <DoneIcon sx={{}} /> : <EditIcon sx={{}} />}
                  </IconButton>
                </Tooltip>

                {!isEditing && (
                  <>
                    <Select
                      value={currentDashboardId}
                      onChange={handleDashboardChange}
                      sx={{
                        backgroundColor: "white",
                        minWidth: 150,
                        "& .MuiSelect-select": {
                          py: 1,
                        },
                      }}
                    >
                      {dashboards.map((dashboard) => (
                        <MenuItem key={dashboard.id} value={dashboard.id}>
                          {dashboard.name}
                        </MenuItem>
                      ))}
                    </Select>

                    {dashboards.length < 3 && (
                      <Button
                        variant="contained"
                        onClick={handleAddDashboard}
                        sx={{
                          backgroundColor: "#4CAF50",
                          "&:hover": {
                            backgroundColor: "#45a049",
                          },
                        }}
                      >
                        New Dashboard
                      </Button>
                    )}
                  </>
                )}

                {isEditing && (
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => setComponentDialog(true)}
                    sx={{
                      backgroundColor: "#F25A28",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#F37E58",
                      },
                    }}
                  >
                    Add Component
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      )}

      <Box
        sx={{
          width: 1,
          marginTop: 2,
          minHeight: "calc(100vh - 200px)",
          backgroundColor: "#FFFFFB",
          borderRadius: 3,
          p: 3,
        }}
      >
        <DraggableDashboard
          components={availableComponents}
          activeComponents={activeComponents}
          onReorder={handleReorder}
          isEditing={isEditing}
          onRemoveComponent={handleRemoveComponent}
          renderComponent={renderComponent}
        />

        {/* Graph Selection Dialog */}
        <GraphSelectionDialog
          open={graphSelectionOpen}
          onClose={() => {
            setGraphSelectionOpen(false);
            setPendingGraphAdd(false);
          }}
          onSelect={handleGraphSelection}
        />
      </Box>

      {/* Add Component Dialog */}
      <Dialog
        open={componentDialog}
        onClose={() => setComponentDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Component</DialogTitle>
        <DialogContent>
          <List>
            {availableComponents.map((component) => {
              const canAdd = canAddComponent(component.id);
              return (
                <ListItem
                  key={component.id}
                  onClick={() => canAdd && handleAddComponent(component.id)}
                  component="div"
                  sx={{
                    cursor: canAdd ? "pointer" : "not-allowed",
                    opacity: canAdd ? 1 : 0.5,
                    "&:hover": {
                      backgroundColor: canAdd ? "action.hover" : undefined,
                    },
                    pointerEvents: canAdd ? "auto" : "none",
                  }}
                >
                  <ListItemIcon>{component.icon}</ListItemIcon>
                  <ListItemText
                    primary={component.name}
                    secondary={!canAdd ? "Already added" : undefined}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
