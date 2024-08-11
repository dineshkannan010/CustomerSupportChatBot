"use client"
import { useState } from "react"
import { Box, Button, Stack, TextField, AppBar, Toolbar, IconButton, Typography, Container } from "@mui/material"

export default function Home() {
  //messages is for history of messages
  const [messages, setMessages]= useState([
    { role: 'assistant', content:'Hello! I am a Headstarter Support Agent, how can I assist you today?'}
  ])

  // message that is typed in the textbox
  const [message, setMessage]= useState('')

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages)=>[
        ...messages, 
        {role: 'user', content: message},
        { role:'assistant', content: '' },
    ])
    const response= fetch('api/chat', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify([...messages, {role:'user', content: message}])
    }).then(async (res)=> {
      const reader= res.body.getReader()
      const decoder= new TextDecoder()
      let result= ''
      return reader.read().then( function processText({done, value}){
        if (done) {
          return result
        }
        const text= decoder.decode(value || new Uint8Array(), {stream: true})
        console.log(text)
        setMessages((messages) => {
          let lastMessage= messages[messages.length-1]
          let otherMessages= messages.slice(0, messages.length-1)

          return [
            ...otherMessages, 
            {...lastMessage, content: lastMessage.content + text},
          ]
        })
        return reader.read().then(processText)
      })
    })

  }
  
  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      bgcolor={"black"}

    >
       {/* Navbar */}
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Customer Service Bot
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
    <Container sx={{ flexGrow: 1, width: "100%" }} >

      <Stack 
        direction={'column'} 
        width={"1200px"} 
        height={"900px"} 
        border={"1px solid grey"} 
        p={2} 
        flexGrow={1} 
        overflow={"auto"} 
        spacing={3}>
        <Stack 
          direction={'column'} 
          spacing={2} 
          flexGrow={1} 
          overflow={"auto"} 
          maxHeight={"100%"} >
          {
            messages.map((message, index)=>(
              <Box
                key={index}
                display={"flex"}
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
                >
                  <Box
                    bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                    color={"white"}
                    borderRadius={10}
                    p={2}
                  >
                      {message.content}
                  </Box>
                </Box>
            ))
          }
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField 
            label="Message" 
            fullWidth 
            value={message}
            onChange={(e)=> setMessage(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "red", // border color
                },
                "&:hover fieldset": {
                  borderColor: "blue", // border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "green", // border color when focused
                },
                color: "white", // text color
              },
              "& .MuiInputLabel-root": {
                color: "white", // label color
              },
              "& .MuiInputBase-input": {
                color: "white", // input text color
              },
            }}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
      </Container>
    </Box>
  )
}
