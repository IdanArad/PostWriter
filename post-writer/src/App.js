/*global chrome*/
import React, {useState, useEffect} from "react";
import "./App.css";
import images from "./images";


import { Box, Container, Grid, TextField, Button, Paper, Avatar } from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Configuration, OpenAIApi } from "openai";
import { ThemeProvider, createTheme } from '@mui/system';
import axios from "axios";

function App() {
  const defaultImage = {
    id: 0, title: 'Select', description: 'you Should Explain What your post is about.'
}
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(defaultImage);

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  useEffect(() => {
    try {
      chrome.storage.local.get(null, function (data) {
        if ("prompt" in data) {
          setPrompt(data.prompt);
        }
      });
    } catch (e) {
      console.log("Error due to local state");
    }
  }, []);

  const getButtons = () => {
    return images.map((image) => {
      return <Button onClick={() => setSelectedLogo(image)} startIcon={<Avatar src={require(`${ image.src }`)}/>}></Button>
    })
  }

  function buildPromt(prompt) {
    return `Create ${selectedLogo?.description} about ${prompt} - base the post on ${selectedLogo?.description} trends.`
  }

  async function handleSubmit() {
    setIsLoading(true);
    const builtprompt = await buildPromt(prompt);
    try {
      const completion = 
      await axios.post('https://achzrr77ejdcwzb5tkcy3g3sai0eleli.lambda-url.ap-northeast-1.on.aws/', null, { params: {
        builtprompt
      }})
      .then((response) => {
        console.log(response.data);
        setResponse(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setResponse("Couldn't Reach to Chat GPT, Please try again");
        setIsLoading(false);
        console.log(error);
      })
    } catch (e) {
      alert("Error: ", e);
      setIsLoading(false);
    }
   }
   
  return (
        <Container>
          <Box sx={{ width: "77%", mt: 4  }}>
            <Grid container>
              <Grid item xs={12}>
              <TextField
                autoFocus
                fullWidth
                label="Tell me briefly what's happening, I'll generate for you..."
                variant="outlined"
                multiline
                rows={4}
                margin="normal"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  chrome.storage.local.set({ prompt: e.target.value }); 
                }}
              />
              <Box sx={{ width: "100%", mt: 2  }}>
              {getButtons()} 
              </Box>
              <Box sx={{ width: "100%", mt: 4  }}
              display="flex"
              justifyContent="center"
              alignItems="center">
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
              </Box>
              
              </Grid>
            </Grid>
          <Grid item xs={12} sx={{mt:3, fontsize: 32 }}>
          { response &&
              <Paper  style={{whiteSpace: 'pre-line'}} sx={{ p: 4, color: 'success.main',fontSize:16 }}>{response}</Paper>
          }
          </Grid>
          </Box>
        </Container>
  );
}

export default App;