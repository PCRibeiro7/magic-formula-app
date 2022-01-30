import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function WalletRules({ ruleDescription }) {
  return (
    <Accordion sx={{ marginBottom: "16px" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">Regras do Ranking:</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography textAlign="start">
          {ruleDescription}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
