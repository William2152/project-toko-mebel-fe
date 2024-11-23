import React, { useState } from 'react';
import Navbar from './Navbar';
import { NavLink, Outlet } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReportIcon from '@mui/icons-material/Assessment';

function MainLayout() {
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isStockOpen, setIsStockOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

    const toggleProjectMenu = () => {
        if (isStockOpen) {
            setIsStockOpen(false);
        }
        if (isReportOpen) {
            setIsReportOpen(false);
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
        setIsStockOpen(!isStockOpen);
    };

    const toggleReportMenu = () => {
        if (isProjectOpen) {
            setIsProjectOpen(false);
        }
        if (isStockOpen) {
            setIsStockOpen(false);
        }
        setIsReportOpen(!isReportOpen);
    }

    return (
        <div>
            {/* Navbar at the top */}
            <Navbar />

            {/* Main Content Area with Sidebar and Outlet */}
            <div className="flex">
                {/* Sidebar Drawer */}
                <Drawer
                    variant="permanent"
                    anchor="left"
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                            backgroundColor: '#bcaaa4',
                            color: 'white',
                            position: 'fixed',
                            height: 'calc(100vh - 60px)', // Adjust based on Navbar height
                            top: 60, // Matches Navbar height
                        },
                    }}
                >
                    <List>
                        {/* Dashboard */}
                        <ListItem disablePadding>
                            <ListItemButton component={NavLink} to="/dashboard">
                                <ListItemIcon>
                                    <DashboardIcon style={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>

                        {/* Project with Submenu */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={toggleProjectMenu}>
                                <ListItemIcon>
                                    <FolderIcon style={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText primary="Project" />
                                {isProjectOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={isProjectOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton component={NavLink} to="/project/tambah" sx={{ pl: 4 }}>
                                    <ListItemText primary="Tambah Project" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/project/product" sx={{ pl: 4 }}>
                                    <ListItemText primary="Tambah Product" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/project/settings" sx={{ pl: 4 }}>
                                    <ListItemText primary="Add Team" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Stock */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={toggleStockMenu}>
                                <ListItemIcon>
                                    <InventoryIcon style={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText primary="Stock" />
                                {isStockOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={isStockOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton component={NavLink} to="/stock/catat" sx={{ pl: 4 }}>
                                    <ListItemText primary="Catat Stock Bahan" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/project/details" sx={{ pl: 4 }}>
                                    <ListItemText primary="Lihat Stock" />
                                </ListItemButton>
                                <ListItemButton component={NavLink} to="/project/settings" sx={{ pl: 4 }}>
                                    <ListItemText primary="Input Pemakaian Bahan" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Report */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={toggleReportMenu}>
                                <ListItemIcon>
                                    <ReportIcon style={{ color: 'white' }} />
                                </ListItemIcon>
                                <ListItemText primary="Report" />
                                {isReportOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Collapse in={isReportOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton component={NavLink} to="/project/overview" sx={{ pl: 4 }}>
                                <ListItemText primary="Catat Stock Bahan" />
                            </ListItemButton>
                            <ListItemButton component={NavLink} to="/project/details" sx={{ pl: 4 }}>
                                <ListItemText primary="Lihat Stock" />
                            </ListItemButton>
                            <ListItemButton component={NavLink} to="/project/settings" sx={{ pl: 4 }}>
                                <ListItemText primary="Input Pemakaian Bahan" />
                            </ListItemButton>
                        </List>
                    </Collapse>
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
