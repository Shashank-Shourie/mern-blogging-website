import { Link } from "react-router-dom"
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation"
import defaultBanner from "../imgs/blog banner.png"
import { useContext, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import { EditorContext } from "../pages/editor.pages"
import EditorJs from "@editorjs/editorjs"
import { tools } from "./tools.component"

const BlogEditor = () => {

    // const [postImage, setPostImage] = useState({ myFile: "" });
    let { blog, blog: { title, banner, content, tags, desc }, setBlog, textEditor, setTextEditor,setEditorState } = useContext(EditorContext);

    useEffect(() => {
        setTextEditor(new EditorJs({
            holder: "textEditor",
            data: content,
            tools: tools,
            placeholder: "Blog....."
        }))
}, [])

const handleBannerUpload = async (e) => {
    // e.preventDefault();
    console.log(e)
    // let img = e.target.files[0];
    // console.log(img);
    const file = e.target.files[0];
    if (file) {
        let loadingToast = toast.loading("Uploading...");
        const url = await convertToBase64(file);
        // setPostImage({ ...postImage, myFile: base64 })
        console.log(url);
        if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded 👍");

            setBlog({ ...blog, banner: url });
        }
        else {
            toast.dismiss(loadingToast);
            return toast.error("Something went wrong");
        }
    }
}
const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
        e.preventDefault();
    }
}
const handleTitleChange = (e) => {
    let input = e.target;
    console.log(input.scrollHeight);
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
}
const handlePublishEvent = () => {
    if(!banner.length){
        return toast.error("Upload a blog banner");
    }
    if(!title.length){
        return toast.error("Write a blog title");
    }
    if(textEditor.isReady){
        textEditor.save().then(data => {
            if(data.blocks.length){
                setBlog({...blog,content:data});
                setEditorState("publish");
            }
            else{
                return toast.error("Write something in your blog")
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }
}

return (
    <>
        <nav className="navbar">
            <Link to="/" className="flex-none w-10">
                <img src={logo} />
            </Link>
            <p className="max-md:hidden text-black line-clamp-1 w-full">
                {title.length ? title : "New Blog"}
            </p>
            <div className="flex gap-4 ml-auto">
                <button className="btn-dark py-2"
                onClick={handlePublishEvent}>
                    Publish
                </button>
                <button className="btn-light py-2">
                    Save Draft
                </button>
            </div>
        </nav>
        <Toaster />
        <AnimationWrapper>
            <section>
                <div className="mx:auto max-w-[900px] w-full">
                    <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">

                        <label>
                            <img
                                src={banner ? banner : defaultBanner}
                                alt="banner"
                                className="z-20"
                            />
                            <input
                                id="uploadBanner"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                hidden
                                onChange={handleBannerUpload}
                            />
                        </label>
                    </div>
                    <textarea
                        defaultValue={title}
                        placeholder="Blog Title"
                        className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                        onKeyDown={handleTitleKeyDown}
                        onChange={handleTitleChange}
                    ></textarea>
                    <hr className="w-full opacity-10 my-5" />
                    <div id="textEditor" className="font-gelasio"></div>
                </div>
            </section>
        </AnimationWrapper>
    </>
)
}
export default BlogEditor

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            const img = new Image();
            img.src = fileReader.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Set your desired max width
                const MAX_HEIGHT = 800; // Set your desired max height
                let width = img.width;
                let height = img.height;

                // Maintain aspect ratio
                if (width > height && width > MAX_WIDTH) {
                    height = (height * MAX_WIDTH) / width;
                    width = MAX_WIDTH;
                } else if (height > width && height > MAX_HEIGHT) {
                    width = (width * MAX_HEIGHT) / height;
                    height = MAX_HEIGHT;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality (0.7 = 70%)
                resolve(compressedDataUrl);
            };

            img.onerror = (error) => {
                reject(error);
            };
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}
