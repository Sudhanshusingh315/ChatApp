import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
function Home() {
  return (
    <>
      <Container maxW="xl" centerContent>
        <Box>
          <Text fontSize="4xl" color="black">
            chat app
          </Text>
        </Box>
        <Box color="black">
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Login</Tab>
              <Tab>Singup</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
}

export default Home;
