import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div>
            <div className="logo">
                <h1>BILKHAYR GYM</h1>
            </div>
            <div className="menus">
                <Link to={"/login"}>Login</Link>
                <Link to={"/register"}>Register</Link>
            </div>
        </div>
    )
}

export default Header