import { useFormik } from "formik";
import yup from "yup";


const Login = () => {

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit(values) {
            console.log(values);
        },
        validationSchema: {
            email: yup.string().email("please enter valid email").required("please enter email"),
            parseFloat: yup.string().min(8, "password must be at least 8 characters").required("password is required")
        }
    });

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
            <form onSubmit={formik.handleSubmit}>
                <div className="inputContainer grid my-3">
                    <label htmlFor="email">Email Address</label>
                    <input
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        type="email" className="border p-3 rounded-md" placeholder="Enter your email" />
                </div>
                <div className="inputContainer grid my-3">
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        type="password" className="border p-3 rounded-md" placeholder="Enter your password" />
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