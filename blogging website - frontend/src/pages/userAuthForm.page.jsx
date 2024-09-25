import InputBox from "../components/input.component"

const UserAuthForm = ({type}) => {
    return(
        <section className="h-cover flex items-center justify-center">
            <form className="w-[80%] max-w-[400px]">
                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type=="Sign In" ? "Welcome Back":"Join Us today"}
                </h1>
                {
                    type != "Sign In" ?
                        <InputBox 
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            icon="fi-rr-user"
                        />
                    :""
                }
                <InputBox 
                    name="email"
                    type="email"
                    placeholder="Email"
                    icon="fi-sr-envelope"
                />
            </form>
        </section>
    )
}

export default UserAuthForm