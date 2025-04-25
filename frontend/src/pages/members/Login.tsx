import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../redux/store";
import Spinner from "../../components/Spinner";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { loginMemberFn } from "@/redux/slices/members/loginSlice";



const Login = () => {
    let toastId = "login"
    const dispatch = useDispatch<AppDispatch>();
    const loginState = useSelector((state: RootState) => state.loginMemberSlice);
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit(values) {
            const data = {
                email: values.email,
                password: values.password,
            }
            toast.loading("Logging in..", { id: toastId });
            dispatch(loginMemberFn(data))
        },
        validationSchema: yup.object({
            email: yup.string().email("please enter valid email").required("Please enter email"),
            password: yup.string().min(8, "password must be at least 8 characters long").required("password is required")
        })
    });

    useEffect(() => {
        if (loginState.error) {
            toast.error(loginState.error, { id: toastId });
        }

        if (loginState.data.isSuccess) {
            toast.success("Successfully loged in", { id: toastId });
            localStorage.setItem("userData", JSON.stringify(loginState.data));
        }
    }, [loginState.error, loginState.data])

    // Automatically navigate to homepage if there is a token stored in localstorage

    useEffect(() => {
        if (loginState.data.isSuccess) {
            navigate("/")
        }
    }, [loginState.data.isSuccess])

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="w-full max-w-md p-8 bg-gray-300 shadow-lg rounded-2xl">
                <h2
                    className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Sign in
                </h2>
                <p className="mb-6 text-sm text-center text-gray-600">
                    Please enter your credentials to access your account
                </p>
                <p className="my-4 text-red-500">
                    {loginState.error && "Incorrect email or password"}
                </p>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            onBlur={formik.handleBlur}
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your email"
                        />
                        {/* Error message */}
                        <p className="text-sm font-semibold text-red-500">
                            {formik.touched.email && formik.errors.email}
                        </p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            onBlur={formik.handleBlur}
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your password"
                        />
                        {/* Error message */}
                        <p className="text-sm font-semibold text-red-500">
                            {formik.touched.password && formik.errors.password}
                        </p>
                    </div>
                    <div className="flex justify-end text-sm text-blue-500 hover:underline">
                        <a href="#">Forgot password?</a>
                    </div>
                    <button disabled={loginState.loading || !formik.isValid}
                        type="submit"
                        className="w-full p-2 my-3 text-white bg-gray-800 rounded-md disabled:bg-gray-500 hover:bg-gray-700">
                        {loginState.loading ? <Spinner /> : "Sign in"}
                    </button>
                </form>
                <div className="gap-3 mt-6 text-sm text-center">
                    Or Sign Up <Link className='text-lg text-blue-500 hover:underline' to={"/member/register"}> Sign up </Link>
                    <button />
                </div>
            </div>
        </div>
    );
}

export default Login