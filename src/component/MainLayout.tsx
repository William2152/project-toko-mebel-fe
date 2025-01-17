import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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

const drawerWidth = 400;

function MainLayout() {
  const role = localStorage.getItem("role");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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

  const menuItemsAdminKantor = [
    { title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    {
      title: "Nota",
      icon: SummarizeIcon,
      subItems: [
        { title: "Input Nota", path: "/nota/tambah" },
        { title: "List Nota", path: "/nota/lihat" },
      ],
    },
    {
      title: "Report",
      icon: ReportIcon,
      subItems: [
        { title: "Laporan HPP", path: "/report/laporan/hpp" },
        { title: "Laporan Nota Per Supplier", path: "/report/laporan/nota-by-supplier" },
        { title: "Laporan Nota Per Tanggal", path: "/report/laporan/nota-by-tanggal" },
      ],
    },
  ];

  const menuItemsKaryawanKantor = [
    { title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    {
      title: "Report",
      icon: ReportIcon,
      subItems: [
        { title: "Laporan HPP", path: "/report/laporan/hpp" },
        { title: "Laporan Nota Per Supplier", path: "/report/laporan/nota-by-supplier" },
        { title: "Laporan Nota Per Tanggal", path: "/report/laporan/nota-by-tanggal" },
      ],
    },
  ];

  const menuItemsAdminWorkshop = [
    { title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
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
        { title: "Laporan Bahan Masuk", path: "/report/laporan/bahan-masuk" },
        { title: "Laporan Bahan Keluar", path: "/report/laporan/bahan-keluar" },
      ],
    },
    {
      title: "User",
      icon: PersonIcon,
      subItems: [
        { title: "Tambah Customer / Supplier", path: "/user/cust" },
        { title: "Tambah Karyawan", path: "/user/karyawan" },
      ],
    },
  ];

  const menuItemsKaryawanWorkshop = [
    { title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    {
      title: "Report",
      icon: ReportIcon,
      subItems: [
        { title: "Laporan HPP", path: "/report/laporan/hpp" },
        { title: "Laporan Bahan Masuk", path: "/report/laporan/bahan-masuk" },
        { title: "Laporan Bahan Keluar", path: "/report/laporan/bahan-keluar" },
      ],
    },
  ];

  const menuItems = [
    { title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
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

  const fixedBottomItems = [
    { title: "Profile", icon: AccountCircleIcon, path: "/profile" },
    { title: "Logout", icon: LogoutIcon, path: "/login", onClick: () => localStorage.clear() },
  ];

  return (
    <div>
      <div className="flex">
        <Drawer
          variant="permanent"
          anchor="left"
          sx={sidebarStyle}
        >
          {role === "superadmin" && token != null && (
            <>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 130, height: 130, mb: 2 }}
                  alt="User Avatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
                />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, mb: 2 }}>
                  Super Admin
                </Typography>
              </Box>
              <List>
                {menuItems.map((item) => (
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
          {role === "adminkantor" && token != null && (
            <>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 130, height: 130, mb: 2 }}
                  alt="User Avatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
                />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, mb: 2 }}>
                  Admin Kantor
                </Typography>
              </Box>
              <List>
                {menuItemsAdminKantor.map((item) => (
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
          {role === "adminworkshop" && token != null && (
            <>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 130, height: 130, mb: 2 }}
                  alt="User Avatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
                />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, mb: 2 }}>
                  Admin Workshop
                </Typography>
              </Box>
              <List>
                {menuItemsAdminWorkshop.map((item) => (
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
          {role === "karyawanworkshop" && token != null && (
            <>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 130, height: 130, mb: 2 }}
                  alt="User Avatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
                />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, mb: 2 }}>
                  Karyawan Workshop
                </Typography>
              </Box>
              <List>
                {menuItemsKaryawanWorkshop.map((item) => (
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
          {role === "karyawankantor" && token != null && (
            <>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 130, height: 130, mb: 2 }}
                  alt="User Avatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
                />
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, mb: 2 }}>
                  Karyawan Kantor
                </Typography>
              </Box>
              <List>
                {menuItemsKaryawanKantor.map((item) => (
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
