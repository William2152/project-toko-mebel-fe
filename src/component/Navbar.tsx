import React, { useState, MouseEvent } from 'react';
import { Menu, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const isMenuOpen = Boolean(anchorEl);

    return (
        <>
            <div className='h-[60px]'></div>
            <div className="bg-[#bcaaa4] fixed top-0 left-0 w-full h-[60px] px-6 lg:px-20 flex items-center justify-between shadow-md z-50">
                <div>Logo</div>

                <div className="flex items-center cursor-pointer" onClick={handleMenuOpen}>
                    <span className="ml-2">Admin Kantor</span>
                    {isMenuOpen ? (
                        <ExpandLessIcon className="ml-1" />
                    ) : (
                        <ExpandMoreIcon className="ml-1" />
                    )}
                </div>

                {/* Popup Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={() => navigate('/login')}>Logout</MenuItem>
                </Menu>
            </div>
        </>
    );
}

export default Navbar;
