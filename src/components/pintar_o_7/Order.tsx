import * as React from "react";
import { useTranslation } from "react-i18next";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Box, Divider, Paper, Step, StepLabel, Stepper } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { OrderType } from "../../types/order";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Order(props: { order: OrderType }) {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const theme = useTheme();

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        width: "100%",
      }}
    >
      <Box component={"div"} sx={{ padding: "1rem" }}>
        <Typography sx={{ wordWrap: "break-word" }} variant="h5">
          {t("checkout.orderNr")}
          {props.order._id}
        </Typography>
        <Typography variant="h6">
          ({props.order.date ? props.order.date.toLocaleString() : ""})
        </Typography>
      </Box>
      <Divider />
      <Box component={"div"}>
        {props.order.shipments.map((shipment, index) => (
          <Accordion
            sx={{
              backgroundColor: theme.palette.background.paper,
            }}
            expanded={expanded === shipment._product}
            onChange={handleChange(shipment._product)}
          >
            <AccordionSummary
              aria-controls={`${props.order._id}-${index}-content`}
              id={`${props.order._id}-${index}-header`}
            >
              <Typography>
                {t("checkout.shippmentNr")}
                {shipment._product}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stepper orientation="vertical" activeStep={-1}>
                {shipment.states.map((state, index) => (
                  <Step key={index}>
                    <StepLabel>
                      <Typography>
                        {state.value} - {dayjs(state.date).format("DD/MM/YYYY")}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
}
