import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import styled from "@emotion/styled"
import {
  Box,
  Grid,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link,
  Container
} from "@mui/material";

const MessageContainer = styled(Box)`
  width: 100%;
  margin: 8px 0;
  text-align: ${props => props.author === "User" ? "left" : "right"};
  backGroundColor: ${props => props.author === "User" ? "red" : "#e0e0e0"};

`;

const AnimalMessage = styled.div`
  text-align: ${props => props.author === "User" ? "left" : "right"};
  backGroundColor: ${props => props.author === "User" ? "red" : "#e0e0e0"};

  padding: 16px;
  border-radius: 8px;
  font-family: "lato", sans-serif;
`;

const Subtext = styled.div`
  font-size: 12px;
  color: gray;
  font-family: "lato", sans-serif;

`;
export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [hybrids, setHybrids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
  }, [hybrids]);

  async function onSubmit(event, animal = animalInput) {
    event.preventDefault();

    let currentTimestamp = new Date().toLocaleString();
    setHybrids([...hybrids, { text: animal, author: "User", timestamp: currentTimestamp }]);

    try {
      setIsLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      let currentTimestamp2 = new Date().toLocaleString();

      setHybrids([...hybrids, { text: animal, author: "User", timestamp: currentTimestamp }, { text: data.result, author: "RivalAI", timestamp: currentTimestamp2 }]);
      setAnimalInput("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }


  return (
    <Container maxWidth="sm">
      <Head>
        <title>Speak to Rival and leave Reviews</title>
        <link rel="icon" href="/Rival_logo_2x.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AppBar position="static">
            <Toolbar>
              <img src="/Rival_logo_2x.png" style={{ height: '50px' }} />
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12}>
          <Paper variant="outlined" style={{ height: '80vh', overflow: 'auto' }}>
            <MessageContainer>
              <AnimalMessage author="RivalAI">
                <ListItemText
                  primary="I noticed you had a recent experience with one of our products or events 🤔"
                  secondary=
                  "N:OW - RivalAI"
                />
              </AnimalMessage>
              {hybrids.map((hybrid, index) => (
                <AnimalMessage key={index} author={hybrid.author} >
                  <ListItemText
                    primary={
                      hybrid.text
                    }
                    secondary={<Subtext>{hybrid.timestamp} - {hybrid.author}</Subtext>}
                  />
                </AnimalMessage>
              ))}
            </MessageContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper variant="outlined">
            <form onSubmit={onSubmit}>
              <TextField
                fullWidth
                placeholder="Enter input message"
                value={animalInput}
                onChange={e => setAnimalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? onSubmit(e) : null}
              />
              <Button type="submit" variant="contained" color="primary" disabled={isLoading} >
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <footer>
            <Typography variant="body2">
              Powered by <Link href="https://www.rivaltech.com/">Rival</Link>
            </Typography>
          </footer>
        </Grid>
      </Grid>
    </Container>
  );
}
