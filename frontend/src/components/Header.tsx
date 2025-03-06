import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className='flex items-center justify-around p-3'>
            <div className="logo text-xl font-bold ">
                <h1>BILKHAYR GYM</h1>
            </div>
            <div className="menus flex gap-4">
                <Link className='bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700 transition-all' to={"/"}>HomePage</Link>
                <Link className='bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700 transition-all' to={"/auth/login"}>Login</Link>
                <Link className='bg-gray-800 text-white p-3 rounded-md hover:bg-gray-700 transition-all' to={"/auth/register"}>Register</Link>
            </div>
        </div>
    )
}

export default Header