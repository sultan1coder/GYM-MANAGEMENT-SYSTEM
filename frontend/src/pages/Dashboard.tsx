import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Activity } from "lucide-react";
import { ImUsers } from 'react-icons/im';
import { Card, CardContent } from "@/components/ui/card";

const data = [
    { name: "Jan", revenue: 4000, members: 2400 },
    { name: "Feb", revenue: 3000, members: 2210 },
    { name: "Mar", revenue: 5000, members: 2290 },
    { name: "Apr", revenue: 4780, members: 2000 },
    { name: "May", revenue: 5890, members: 2181 },
];

const Dashboard = () => {
    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="mb-6 text-3xl font-semibold">Gym Management Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center p-4 space-x-4">
                        <ImUsers className="w-10 h-10 text-blue-500" />
                        <div>
                            <h2 className="text-xl font-semibold">Total Members</h2>
                            <p className="text-lg text-gray-600">1,200</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center p-4 space-x-4">
                        <DollarSign className="w-10 h-10 text-green-500" />
                        <div>
                            <h2 className="text-xl font-semibold">Monthly Revenue</h2>
                            <p className="text-lg text-gray-600">$15,000</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center p-4 space-x-4">
                        <Activity className="w-10 h-10 text-red-500" />
                        <div>
                            <h2 className="text-xl font-semibold">Active Subscriptions</h2>
                            <p className="text-lg text-gray-600">980</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-semibold">Revenue & Member Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#4CAF50" />
                        <Bar dataKey="members" fill="#2196F3" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-end mt-6">
                <Button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Manage Members</Button>
            </div>
        </div>
    )
}

export default Dashboard