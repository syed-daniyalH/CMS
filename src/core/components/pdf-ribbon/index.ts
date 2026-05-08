import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// Define a type for your custom props
interface PDFRibbonProps {
  color: string;
}

const PDFRibbon = styled(Box)<PDFRibbonProps>(({ theme, color }) => ({
  backgroundColor: color,  // Access color from props
  position: "absolute",
  color: "white",
  width: 120,
  zIndex: 3,
  textAlign: "center",
  textTransform: "uppercase",
  fontSize: '0.6rem',
  padding: theme.spacing(1, 0),
  "&::before,&::after": {
    content: "''",
    position: "absolute",
    bottom: 0,
    left: 0,
    borderColor: "transparent",
    borderStyle: "solid",
  },
  "&::before": {
    position: "absolute",
    zIndex: -1,
    display: "block",
    border: `5px solid ${color}`,  // Use color from props
  },
  "&::after": {
    position: "absolute",
    zIndex: -1,
    display: "block",
    border: `5px solid ${color}`,  // Use color from props
  },
  transform: "rotate(-45deg)",
  top: 10,
  left: -38,
  right: -31,
}));

export default PDFRibbon;
