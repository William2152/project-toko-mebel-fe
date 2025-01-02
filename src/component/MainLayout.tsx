import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Box,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReportIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SummarizeIcon from '@mui/icons-material/Summarize';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/storeRedux';
import { getItem } from '../../app/localStorageSlice';

function MainLayout() {
    const role = localStorage.getItem('role');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const ukIcon = 26;
    const ukTitle = 18;
    const ukSubTitle = 14;
    dispatch(getItem('token'));
    const token = useSelector((state: RootState) => state.localStorage.value);
    console.log(token);

    function Redirect() {
        if (token == null)
            navigate('/login');
    }

    useEffect(() => {
        Redirect();
    }, [token])
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isStockOpen, setIsStockOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isNotaOpen, setIsNotaOpen] = useState(false);

    const toggleProjectMenu = () => {
        if (isStockOpen) {
            setIsStockOpen(false);
        }
        if (isReportOpen) {
            setIsReportOpen(false);
        }
        if (isUserOpen) {
            setIsUserOpen(false);
        }
        if (isNotaOpen) {
            setIsNotaOpen(false);
        }
        setIsProjectOpen(!isProjectOpen);
    };

    const toggleStockMenu = () => {
        if (isProjectOpen) {
            setIsProjectOpen(false);
        }
        if (isReportOpen) {
            setIsReportOpen(false);
        }
        if (isUserOpen) {
            setIsUserOpen(false);
        }
        if (isNotaOpen) {
            setIsNotaOpen(false);
        }
        setIsStockOpen(!isStockOpen);
    };

    const toggleReportMenu = () => {
        if (isProjectOpen) {
            setIsProjectOpen(false);
        }
        if (isStockOpen) {
            setIsStockOpen(false);
        }
        if (isUserOpen) {
            setIsUserOpen(false);
        }
        if (isNotaOpen) {
            setIsNotaOpen(false);
        }
        setIsReportOpen(!isReportOpen);
    }

    const toggleUserMenu = () => {
        if (isProjectOpen) {
            setIsProjectOpen(false);
        }
        if (isStockOpen) {
            setIsStockOpen(false);
        }
        if (isReportOpen) {
            setIsReportOpen(false);
        }
        if (isNotaOpen) {
            setIsNotaOpen(false);
        }
        setIsUserOpen(!isUserOpen);
    }

    const toggleNotaMenu = () => {
        if (isProjectOpen) {
            setIsProjectOpen(false);
        }
        if (isStockOpen) {
            setIsStockOpen(false);
        }
        if (isReportOpen) {
            setIsReportOpen(false);
        }
        if (isUserOpen) {
            setIsUserOpen(false);
        }
        setIsNotaOpen(!isNotaOpen);
    }

    return (
        <div>
            {/* Main Content Area with Sidebar and Outlet */}
            <div className="flex">
                {/* Sidebar Drawer */}
                <Drawer
                    variant="permanent"
                    anchor="left"
                    sx={{
                        width: 400,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 400,
                            boxSizing: 'border-box',
                            backgroundColor: '#bcaaa4',
                            color: 'white',
                            position: 'fixed',
                        },
                    }}
                >
                    {role == "superadmin" && token != null ? <>

                        <div className='flex justify-center'>
                            <Box
                                className='flex justify-center items-center'
                                component="img"
                                sx={{
                                    height: 130,
                                    width: 130,
                                    mt: 2,
                                    borderRadius: "50%"
                                }}
                                alt="The house from the offer."
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
                            />
                        </div>
                        <List>
                            {/* Dashboard */}
                            <ListItem disablePadding>
                                <ListItemButton component={NavLink} to="/dashboard"
                                    sx={{ alignItems: "center" }}>
                                    <ListItemIcon sx={{ pl: 5, color: 'white', fontSize: ukIcon }}>
                                        <DashboardIcon style={{ fontSize: ukIcon }} />
                                    </ListItemIcon>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukTitle } }} sx={{ pl: 2 }} primary="Dashboard" />
                                </ListItemButton>
                            </ListItem>

                            {/* Project with Submenu */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={toggleProjectMenu}>
                                    <ListItemIcon sx={{ pl: 5, color: 'white', fontSize: ukIcon }}>
                                        <FolderIcon sx={{ fontSize: ukIcon }} />
                                    </ListItemIcon>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukTitle } }} sx={{ pl: 2 }} primary="Project" />
                                    {isProjectOpen ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={isProjectOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton component={NavLink} to="/project/tambah" sx={{ pl: 13 }}>
                                        <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Tambah Project" />
                                    </ListItemButton>
                                    <ListItemButton component={NavLink} to="/project/product" sx={{ pl: 13 }}>
                                        <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Tambah Product" />
                                    </ListItemButton>
                                    <ListItemButton component={NavLink} to="/project/list" sx={{ pl: 13 }}>
                                        <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="List Project" />
                                    </ListItemButton>
                                </List>
                            </Collapse>

                            {/* Stock */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={toggleStockMenu}>
                                    <ListItemIcon sx={{ pl: 5, color: 'white', fontSize: ukIcon }}>
                                        <InventoryIcon sx={{ fontSize: ukIcon }} style={{ boxSizing: 'border-box' }} />
                                    </ListItemIcon>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukTitle } }} sx={{ pl: 2 }} primary="Stock" />
                                    {isStockOpen ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                            <Collapse in={isStockOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton component={NavLink} to="/stock/master" sx={{ pl: 13 }}>
                                        <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Master Bahan" />
                                    </ListItemButton>
                                    <ListItemButton component={NavLink} to="/stock/catat" sx={{ pl: 13 }}>
                                        <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Catat Stock Bahan" />
                                    </ListItemButton>
                                    <ListItemButton component={NavLink} to="/stock/lihat" sx={{ pl: 13 }}>
                                        <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Lihat Stok Bahan" />
                                    </ListItemButton>
                                    <ListItemButton component={NavLink} to="/stock/catatsisa" sx={{ pl: 13 }}>
                                        <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Catat Sisa Bahan" />
                                    </ListItemButton>
                                    <ListItemButton component={NavLink} to="/project/settings" sx={{ pl: 13 }}>
                                        <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Input Pemakaian Bahan" />
                                    </ListItemButton>
                                </List>
                            </Collapse>

                            {/* Report */}
                            <ListItem disablePadding>
                                <ListItemButton onClick={toggleReportMenu}>
                                    <ListItemIcon sx={{ pl: 5, color: 'white', fontSize: ukIcon }}>
                                        <ReportIcon sx={{ fontSize: ukIcon }} />
                                    </ListItemIcon>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukTitle } }} sx={{ pl: 2 }} primary="Report" />
                                    {isReportOpen ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <Collapse in={isReportOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton component={NavLink} to="/project/overview" sx={{ pl: 13 }}>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Catat Stock Bahan" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/project/details" sx={{ pl: 13 }}>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Lihat Stock" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/project/settings" sx={{ pl: 13 }}>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Input Pemakaian Bahan" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Nota */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={toggleNotaMenu}>
                                <ListItemIcon sx={{ pl: 5, color: 'white', fontSize: ukIcon }}>
                                    <SummarizeIcon sx={{ fontSize: ukIcon }} />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ sx: { fontSize: ukTitle } }} sx={{ pl: 2 }} primary="Nota" />
                                {isNotaOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={isNotaOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton component={NavLink} to="/nota/tambah" sx={{ pl: 13 }}>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Masukkan Nota" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/nota/lihat" sx={{ pl: 13 }}>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Lihat Nota" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* User */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={toggleUserMenu}>
                                <ListItemIcon sx={{ pl: 5, color: 'white', fontSize: ukIcon }}>
                                    <PersonIcon sx={{ fontSize: ukIcon }} />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ sx: { fontSize: ukTitle } }} sx={{ pl: 2 }} primary="User" />
                                {isUserOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={isUserOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton component={NavLink} to="/user/tambah" sx={{ pl: 13 }}>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Tambah User" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/user/cust" sx={{ pl: 13 }}>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Tambah Customer / Supplier" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/user/karyawan" sx={{ pl: 13 }}>
                                    <ListItemText primaryTypographyProps={{ sx: { fontSize: ukSubTitle } }} primary="Tambah Karyawan" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Profile */}
                        <ListItem disablePadding>
                            <ListItemButton component={NavLink} to="/profile"
                                sx={{ alignItems: "center" }}>
                                <ListItemIcon sx={{ pl: 5, color: 'white', fontSize: ukIcon }}>
                                    <AccountCircleIcon style={{ fontSize: ukIcon }} />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ sx: { fontSize: ukTitle } }} sx={{ pl: 2 }} primary="Profile" />
                            </ListItemButton>
                        </ListItem>

                        {/* Logout */}
                        <ListItem disablePadding>
                            <ListItemButton component={NavLink} onClick={() => localStorage.clear()} to="/login"
                                sx={{ alignItems: "center" }}>
                                <ListItemIcon sx={{ pl: 5, color: 'white', fontSize: ukIcon }}>
                                    <LogoutIcon style={{ fontSize: ukIcon }} />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ sx: { fontSize: ukTitle } }} sx={{ pl: 2 }} primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </> : <>

                    </>}
                </Drawer>

                {/* Main Content */}
                <div className="flex-grow p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
