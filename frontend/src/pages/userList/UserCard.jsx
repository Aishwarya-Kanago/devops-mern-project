import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UserCard({ data, handleDelete }) {
  const theme = useSelector((state) => state.theme.currentTheme);

  return (
    <>
      {data?.map((item, idx) => {
        return (
          <Card
            sx={{ maxWidth: "100%" }}
            className={`user-card ${theme === "dark" && "user-card-dark"}`}
            key={idx}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image={item.profile_pic}
            />
            <CardContent>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "500" }}
                gutterBottom
                variant="h5"
                component="div"
              >
                {item?.username}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "text.secondary",
                }}
                gutterBottom
                variant="h5"
                component="div"
              >
                {item.email}
              </Typography>
              <div className="user-card-flex">
                <Typography
                  variant="body2"
                  sx={{ fontSize: "14px", color: "text.secondary" }}
                >
                  {item.status}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "14px", color: "text.secondary" }}
                >
                  {item.transaction}
                </Typography>
              </div>
            </CardContent>
            <CardActions sx={{ padding: "0 0 16px 0" }}>
              <Link to={"/user/" + item._id}>
                <Button className="edit-button" size="small">
                  Edit
                </Button>
              </Link>
              <Button
                size="small"
                color="error"
                className="delete-button"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </>
  );
}
