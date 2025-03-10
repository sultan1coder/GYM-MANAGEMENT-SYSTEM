import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../redux/store'

const Header = () => {

    const loginState = useSelector((state: RootState) => state.loginSlice)

    return (
        <div className='flex items-center justify-around p-3'>
            <div className="text-xl font-bold logo ">
                <h1>BILKHAYR GYM</h1>
            </div>
            {loginState.data.isSuccess ? <button className='p-3 bg-red-500 rounded-md'>Logout</button> : <div className="flex gap-4 menus">
                <Link className='p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700' to={"/"}>HomePage</Link>
                <Link className='p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700' to={"/auth/login"}>Login</Link>
                <Link className='p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700' to={"/auth/register"}>Register</Link>
            </div>}
        </div>
    )
}

export default Header