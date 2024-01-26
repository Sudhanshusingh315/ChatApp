import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Button,
} from "@chakra-ui/react";
function Login() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  function handleChange() {
    setShow(!show);
  }
  return (
    <VStack spacing="5px">
      {/* email */}
      <FormControl id="email" isRequired>
        <FormLabel>email</FormLabel>
        <Input placeholder="Enter Your Email" onChange={(e) => setEmail(e)} />
      </FormControl>
      {/* passord */}
      <FormControl id="Password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="sm">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e)}
          />
          <InputRightAddon width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleChange}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightAddon>
        </InputGroup>
      </FormControl>

      <Button>Login</Button>
    </VStack>
  );
}

export default Login;
