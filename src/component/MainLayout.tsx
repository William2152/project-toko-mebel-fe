import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Inventory as InventoryIcon,
  Assessment as ReportIcon,
  AccountCircle as AccountCircleIcon,
  Summarize as SummarizeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/storeRedux";
import { getItem } from "../../app/localStorageSlice";
import { getCurrentUserRole } from "../utils/auth.utils";
import { routePermissions } from "../config/routes.config";
import { UserRole } from "../types/auth.types";

const drawerWidth = 400;

interface MenuItem {
  title: string;
  icon: React.ComponentType;
  path?: string;
  onClick?: () => void;
  subItems?: Array<{
    title: string;
    path: string;
  }>;
}

function MainLayout() {
  const role = getCurrentUserRole();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const ukIcon = 26;
  const ukTitle = 18;
  const ukSubTitle = 14;

  dispatch(getItem("token"));
  const token = useSelector((state: RootState) => state.localStorage.value);

  useEffect(() => {
    if (token == null) navigate("/login");
  }, [token, navigate]);

  const [openMenus, setOpenMenus] = useState({
    project: false,
    stock: false,
    report: false,
    user: false,
    nota: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prevState) => {
      const newState = Object.fromEntries(
        Object.entries(prevState).map(([key]) => [key, false])
      );
      return { ...newState, [menu]: !prevState[menu] };
    });
  };

  // Helper function to check if a route is accessible for current role
  const isRouteAccessible = (path: string): boolean => {
    const route = routePermissions.find(r => path.startsWith(r.path));
    return route ? route.allowedRoles.includes(role as UserRole) : false;
  };

  // Base menu items - will be filtered based on permissions
  const menuItems: MenuItem[] = [
    { 
      title: "Dashboard", 
      icon: DashboardIcon, 
      path: "/dashboard" 
    },
    {
      title: "Project",
      icon: FolderIcon,
      subItems: [
        { title: "Tambah Project", path: "/project/tambah" },
        { title: "Tambah Product", path: "/project/product" },
        { title: "List Project", path: "/project/list" },
      ],
    },
    {
      title: "Stock",
      icon: InventoryIcon,
      subItems: [
        { title: "Master Bahan", path: "/stock/master" },
        { title: "Input Stock Bahan", path: "/stock/catat" },
        { title: "Stock Bahan", path: "/stock/lihat" },
        { title: "Input Pemakaian Bahan", path: "/stock/pemakaian" },
        { title: "List Pemakaian Bahan", path: "/stock/history" },
        { title: "History Bahan Masuk", path: "/stock/history/pemasukkan" },
        { title: "History Bahan Keluar", path: "/stock/history/keluar" },
        { title: "List Bahan Sisa", path: "/stock/bahansisa" },
      ],
    },
    {
      title: "Report",
      icon: ReportIcon,
      subItems: [
        { title: "Laporan HPP", path: "/report/laporan/hpp" },
        { title: "Laporan Nota Per Supplier", path: "/report/laporan/nota-by-supplier" },
        { title: "Laporan Nota Per Tanggal", path: "/report/laporan/nota-by-tanggal" },
        { title: "Laporan Bahan Masuk", path: "/report/laporan/bahan-masuk" },
        { title: "Laporan Bahan Keluar", path: "/report/laporan/bahan-keluar" },
      ],
    },
    {
      title: "Nota",
      icon: SummarizeIcon,
      subItems: [
        { title: "Input Nota", path: "/nota/tambah" },
        { title: "List Nota", path: "/nota/lihat" },
      ],
    },
    {
      title: "User",
      icon: PersonIcon,
      subItems: [
        { title: "Tambah User", path: "/user/tambah" },
        { title: "Tambah Customer / Supplier", path: "/user/cust" },
        { title: "Tambah Karyawan", path: "/user/karyawan" },
      ],
    },
  ];

  // Filter menu items based on role permissions
  const filteredMenuItems = menuItems.map(item => {
    if (item.subItems) {
      const accessibleSubItems = item.subItems.filter(subItem => 
        isRouteAccessible(subItem.path)
      );
      return accessibleSubItems.length > 0 
        ? { ...item, subItems: accessibleSubItems }
        : null;
    }
    return isRouteAccessible(item.path!) ? item : null;
  }).filter((item): item is MenuItem => item !== null);

  const fixedBottomItems = [
    { title: "Profile", icon: AccountCircleIcon, path: "/profile" },
    { title: "Logout", icon: LogoutIcon, path: "/login", onClick: () => localStorage.clear() },
  ];

  const sidebarStyle = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "#bcaaa4",
      color: "white",
      position: "fixed",
    },
  };

  const listItemStyle = {
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(255, 255, 255, 0.16)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.24)",
      },
    },
  };

  const iconStyle = {
    color: "inherit",
    minWidth: 40,
    pl: 5,
    fontSize: ukIcon,
  };

  const getRoleTitle = (role: string | null): string => {
    switch (role) {
      case 'superadmin': return 'Super Admin';
      case 'adminkantor': return 'Admin Kantor';
      case 'adminworkshop': return 'Admin Workshop';
      case 'karyawankantor': return 'Karyawan Kantor';
      case 'karyawanworkshop': return 'Karyawan Workshop';
      default: return 'User';
    }
  };

  return (
    <div>
      <div className="flex">
        <Drawer
          variant="permanent"
          anchor="left"
          sx={sidebarStyle}
        >
          {token && (
            <>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 130, height: 130, mb: 2 }}
                  alt="User Avatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
                />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, mb: 2 }}>
                  {getRoleTitle(role)}
                </Typography>
              </Box>
              <List>
                {filteredMenuItems.map((item) => (
                  <React.Fragment key={item.title}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={item.path || "#"}
                        onClick={item.subItems ? () => toggleMenu(item.title.toLowerCase()) : item.onClick}
                        sx={listItemStyle}
                      >
                        <ListItemIcon sx={iconStyle}>
                          <item.icon style={{ fontSize: ukIcon }} />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ sx: { fontSize: ukTitle } }}
                          sx={{ pl: 2 }}
                          primary={item.title}
                        />
                        {item.subItems && (
                          openMenus[item.title.toLowerCase()] ? <ExpandLess /> : <ExpandMore />
                        )}
                      </ListItemButton>
                    </ListItem>
                    {item.subItems && (
                      <Collapse in={openMenus[item.title.toLowerCase()]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subItems.map((subItem) => (
                            <ListItemButton
                              key={subItem.title}
                              component={NavLink}
                              to={subItem.path}
                              sx={{ ...listItemStyle, pl: 13 }}
                            >
                              <ListItemText
                                primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }}
                                primary={subItem.title}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: "auto", pb: 2 }}>
                <List>
                  {fixedBottomItems.map((item) => (
                    <ListItem disablePadding key={item.title}>
                      <ListItemButton
                        component={NavLink}
                        to={item.path}
                        onClick={item.onClick}
                        sx={listItemStyle}
                      >
                        <ListItemIcon sx={iconStyle}>
                          <item.icon style={{ fontSize: ukIcon }} />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ sx: { fontSize: ukTitle } }}
                          sx={{ pl: 2 }}
                          primary={item.title}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}
        </Drawer>
        <div className="flex-grow p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;