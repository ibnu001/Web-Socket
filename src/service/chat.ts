import axios from "axios";

export const getDiscussionList = async () => {
    try {
        const external_code = "66f7fc86897114f835c2660f"; // bisa apasaja, contoh case id, atau proposal id atau apapun

        const params = [];

        const page = 1;
        const limit = 3;

        params.push(`page=${page}`);
        params.push(`limit=${limit}`);
        params.push(`external_code=${external_code}`);

        const paramsString = "?" + params.join("&");

        const response = await axios.get(
            process.env.NEXT_PUBLIC_API_URL + "/chat/discussion" + paramsString,
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token") || "",
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};
