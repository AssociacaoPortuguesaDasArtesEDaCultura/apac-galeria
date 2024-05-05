import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box component="div" sx={{ flexGrow: 1, alignItems: "center", py: 10 }}>
      <Typography variant="h1" textAlign="center" fontWeight="bold">
        404
      </Typography>

      <Typography variant="h2" textAlign="center">
        {t("errors.not-found")}
      </Typography>
    </Box>
  );
};

export default NotFound;
