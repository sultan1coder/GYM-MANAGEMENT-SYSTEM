import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

const Profile = () => {
    const loginState = useSelector((state: RootState) => state.loginSlice)
    return (
        <Popover>
            <PopoverTrigger>
                <div className="border w-[42px] h-[42px] flex items-center justify-center rounded-full">
                    <h1 className="text-2xl font-bold">
                        {loginState.data.user.name[0].toUpperCase()}
                    </h1>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex items-center gap-4">
                    <div className="border w-[42px] h-[42px] flex items-center justify-center rounded-full">
                        <h1 className="text-2xl font-bold">
                            {loginState.data.user.name[0].toUpperCase()}
                        </h1>
                    </div>
                    <div className="gap-6">
                        <h1 className="text-xl font-bold">
                            {loginState.data.user.name}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {loginState.data.user.email}
                        </p>
                        <p className="text-sm text-gray-600">
                            {loginState.data.user.phone_number}
                        </p>
                        <p className="text-sm text-gray-600">
                            {loginState.data.user.username}
                        </p>
                        <p className="text-sm text-gray-600">
                            {loginState.data.user.id}
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>

    )
}

export default Profile