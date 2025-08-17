import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Stack
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from './../store/actions/index';
import { Navigate, useNavigate } from "react-router-dom";

function UserMenu() {

  const {user} = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const logOutHandler =() =>{
    dispatch(logOutUser(navigate));
  }

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  // return focus to the button when menu closes
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="user-menu-button"
          aria-controls={open ? "user-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
         <span className="text-white ">{user?.username}</span>
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                   className="bg-teal-700 text-white rounded"
                    autoFocusItem={open}
                    id="user-menu"
                    aria-labelledby="user-menu-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={()=>navigate("/add-product")}>Add Product</MenuItem>
                    <MenuItem onClick={handleClose}>Order</MenuItem>
                    <MenuItem onClick={logOutHandler}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}

export default UserMenu;
