import { Link } from "react-router-dom";
import notFoundImage from "../assets/notFoundImage.png";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <img src={notFoundImage} alt="Not Found" className="mx-auto mb-6 w-48 h-auto" />
            <h1 className="text-4xl font-bold text-gray-800 mt-6">Page Not Found</h1>
            <p className="text-gray-600 mt-2">Oops! The page you are looking for does not exist.</p>
            <Link
                to="/"
                className="mt-4 px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
            >
                Go Home
            </Link>
        </div>
    );
}
export default NotFound;
