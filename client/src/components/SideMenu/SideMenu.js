import React, { useState } from "react";
import clsx from "clsx";
import {
   Drawer,
   IconButton,
   Divider,
   List,
   AppBar,
   Toolbar,
   Typography,
} from "@material-ui/core";
import { ChevronLeft, Menu } from "@material-ui/icons";
import "../../styles/globalStyles.css";
import useStyles from "../SideMenu/styles";
import ListItems from "../SideMenu/ListItems";
import ListItemsAdmin from "../SideMenu/ListItemsAdmin";

const SideMenu = () => {
   const [drawerOpen, setDrawerOpen] = useState(false);
   const userType = sessionStorage.getItem("userType");

   const handleDrawerOpen = () => {
      setDrawerOpen(true);
   };
   const handleDrawerClose = () => {
      setDrawerOpen(false);
   };
   const classes = useStyles();

   return (
      <div>
         <AppBar
            position="absolute"
            color="secondary"
            className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
         >
            <Toolbar className="toolbar">
               <IconButton
                  edge="start"
                  color="primary"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
               >
                  <Menu />
               </IconButton>
               <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  className={classes.title}
               >
                  <p className="texto-primary">Oportunidades Comerciales</p>
               </Typography>
            </Toolbar>
         </AppBar>
         <Drawer anchor="left" open={drawerOpen}>
            <div className="toolbarIcon">
               <IconButton onClick={handleDrawerClose} color="primary">
                  <ChevronLeft />
               </IconButton>
            </div>
            <Divider />
            <List>
               {userType === "admin" ? <ListItemsAdmin /> : <ListItems />}
            </List>
         </Drawer>
      </div>
   );
};

export default SideMenu;
