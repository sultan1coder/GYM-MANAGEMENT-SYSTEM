import { Link } from "react-router-dom";
import notFoundImage from "../assets/notFoundImage.png";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-lg p-8 text-center bg-white">
                <img
                    src={notFoundImage}
                    alt="Not Found"
                    className="h-auto mx-auto mb-6 w-72" />
                <h1 className="mb-4 text-4xl font-semibold text-gray-800">404 Not Found</h1>
                <p className="mb-6 text-lg text-gray-600">Oops! The page you are looking for does not exist.</p>
                <Link
                    to="/"
                    className="px-6 py-3 text-lg font-medium text-white transition bg-gray-800 rounded-lg shadow-md hover:bg-gray-700"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
export default NotFound;
