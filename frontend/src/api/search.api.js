import axios from "axios";

export const SearchContactAPI = async (searchContact) => {
    if (!searchContact) return;
    const result = await axios({
        url: `/api/searchContact/contact/?email=${searchContact}`,
        method: "get",
    });
    return result;
};
