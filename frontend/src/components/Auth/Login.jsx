import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  useToast,
  InputGroup,
  InputRightAddon,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
function Login() {
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      toast({
        title: "Enter All Fields",
        description: "Enter all the credentials",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/user/login",
        { email, password }
      );
      toast({
        title: "Successful",
        description: "Login Successful",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      localStorage.setItem("User-login", JSON.stringify(data));
      history.push("/chats");
    } catch (err) {
      toast({
        title: "Login Failed",
        description: "Unable to Login",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.log(err.message);
      setLoading(false);

      // write code for errors here
    }
  };
  function handleChange() {
    setShow(!show);
  }
  return (
    <VStack spacing="5px">
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

      <Button
        onClick={() => handleLogin()}
        isLoading={loading}
        loadingText="loging in"
        colorScheme="teal"
        variant="outline"
      >
        Login
      </Button>
    </VStack>
  );
}

export default Login;
