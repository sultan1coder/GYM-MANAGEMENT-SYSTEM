import { Link } from "react-router-dom"
import Register from "./members/Register"

const Members = () => {
  return (
    <div className="">
        <Link to={"/LoginMember"}>Login</Link>
        <Register />
    </div>
  )
}

export default Members