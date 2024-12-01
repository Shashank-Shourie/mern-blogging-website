import { Link } from "react-router-dom"
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation"
import defaultBanner from "../imgs/blog banner.png"
import { useRef } from "react"
import { Toaster,toast } from "react-hot-toast"

const BlogEditor = () => {

    // const [postImage, setPostImage] = useState({ myFile: "" });
    let blogBannerRef = useRef();

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
            if(url){
                toast.dismiss(loadingToast);
                toast.success("Uploaded 👍");
                blogBannerRef.current.src = url;
            }
            else{
                toast.dismiss(loadingToast);
                return toast.error("Something went wrong");
            }
        }
    }
    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    New Blog
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2">
                        Publish
                    </button>
                    <button className="btn-light py-2">
                        Save Draft
                    </button>
                </div>
            </nav>
            <Toaster/>
            <AnimationWrapper>
                <section>
                    <div className="mx:auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">

                            <label>
                                <img
                                    ref={blogBannerRef}
                                    src={defaultBanner}
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
                        <textarea>
                            
                        </textarea>
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
            resolve(fileReader.result)
        }
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}