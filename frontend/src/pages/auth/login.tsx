
const Login = () => {
    return (
        <div className="w-[80%] border p-3 rounded-md shadow-sm md:w-[60%] lg:w-[40%] mx-auto">
            <div className="header">
                <h1 className="text-xl font-bold">
                    Sing in
                </h1>
                <p className="text-sm text-gray-500">
                    please enter your credentials to access your account
                </p>
            </div>
            <form>
                <div className="inputContainer grid my-3">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" className="border p-3 rounded-md" placeholder="Enter your email" />
                </div>
                <div className="inputContainer grid my-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="border p-3 rounded-md" placeholder="Enter your password" />
                </div>
                <div className="grid items-center px-40">
                    <button className="p-3 rounded-md my-3 bg-gray-800 hover:bg-gray-700 text-white">
                        Sing in
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login