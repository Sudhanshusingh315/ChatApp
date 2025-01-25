import { contactPipeline } from "../aggregation/aggregation.pipeline.js";
import { User } from "../models/userModel.js";

export const searchContact = async (req, res) => {
    const { email } = req.body;
    try {
        if (email) {
            const contact = await User.find({
                $text: { $search: email, $caseSensitive: false },
            });
            console.log(contact);

            return res.status(200).json({
                success: true,
                data: contact,
            });
        } else {
            throw new Error("Email is required");
        }
    } catch (err) {
        return res.status(404).json({
            success: false,
            error: "Contact not found",
        });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(req.params);
        let contacts=null;
        if (userId) {
            contacts = await User.aggregate(contactPipeline(userId));
        }else{
            throw new Error("user Id is not recognised");
        }

        if (contacts) {
            return res.status(200).json({
                sucess: true,
                data: contacts,
            });
        } else {
            throw new Error("No Contacts were found");
        }
    } catch (error) {
        console.log("error is ", error);
        return res.status(404).json({
            success: false,
            error,
        });
    }
};
