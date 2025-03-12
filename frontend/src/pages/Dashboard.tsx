import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Search } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 4000, expense: 2400 },
  { month: "Feb", revenue: 3000, expense: 1398 },
  { month: "Mar", revenue: 2000, expense: 9800 },
  { month: "Apr", revenue: 2780, expense: 3908 },
  { month: "May", revenue: 1890, expense: 4800 },
  { month: "Jun", revenue: 2390, expense: 3800 },
];

const Dashboard = () => {
    return (
        <div className="min-h-screen p-6 space-y-6 text-white bg-gray-900">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gym Management Dashboard</h1>
          <div className="relative">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="py-2 pl-10 pr-4 text-white bg-gray-800 rounded-md focus:outline-none"
            />
          </div>
        </header>
  
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Revenue</h2>
              <p className="text-2xl font-bold">$4,530</p>
              <progress value={75} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Members</h2>
              <p className="text-2xl font-bold">89</p>
              <progress value={50} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Trainers</h2>
              <p className="text-2xl font-bold">12</p>
              <progress value={80} />
            </CardContent>
          </Card>
        </div>
  
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Revenue Analytics</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip cursor={{ fill: "#1f2937" }} />
                  <Bar dataKey="revenue" fill="#4f46e5" />
                  <Bar dataKey="expense" fill="#e11d48" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold">Personal Trainers</h2>
              <div className="flex space-x-4">
                {/* <Avatar className="w-12 h-12" src="/trainer1.jpg" />
                <div>
                  <p className="font-medium">King Zarips</p>
                  <p className="text-gray-400">3+ Clients, 2+ Years</p>
                </div>
              </div>
              <div className="flex mt-4 space-x-4">
                <Avatar className="w-12 h-12" src="/trainer2.jpg" /> */}
                <div>
                  <p className="font-medium">Lerry Rops</p>
                  <p className="text-gray-400">1+ Years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
  
        <Button className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">
          + New Member
        </Button>
      </div>
    )
}

export default Dashboard