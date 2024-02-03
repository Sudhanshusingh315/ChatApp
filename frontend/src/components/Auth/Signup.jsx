import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
function Signup() {
  const toast = useToast();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const history = useHistory();
  function handleChange() {
    setShow(!show);
  }
  const postDetails = () => {};

  // Handling submit button
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      setLoading(false);
      toast({
        title: "Empty Field",
        description: "Please Input all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Mismatch",
        description: "Password Dost Not Match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/user",
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      console.log(data);
      localStorage.setItem("User-Info", JSON.stringify(data));
      history.push("/chats");
    } catch (err) {
      console.log(err.message);
      toast({
        title: "Error Occured",
        description: "Error Occured,Enable to sing in",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      {/* name */}
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      {/* email */}
      <FormControl id="email" isRequired>
        <FormLabel>email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      {/* passord */}
      <FormControl id="Password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="sm">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightAddon width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleChange}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightAddon>
        </InputGroup>
      </FormControl>
      {/* Confirm password */}
      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="sm">
          <Input
            type="password"
            placeholder="Enter Your Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      {/* Profile Picture */}
      <FormControl id="pic" isRequired>
        <FormLabel>Profile Picture</FormLabel>
        <InputGroup size="sm">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </InputGroup>
      </FormControl>
      <Button
        isLoading={loading}
        loadingText="Submitting"
        colorScheme="blue"
        variant="outline"
        onClick={() => submitHandler()}
      >
        submit
      </Button>
    </VStack>
  );
}

export default Signup;
