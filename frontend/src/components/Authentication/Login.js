import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from '../../Context/ChatProvider';

/*
Hooks Used - useState,

*/



const Login = () => {

    // ------- Hooks ----------- //
    const toast = useToast();
    const history = useHistory();
    // useState - React hook use to set the variable
    const [show,setShow] = useState(false);
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [loading, setLoading] = useState(false);
    
    const { 
      changeState,
      setChangeState,
    } = ChatState();
    // --------- Functions -------------- //
    // for hide/show the password
    const handleClick = () => setShow(!show);

    // for handling the submit operation
    const submitHandler = async () => {
      setLoading(true);
      if (!email || !password) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
  
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
  
        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config
        );
  
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setChangeState(!changeState);
        setLoading(false);
        history.push("/chats");
        
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };

    
    return (
        <VStack spacing="5px">
          
          {/* email */}
          <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              value={email}
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          {/* Password */}
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          
          {/* Submit Button */}
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
          >
            Login
          </Button>

          {/* Guest User */}
          <Button
            variant="solid"
            colorScheme='red'
            width='100%'
            onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456");
            }}
          >
            Get Guest User credentials
          </Button>

        </VStack>
    );
}

export default Login