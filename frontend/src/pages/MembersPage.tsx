import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Table } from "@/components/ui/table";
import toast, { Toast } from "react-hot-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export function MembersManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) =>
        member.name
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase())
      )
    );
  }, [searchQuery, members]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/members/list");
      setMembers(response.data);
    } catch (error) {
      toast.error("Faied to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const getMember = async (id: string) => {
    try {
      const response = await axios.get(`/api/members/single/${id}`);
      setSelectedMember(response.data);
    } catch (error) {}
  };

  const updateMember = async (id: string, data: Partial<Member>) => {
    try {
      await axios.put(`/api/members/update/${id}`);
    } catch (error) {}
  };
}

const MembersPage = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Members Management</h1>

      {/* <input type="text" placeholder="Search members" value={searchQuery} /> */}
    </div>
  );
};

export default MembersPage;
