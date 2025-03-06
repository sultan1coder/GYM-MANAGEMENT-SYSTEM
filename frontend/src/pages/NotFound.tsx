import { Link } from "react-router-dom";
import notFoundImage from "../assets/notFoundImage.png";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="text-center bg-white p-8 w-full max-w-lg">
                <img
                 src={notFoundImage}
                 alt="Not Found" 
                 className="mx-auto mb-6 w-72 h-auto" />
                <h1 className="text-4xl font-semibold text-gray-800 mb-4">404 Not Found</h1>
                <p className="text-gray-600 text-lg mb-6">Oops! The page you are looking for does not exist.</p>
                <Link
                    to="/"
                    className=" px-6 py-3 bg-gray-800 text-white text-lg font-medium rounded-lg shadow-md hover:bg-gray-700 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
export default NotFound;
