import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const ListItems = () => {
   const navigate = useNavigate();
   return (
      <div>
         <ListItem
            button
            onClick={() => {
               navigate("/inicio");
            }}
         >
            <ListItemIcon>
               <div className="drawer-icon">
                  <DashboardIcon />
               </div>
            </ListItemIcon>
            <div className="texto-primary">
               <ListItemText primary="Inicio" />
            </div>
         </ListItem>

         <ListItem
            button
            onClick={() => {
               navigate("/mi-perfil");
            }}
         >
            <ListItemIcon>
               <div className="drawer-icon">
                  <PeopleIcon />
               </div>
            </ListItemIcon>
            <div className="texto-primary">
               <ListItemText primary="Mi perfil" />
            </div>
         </ListItem>

         <ListItem
            button
            onClick={() => {
               navigate("/mis-oportunidades");
            }}
         >
            <ListItemIcon>
               <div className="drawer-icon">
                  <AccountBalanceWalletIcon />
               </div>
            </ListItemIcon>
            <div className="texto-primary">
               <ListItemText primary="Mis oportunidades" />
            </div>
         </ListItem>

         <ListItem
            button
            onClick={() => {
               const config = {
                  headers: {
                     Authorization: "Bearer " + sessionStorage.getItem("token"),
                     "Content-Type": "application/json",
                  },
               };
               Axios.post("/user/logout", null, config)
                  .then((res) => {
                     sessionStorage.clear();
                     navigate("/");
                  })
                  .catch((error) => {
                     console.log(error);
                  });
            }}
         >
            <ListItemIcon>
               <div className="drawer-icon">
                  <ExitToAppIcon />
               </div>
            </ListItemIcon>
            <div className="texto-primary">
               <ListItemText primary="Cerrar sesión" />
            </div>
         </ListItem>
      </div>
   );
};
export default ListItems;
