import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotesIcon from "@mui/icons-material/NotesOutlined";

export function WalletRules({ ruleDescription }) {
  return (
    <Accordion sx={{ marginBottom: "16px" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">
          <NotesIcon sx={{ verticalAlign: "sub", marginRight: "8px" }} />
          Regras do Ranking:
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography textAlign="start">{ruleDescription}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}
