/*global chrome*/
import React, {useState} from "react";
import "./App.css";
import images from "./images";


import { Box, Container, Grid, TextField, Button, Paper, Avatar } from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

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
    const builtprompt = await buildPromt(prompt);
    console.log(builtprompt);
    try {
      // const completion = await openai.createCompletion({
      //   model: "text-davinci-003",
      //   prompt: buildPromt(prompt),
      //   max_tokens: 100,
      //   temperature: 0.7
      // });
      const completion = 
      await axios.post('/', {
        headers: {
          'Origin': '*',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
        },
        body: {
          "prompt": builtprompt
        }
      })
      .then((response) => {
        console.log(response.data);
        setResponse(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      })

    } catch (e) {
      alert("Error: ", e);
      setIsLoading(false);
    }
   }
   
  return (
    <Container>
      <Box sx={{ width: "61%", mt: 4  }}>
        <Grid container>
          <Grid item xs={12}>
          <TextField
            autoFocus
            fullWidth
            label="Tell me briefly what's happening..."
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