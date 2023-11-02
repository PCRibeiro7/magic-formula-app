import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Button, CardActions, Divider, Grid } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function HomePageCard({ image, title, description, subtext }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        height: 448,
        "&:hover": { transform: "scale3d(1.05, 1.05, 1)" },
      }}
    >
      <div>
        <Image src={image} alt="green iguana" width={345} />
      </div>
      <CardContent sx={{height:'200px',display:'grid'}}>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Divider sx={{ margin: "8px", width:'75%',justifySelf:'center' }} />
        <Grid sx={{ display: "flex", justifyContent: "space-evenly" , marginTop:'4px'}}>
          {subtext.map((rule) => (
            <Typography
              key={rule.indicator}
              variant="body2"
              color="text.secondary"
              display={"inline"}
            >
              {rule.direction === "high" ? (
                <ArrowUpwardIcon
                  fontSize="small"
                  sx={{ verticalAlign: "sub" }}
                />
              ) : (
                <ArrowDownwardIcon
                  fontSize="small"
                  sx={{ verticalAlign: "sub" }}
                />
              )}
              {rule.indicator}
            </Typography>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
