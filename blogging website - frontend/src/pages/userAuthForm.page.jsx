const UserAuthForm = ({type}) => {
    return(
        <section className="h-cover flex items-center justify-center">
            <form className="w-[80%] max-w-[400px]">
                <h1>
                    {type}
                </h1>
            </form>
        </section>
    )
}

export default UserAuthForm