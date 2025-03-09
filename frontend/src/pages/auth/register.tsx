import { useFormik } from "formik"
import * as yup from "yup";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { registerFn } from "../../redux/slices/auth/registerSlice";
import { useEffect } from "react";

const Register = () => {
    let toastId = "register"
    const dispatch = useDispatch<AppDispatch>();
    const registerState = useSelector((state: RootState) => state.registerSlice)

    const formik = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            phone_number: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
        onSubmit(values) {
            const data = {
                name: values.name,
                username: values.username,
                email: values.email,
                phone_number: values.phone_number,
                password: values.password,
                confirmPassword: values.confirmPassword,
                role: values.role,
            }
            toast.loading("Registering...", { id: toastId });
            dispatch(registerFn(data))
        },
        validationSchema: yup.object({
            fullname: yup.string().required("Please enter fullname"),
            username: yup.string().required("Please enter username"),
            email: yup.string().email("Please enter valid email").required("Please enter email"),
            phone_number: yup.string().required("Please enter phone number"),
            password: yup.string().min(8, "Password must be atleast 8 characters long").required("Please enter password"),
            confirmPassword: yup.string().required("Please confirm your password").oneOf([yup.ref("password"),], "Passwords must match")
        })
    });

    useEffect(() => {
        if (registerState.error) {
            toast.error(registerState.error, { id: toastId });
        }

        if (registerState.data.isSuccess) {
            toast.success("Successfully loged in", { id: toastId });
        }
    }, [registerState.error, registerState.data])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className=" max-w-lg p-8 bg-gray-300 shadow-lg min-h-[500px] rounded-xl">
                <h2 className="mb-6 text-2xl font-semibold text-center">Registration</h2>
                <form className="space-y-4 ">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="text">Fullname</label>
                            <input type="text" name="fullName" placeholder="Enter your name" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor="">Username</label>
                            <input type="text" name="username" placeholder="Enter your username" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" placeholder="Enter your email" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input type="tel" name="phone" placeholder="Enter your number" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" placeholder="Enter your password" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label htmlFor="password">Confirm Password</label>
                            <input type="password" name="confirmPassword" placeholder="Confirm Password" className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none" required />
                        </div>
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

                    <button type="submit" className="w-full py-2 font-semibold text-white transition bg-gray-800 rounded-lg hover:opacity-90">
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register