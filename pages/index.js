import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import Message from "../components/Message";
import {
  Box,
  Grid,
  TextField,
  Button,
  AppBar,
  Toolbar,
  NoSsr
} from "@mui/material";



export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [hybrids, setHybrids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollableContainerRef = useRef(null);
  //time
  let [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  useEffect(() => {
    if (!timestamp) {
      setTimestamp(new Date().toLocaleString());
    }
    scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
  }, [hybrids, timestamp]);

  async function onSubmit(event, animal = animalInput) {
    event.preventDefault();
    setAnimalInput("");

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

      setHybrids([...hybrids, { text: animal, author: "User", timestamp: currentTimestamp }, { text: data.result, author: "BlackCombAI", timestamp: currentTimestamp2 }]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }


  return (
    <div className={styles.container} style={{ height: "100vh", overflow: "-moz-hidden-unscrollable" }}>
      <Head>
        <title>Speak to BlackCombAI and leave a Review</title>
        <link rel="icon" href="/starb.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <AppBar position="sticky" elevation={0} style={{ backgroundColor: "rgb(240,240,240)", width: "100%", top: 0, alignItems: "center"}}>
            <Toolbar>
              <img src="/starb.png" style={{ width: '100px', margin: "5px"}} />
            </Toolbar>
          </AppBar>
      <div position="sticky" className={styles.scrollableContainer} style={{ width: "100%", height: "100%" }} ref={scrollableContainerRef}>
      <div className={styles.messageContainer}>
    <Message
        author="BlackCombAI"
        text="Hey... ????"
        timestamp={<NoSsr>{timestamp}</NoSsr> }>
      </Message>
    </div>
    <div className={styles.messageContainer}>
      <Message
        author="BlackCombAI"
        text="I noticed you had a recent experience at Blackcomb Mountain ????"
        timestamp={<NoSsr>{timestamp}</NoSsr> }>
      </Message>
    </div>


        {hybrids.map((hybrid, index) => (
          <div key={index} className={styles.messageContainer}>
            <div>
              <div className={hybrid.author === "User" ? styles.animalLeft : styles.animalRight}>
                {hybrid.text}
                <div className={hybrid.author === "User" ? styles.subtextLeft : styles.subtext}>
                  {hybrid.timestamp} - {hybrid.author}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div style={{ clear: "both" }}></div>
      </div>

<AppBar position="sticky" elevation={0} sx={{ backgroundColor: "rgb(240,240,240)", width: "100%" ,top: 'auto', bottom: 0 }}>
      <div position="fixed" className={styles.inputContainer}>
        <form className={styles.form} onSubmit={onSubmit}>
          <input type="text"
            className={styles.input}
            placeholder="Enter message..."
            value={animalInput}
            disabled={isLoading}
            onChange={e => setAnimalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? onSubmit(e) : null}
          />
                  </form>
          <button type="submit" className={styles.submit} disabled={isLoading} onClick={(e) => onSubmit(e)}>
            {isLoading ? "Generating..." : "SUBMIT"}
          </button>


      </div>
      <footer className={styles.footer}>
      </footer>
</AppBar>

    </div >
  );
}
export async function getServerSideProps(context) {
  const timestamp = new Date().toLocaleString();
  return { props: { timestamp } };
}
