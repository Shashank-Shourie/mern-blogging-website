import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

const uploadImageByURL = (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e);
        }
        catch (err) {
            reject(err);
        }
    })

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}

const uploadImageByFile = async (file) => {
    try {
        if (!file) {
            throw new Error("No file selected");
        }

        // Convert file to base64
        const base64 = await convertToBase64(file);

        if (base64) {
            // Return the response in the expected format
            return {
                success: 1,
                file: {
                    url: base64, // Use the base64 string as a "URL"
                },
            };
        } else {
            throw new Error("Failed to convert file to base64");
        }
    } catch (error) {
        console.error("Error in uploadImageByFile:", error);
        return {
            success: 0,
            message: error.message,
        };
    }
};

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolBar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByFile: async (file) => {
                    return await uploadImageByFile(file);
                },
                uploadByUrl: uploadImageByURL,
            },
        },
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type heading....",
            levels: [2, 3],
            defaultLevel: 2,
        },
    },
    quote: {
        class: Quote,
        inlineToolBar: true,
    },
    marker: Marker,
    inlineCode: InlineCode,
};


function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(`Error converting file: ${error}`);
    });
}
