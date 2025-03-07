
const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 bg-gray-300 shadow-lg rounded-xl">
                <h2 className="mb-6 text-2xl font-semibold text-center">Registration</h2>
                <form className="space-y-4 ">
                    <div className="grid grid-cols-2 gap-4">
                        {/* <label htmlFor="text">Fullname</label> */}
                        <input type="text" name="fullName" placeholder="Full Name" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        <input type="text" name="username" placeholder="Username" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        <input type="email" name="email" placeholder="Email" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        <input type="tel" name="phone" placeholder="Phone Number" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        <input type="password" name="password" placeholder="Password" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Gender</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input type="radio" name="gender" value="Male" required />
                                <span className="ml-2">Male</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="gender" value="Female" required />
                                <span className="ml-2">Female</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-2 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register