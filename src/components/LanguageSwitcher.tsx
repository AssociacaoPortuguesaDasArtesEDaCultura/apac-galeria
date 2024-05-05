import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const changeLanguageHandler = () =>
    i18n.changeLanguage(i18n.language === "pt" ? "en" : "pt");
  return (
    <Button
      sx={{
        position: "absolute",
        right: 30,
        top: 0,
        zIndex: 1,
      }}
      onClick={() => changeLanguageHandler()}
      color="inherit"
    >
      {i18n.language === "pt" ? "PT" : "EN"}
    </Button>
  );
};

export default LanguageSwitcher;
