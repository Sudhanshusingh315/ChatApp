import mongoose from "mongoose";
import { contactPipeline } from "../aggregation/aggregation.pipeline.js";
import { User } from "../models/userModel.js";

export const searchContact = async (req, res) => {
    const { email } = req.query;
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
        let contacts = null;
        if (userId) {
            contacts = await User.aggregate(contactPipeline(userId));
        } else {
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

export const AddToMyContacts = async (userId, contactId) => {
    try {
        if (userId && contactId) {
            const userIds = [
                {
                    id: new mongoose.Types.ObjectId(userId),
                    contact: new mongoose.Types.ObjectId(contactId),
                },
                {
                    id: new mongoose.Types.ObjectId(contactId),
                    contact: new mongoose.Types.ObjectId(userId),
                },
            ];

            // order matters in the for await, it will be sequential.
            const results = [];

            for await (let { id, contact } of userIds) {
                const updateContact = await User.updateOne(
                    { _id: id },
                    {
                        $addToSet: { contacts: contact },
                    },
                    { new: true }
                );
                results.push(updateContact);
            }
            return results;
        }
    } catch (error) {
        console.log(error);
    }
};
