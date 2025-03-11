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
            <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>

    )
}

export default Profile