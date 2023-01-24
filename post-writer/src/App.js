/*global chrome*/
import React, {useMemo, useState} from "react";
import ReactDOM from "react-dom";
import "./App.css";
import images from "./images";
import defaultImage from "./images";


import { Box, Container, Grid, TextField, Button, Paper, Avatar } from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Configuration, OpenAIApi } from "openai";

function App() {
  const defaultImage = {
    id: 0, title: 'Select Social Media', description: 'you Should Explain What your post is about.'
}
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(defaultImage);

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);


  const getButtons = () => {
    return images.map((image) => {
      return <Button onClick={() => setSelectedLogo(image)} startIcon={<Avatar src={require(`${ image.src }`)}/>}></Button>
    })
  }

  function buildPromt(prompt) {
    return `Create ${selectedLogo?.description} about ${prompt} based on new trends.`
  }

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: buildPromt(prompt),
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
      <Box sx={{ width: "65%", mt: 4  }}>
        <Grid container>
          <Grid item xs={12}>
          <TextField
            autoFocus
            fullWidth
            label="What is happening in your post, briefly? "
            variant="outlined"
            multiline
            rows={4}
            margin="normal"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          {getButtons()} 
          <Button
           disableElevation
           variant="contained"
           disabled={isLoading || selectedLogo.id == 0}
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
            {selectedLogo.title}
          </Button>
          </Grid>
        </Grid>
      <Grid item xs={12} sx={{mt:3}}>
       { response &&
          <Paper sx={{ p: 4  }}>{response}</Paper>
       }
      </Grid>
      </Box>
    </Container>
  );
}

export default App;