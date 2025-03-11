import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '../redux/store'
import { logout } from '../redux/slices/auth/loginSlice'

const Header = () => {

    const loginState = useSelector((state: RootState) => state.loginSlice)
    const dispatch = useDispatch<AppDispatch>()

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <div className='flex items-center justify-around p-3'>
            <div className="text-xl font-bold logo ">
                <h1>BILKHAYR GYM</h1>
            </div>
            {loginState.data.isSuccess ? <div className='flex items-center gap-3'>
                <p>{loginState.data.user.name} </p>
                <button onClick={logoutHandler} className='p-3 text-white bg-red-500 rounded-md'>Logout</button>
            </div> : <div className="flex gap-4 menus">
                <Link className='p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700' to={"/"}>HomePage</Link>
                <Link className='p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700' to={"/auth/login"}>Login</Link>
                <Link className='p-3 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-700' to={"/auth/register"}>Register</Link>
            </div>}
        </div>
    )
}

export default Header