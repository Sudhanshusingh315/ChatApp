import {
  Stack,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  InputLeftAddon,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
function Signup() {
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
      {/* name */}
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter Your Name" onChange={(e) => setName(e)} />
      </FormControl>
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
      {/* Confirm password */}
      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="sm">
          <Input
            type="password"
            placeholder="Enter Your Password"
            onChange={(e) => setConfirmpassword(e)}
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
            onChange={(e) => console.log(e.target.files[0])}
          />
        </InputGroup>
      </FormControl>
      <Button>submit</Button>
    </VStack>
  );
}

export default Signup;
