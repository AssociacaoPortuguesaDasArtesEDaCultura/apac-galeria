import * as React from "react";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import useCart from "../hooks/useCart";

export default function CustomizedBadges() {
  const navigate = useNavigate();

  const [badge, setBadge] = React.useState(false);

  const { totalItems } = useCart();

  React.useEffect(() => {
    if (totalItems > 0) {
      setBadge(true);
    } else {
      setBadge(false);
    }
  }, [totalItems]);

  return (
    <SpeedDial
      ariaLabel="Icon fixo para chat"
      sx={{ position: "fixed", bottom: 16, left: 16 }}
      icon={
        <Badge
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          variant={badge ? "dot" : ""}
          color="secondary"
        >
          <ShoppingCartIcon sx={{ color: "black" }} />
        </Badge>
      }
      onClick={() => navigate("/cart")}
    />
  );
}
