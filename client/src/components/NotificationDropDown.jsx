import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetOrgNotificationsQuery,
  useDeleteOrgNotificationMutation,
} from "state/api";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Menu, MenuItem, Box } from "@mui/material";

const Notification = ({ id, title, message, onDismiss }) => {
  const handleDismiss = () => {
    onDismiss(id);
  };
  return (
    <div className="notification-item">
      <span className="notification-time">{title}</span>
      <p className="notification-text">{message}</p>
      <button className="dismiss-btn" onClick={handleDismiss}>
        Delete
      </button>
    </div>
  );
};

const NotificationDropDown = () => {
  const [notifications, setNotifications] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const { data } = useGetOrgNotificationsQuery(token);
  const [deleteNotification] = useDeleteOrgNotificationMutation();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDismiss = async (id) => {
    const { data } = await deleteNotification({ id, token });
    // Remove dismissed notification from state
    if (data.success) {
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      handleClose();
    }
    return;
  };

  return (
    <Box>
      <button className="notification-btn" onClick={handleClick}>
        <NotificationsNoneOutlinedIcon sx={{ fontSize: "25px" }} />
        <span className="notification-count">{data ? data.length : 0}</span>
      </button>

      <Menu
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {data &&
          data.map((notification) => (
            <MenuItem key={notification._id}>
              <Notification
                key={notification._id}
                id={notification._id}
                title={notification.title}
                message={notification.message}
                onDismiss={handleDismiss}
              />
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default NotificationDropDown;
