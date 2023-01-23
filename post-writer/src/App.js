/*global chrome*/
import React, {useState} from "react";
import "./App.css";

import { Box, Container, Grid, TextField, Button, Paper } from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Configuration, OpenAIApi } from "openai";

function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  
  const openai = new OpenAIApi(configuration);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7
      });
      setResponse(completion.data.choices[0].text);
      setIsLoading(false);
    } catch (e) {
      alert("Error: ", e);
      setIsLoading(false);
    }
   }
   
  return (
    <Container>
      <Box sx={{ width: "100%", mt: 4  }}>
        <Grid container>
          <Grid item xs={12}>
          <TextField
            autoFocus
            fullWidth
            label="Your text"
            variant="outlined"
            multiline
            rows={4}
            margin="normal"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <Button
           fullWidth
           disableElevation
           variant="contained"
           disabled={isLoading}
           onClick={() => handleSubmit()}
           startIcon={
             isLoading && (
               <AutorenewIcon
                 sx={{
                   animation: "spin 2s linear infinite",
                   "@keyframes spin": {
                     "0%": {
                       transform: "rotate(360deg)",
                     },
                     "100%": {
                       transform: "rotate(0deg)",
                     },
                   },
                 }}
               />
             )
           }
          >
           Submit
          </Button>
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12} sx={{mt:3}}>
        <Paper sx={{p:3}}>{response}</Paper>
      </Grid>
    </Container>
  );
}

export default App;