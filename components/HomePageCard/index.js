import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Button, CardActions } from "@mui/material";

export default function HomePageCard({ image, title, description }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        height: 400,
        "&:hover": { transform: "scale3d(1.05, 1.05, 1)" },
      }}
    >
      <Image component="img" src={image} alt="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
