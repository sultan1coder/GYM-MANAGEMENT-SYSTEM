import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { toast } from "react-hot-toast";
import { attendanceAPI, memberAPI } from "../../services/api";
import {
  Plus,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  Search,
  RefreshCw,
  TrendingUp,
  Activity,
  Timer,
  UserCheck,
  AlertCircle,
} from "lucide-react";

const AttendanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Data states
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [currentlyCheckedIn, setCurrentlyCheckedIn] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Form states
  const [selectedMember, setSelectedMember] = useState("");
  const [checkInLocation, setCheckInLocation] = useState("Main Gym");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Load data
  useEffect(() => {
    loadAttendanceData();
    loadMembers();
  }, []);

  const loadAttendanceData = async () => {
    try {
      setIsLoading(true);
      const [todayResponse, statsResponse, currentResponse] = await Promise.all(
        [
          attendanceAPI.getTodayAttendance(),
          attendanceAPI.getAttendanceStats("7"),
          attendanceAPI.getCurrentlyCheckedIn(),
        ]
      );

      if (todayResponse.data.isSuccess) {
        setTodayAttendance(todayResponse.data.data);
      }
      if (statsResponse.data.isSuccess) {
        setAttendanceStats(statsResponse.data.data);
      }
      if (currentResponse.data.isSuccess) {
        setCurrentlyCheckedIn(currentResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading attendance data:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const response = await memberAPI.getAllMembers();
      if (response.data.isSuccess) {
        setMembers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading members:", error);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedMember) {
      toast.error("Please select a member");
      return;
    }

    try {
      setIsLoading(true);
      const response = await attendanceAPI.checkInMember(selectedMember, {
        location: checkInLocation,
        notes: notes || undefined,
      });

      if (response.data.isSuccess) {
        toast.success("Member checked in successfully!");
        setShowCheckInModal(false);
        setSelectedMember("");
        setNotes("");
        loadAttendanceData(); // Refresh data
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to check in member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async (memberId: string) => {
    try {
      setIsLoading(true);
      const response = await attendanceAPI.checkOutMember(memberId, {
        notes: notes || undefined,
      });

      if (response.data.isSuccess) {
        toast.success("Member checked out successfully!");
        setNotes("");
        loadAttendanceData(); // Refresh data
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to check out member"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track member attendance and gym visits
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadAttendanceData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Dialog open={showCheckInModal} onOpenChange={setShowCheckInModal}>
            <DialogTrigger asChild>
              <Button>
                <LogIn className="h-4 w-4 mr-2" />
                Check In Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Member Check-In</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="member-select">Select Member</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 mb-2"
                    />
                  </div>
                  <Select
                    value={selectedMember}
                    onValueChange={setSelectedMember}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member to check in" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={checkInLocation}
                    onValueChange={setCheckInLocation}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Gym">Main Gym</SelectItem>
                      <SelectItem value="Cardio Area">Cardio Area</SelectItem>
                      <SelectItem value="Weight Room">Weight Room</SelectItem>
                      <SelectItem value="Group Classes">
                        Group Classes
                      </SelectItem>
                      <SelectItem value="Pool">Pool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Add any notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCheckIn}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin" />
                      Checking In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Check In Member
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Check-ins
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAttendance?.stats?.totalCheckIns || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Members visited today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Currently In Gym
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAttendance?.stats?.currentlyInGym || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Visit Duration
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(todayAttendance?.stats?.averageVisitDuration || 0)}min
            </div>
            <p className="text-xs text-muted-foreground">Average today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Visits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceStats?.summary?.totalVisits || 0}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="current">Currently In Gym</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                {todayAttendance?.checkIns?.length > 0 ? (
                  <div className="space-y-3">
                    {todayAttendance.checkIns
                      .slice(0, 10)
                      .map((checkIn: any) => (
                        <div
                          key={checkIn.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={checkIn.member.profile_picture}
                              />
                              <AvatarFallback>
                                {checkIn.member.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {checkIn.member.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(
                                  checkIn.checkInTime
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                checkIn.checkOutTime ? "secondary" : "default"
                              }
                            >
                              {checkIn.checkOutTime ? "Checked Out" : "In Gym"}
                            </Badge>
                            {!checkIn.checkOutTime && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCheckOut(checkIn.memberId)}
                              >
                                <LogOut className="h-4 w-4 mr-1" />
                                Check Out
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 mb-4" />
                    <p>No check-ins today</p>
                    <p className="text-sm">Check in members to see them here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Stats</CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceStats?.dailyStats ? (
                  <div className="space-y-3">
                    {attendanceStats.dailyStats.slice(-7).map((day: any) => (
                      <div
                        key={day.date}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">{day.visits} visits</span>
                          <span className="text-sm text-gray-500">
                            {day.uniqueMembers} members
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="mx-auto h-12 w-12 mb-4" />
                    <p>Loading statistics...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Currently In Gym Tab */}
        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Members Currently In Gym ({currentlyCheckedIn.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentlyCheckedIn.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentlyCheckedIn.map((checkIn: any) => (
                    <div key={checkIn.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={checkIn.member.profile_picture} />
                            <AvatarFallback>
                              {checkIn.member.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{checkIn.member.name}</p>
                            <p className="text-sm text-gray-500">
                              {checkIn.member.membershiptype}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default">In Gym</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Check-in time:</span>
                          <span>
                            {new Date(checkIn.checkInTime).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span>{checkIn.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>
                            {Math.floor(
                              (new Date().getTime() -
                                new Date(checkIn.checkInTime).getTime()) /
                                (1000 * 60)
                            )}{" "}
                            min
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleCheckOut(checkIn.memberId)}
                        disabled={isLoading}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Check Out
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="mx-auto h-12 w-12 mb-4" />
                  <p>No members currently in the gym</p>
                  <p className="text-sm">Check in members to see them here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAttendance?.attendance?.length > 0 ? (
                <div className="space-y-3">
                  {todayAttendance.attendance.map((attendance: any) => (
                    <div
                      key={attendance.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={attendance.member?.profile_picture}
                          />
                          <AvatarFallback>
                            {attendance.member?.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {attendance.member?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(attendance.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(attendance.timeIn).toLocaleTimeString()}
                          {attendance.timeOut &&
                            ` - ${new Date(
                              attendance.timeOut
                            ).toLocaleTimeString()}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attendance.duration
                            ? `${Math.floor(attendance.duration / 60)}h ${
                                attendance.duration % 60
                              }m`
                            : "Still in gym"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4" />
                  <p>No attendance records yet</p>
                  <p className="text-sm">
                    Start recording member check-ins to see data here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Check-In Modal */}
      <Dialog open={showCheckInModal} onOpenChange={setShowCheckInModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Member Check-In</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="member-select">Select Member</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 mb-2"
                />
              </div>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a member to check in" />
                </SelectTrigger>
                <SelectContent>
                  {filteredMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                value={checkInLocation}
                onValueChange={setCheckInLocation}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Gym">Main Gym</SelectItem>
                  <SelectItem value="Cardio Area">Cardio Area</SelectItem>
                  <SelectItem value="Weight Room">Weight Room</SelectItem>
                  <SelectItem value="Group Classes">Group Classes</SelectItem>
                  <SelectItem value="Pool">Pool</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCheckIn}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin" />
                  Checking In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Check In Member
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceManagement;
