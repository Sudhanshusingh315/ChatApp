import axios from "axios";
import { configEnv } from "../constants/contants";

export const SearchContactAPI = async (searchContact) => {
    if (!searchContact) return;
    const result = await axios({
        url: `${configEnv.BASE_URL}/api/searchContact/contact/?email=${searchContact}`,
        method: "get",
    });
    return result;
};
