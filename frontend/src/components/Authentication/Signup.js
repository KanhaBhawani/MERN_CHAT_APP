import { 
  Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast 
} from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';



/*
Hooks - useState, useToast, useHistory
*/

const Signup = () => {

  // ------- Hooks --------- //
    // Toast - used for pop up a message
    const toast = useToast();
    
    // useHistory - 
    const history = useHistory();

    const [show,setShow] = useState(false);
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [confirmpassword,setConfirmpassword] = useState();
    const [pic,setPic] = useState();
    const [Loading, setLoading] = useState(false);

    

    // --------- Functions ---------- //
    const handleClick = () => setShow(!show);



    // post pic on internet
    // used clodinary data base for pic upload
    const postDetails = (pics) => {
      setLoading(true);

      // if not a pic
      if (pics === undefined) {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
      console.log(pics);

      // a valid pic
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();

        // making the data url
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "kanhabhawani");
        fetch("https://api.cloudinary.com/v1_1/kanhabhawani/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
            console.log(data.url.toString());
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
          // throw an error
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
    };


  // ------ Submit Handler ------------- //
  const submitHandler = async () => {
    setLoading(true);

    // checking for errors form user
    if (!name || !email || !password || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {

      // IMP- setting haaders for our req.
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `/api/user`,
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      // Registration succesful
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // setting userInfor to data
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      // pushing the user to chats
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

          {/* Name */}
          <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          {/* Email */}
          <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
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
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {/* Confirm Password */}
          <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Confirm password"
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {/* Profile Picture */}
          <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />
          </FormControl>

          {/* Submit Button */}
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={Loading}
          >
            Sign Up
          </Button>
        </VStack>
    );
};

export default Signup;