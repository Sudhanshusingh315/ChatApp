

import { Router } from "express";
import protectedMiddleware from "../middlewares/protected.js";
import { getAllContacts, searchContact } from "../controllers/contactController.js";


const contactRoutes = Router();

/*

1) search the user -> global.
2) pull out all the users person is talking to.
3) search my contact.

*/

contactRoutes.get('/contact',searchContact);
contactRoutes.get('/:userId/myContact',protectedMiddleware,getAllContacts);

export default contactRoutes; 