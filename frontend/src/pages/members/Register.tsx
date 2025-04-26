import { useFormik } from "formik";
import * as yup from "yup";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { registerMemberFn } from "@/redux/slices/members/registerSlice";

const Register = () => {
  let toastId = "register";
  const dispatch = useDispatch<AppDispatch>();
  const registerState = useSelector((state: RootState) => state.registerMemberSlice);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone_number: "",
      age : "",
      membershiptype : "",
      password: "",
      confirmPassword: "",
    },
    onSubmit(values) {
      const data = {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        age: values.age,
        membershiptype: values.membershiptype,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };
      toast.loading("Registering...", { id: toastId });
      dispatch(registerMemberFn(data));
    },
    validationSchema: yup.object({
      name: yup.string().required("Please enter fullname"),
      email: yup
        .string()
        .email("Please enter valid email")
        .required("Please enter email"),
      phone_number: yup.string().required("Please enter phone number"),
      age: yup.string().required("Please enter your age"),
      membershiptype: yup.string().required("Please enter your membershiptype"),
      password: yup
        .string()
        .min(8, "Password must be atleast 8 characters long")
        .required("Please enter password"),
      confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
    }),
  });

  useEffect(() => {
    if (registerState.error) {
      toast.error(registerState.error, { id: toastId });
    }

    if (registerState.data.isSuccess) {
      toast.success("Successfully Registered", { id: toastId });
    }
  }, [registerState.error, registerState.data]);

  useEffect(() => {
    if (registerState.data.isSuccess) {
      navigate("/");
    }
  }, [registerState.data.isSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className=" max-w-lg p-8 bg-gray-300 shadow-lg min-h-[500px] rounded-xl">
        <h2 className="mb-6 text-2xl font-semibold text-center">
          Registration
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4 ">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="text">Fullname</label>
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                type="name"
                name="name"
                placeholder="Enter your name"
                className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none"
                required
              />
              {/* Error message */}
              <p className="text-sm font-semibold text-red-500">
                {formik.touched.name && formik.errors.name}
              </p>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                onBlur={formik.handleBlur}
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="Enter your email"
                className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none"
                required
              />
              <p className="text-sm font-semibold text-red-500">
                {formik.touched.email && formik.errors.email}
              </p>
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input
                onBlur={formik.handleBlur}
                type="tel"
                name="phone_number"
                onChange={formik.handleChange}
                value={formik.values.phone_number}
                placeholder="Enter your number"
                className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none"
                required
              />
              <p className="text-sm font-semibold text-red-500">
                {formik.touched.phone_number && formik.errors.phone_number}
              </p>
            </div>
            <div>
              <label htmlFor="">Age</label>
              <input
                onBlur={formik.handleBlur}
                type="text"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.age}
                placeholder="Enter your age"
                className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none"
                required
              />
              <p className="text-sm font-semibold text-red-500">
                {formik.touched.age && formik.errors.age}
              </p>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                onBlur={formik.handleBlur}
                type="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Enter your password"
                className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none"
                required
              />
              <p className="text-sm font-semibold text-red-500">
                {formik.touched.password && formik.errors.password}
              </p>
            </div>
            <div>
              <label htmlFor="password">Confirm Password</label>
              <input
                onBlur={formik.handleBlur}
                type="password"
                name="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                placeholder="Confirm Password"
                className="p-2 mt-1 border border-gray-300 rounded-md input focus:border-blue-500 focus:outline-none"
                required
              />
              <p className="text-sm font-semibold text-red-500">
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword}
              </p>
            </div>
            <div>
              <label htmlFor="" className="ml-32">MembershipType</label>
              <input
                onBlur={formik.handleBlur}
                type="text"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.membershiptype}
                placeholder="Enter your membershiptype"
                className="p-2 mt-1 border border-gray-300 rounded-md ml-14 w-80 input focus:border-blue-500 focus:outline-none"
                required
              />
              <p className="text-sm font-semibold text-red-500">
                {formik.touched.membershiptype && formik.errors.membershiptype}
              </p>
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

          <button
            disabled={registerState.loading || !formik.isValid}
            type="submit"
            className="w-full py-2 font-semibold text-white transition bg-gray-800 rounded-lg hover:opacity-90"
          >
            {registerState.loading ? <Spinner /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
