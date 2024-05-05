import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconButton } from "@mui/material";

const ThemeSwitcher = ({ toggleColorMode, theme }) => (
  <IconButton
    sx={{
      ml: 1,
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 1,
    }}
    onClick={toggleColorMode}
    color="inherit"
  >
    {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
  </IconButton>
);

export default ThemeSwitcher;
