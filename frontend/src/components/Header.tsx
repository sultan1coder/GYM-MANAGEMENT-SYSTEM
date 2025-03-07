import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className='flex items-center justify-around p-3'>
            <div className="text-xl font-bold logo ">
                <h1>BILKHAYR GYM</h1>
            </div>
            <div className="flex gap-4 menus">
                <Link className='p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700' to={"/"}>HomePage</Link>
                <Link className='p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700' to={"/auth/login"}>Login</Link>

            </div>
        </div>
    )
}

export default Header