import * as React from 'react';
import { NavLink } from "react-router-dom"
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={NavLink} to="/">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/create">
      <ListItemIcon>
      <AddToPhotosIcon />
      </ListItemIcon>
      <ListItemText primary="Create Events" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/joined">
      <ListItemIcon>
      <FormatListNumberedIcon />
      </ListItemIcon>
      <ListItemText primary="Joined Events" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/owned">
      <ListItemIcon>
      <FormatListNumberedIcon />
      </ListItemIcon>
      <ListItemText primary="Your Events" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/token">
      <ListItemIcon>
        <AccountBalanceIcon />
      </ListItemIcon>
      <ListItemText primary="Token" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/shop">
      <ListItemIcon>
      <AddShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Shop" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/purchased">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Purchased" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/withdraw">
      <ListItemIcon>
        <AttachMoneyIcon />
      </ListItemIcon>
      <ListItemText primary="Withdraw" />
    </ListItemButton>
  </React.Fragment>
);

