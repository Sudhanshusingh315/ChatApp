export const chatTypes = {
    OneOnOne: "OneOnOne",
    groupChat: "GroupChat",
};

export const messageTypes = {
    TEXT: "text",
    IMAGEWITHTEXT: "imageWithText",
    PDFWITHTEXT: "pdfWithText",
    PDF: "pdf",
    IMAGE: "image",
    CONTACT: "contactAsAMessage",
};

export const fileFormats = {
    PDF: "pdf",
    IMAGE: "image",
};

export const scheduleStatus = {
    PENDING: "pending",
    SENT: "sent",
    FAILED: "failed",
};

export const configEnv = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
};
