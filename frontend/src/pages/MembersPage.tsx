import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchMembers,
  createMember, deleteMember
} from "../redux/slices/memberSlice";
import { Member } from "../types/member";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const MembersManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading, error } = useSelector(
    (state: RootState) => state.memberSlice
  );
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleCreate = async (memberData: Member) => {
    const response = await dispatch(createMember(memberData));
    if (createMember.fulfilled.match(response)) {
      toast.success("Member added successfully");
    } else {
      toast.error("Failed to add member");
    }
  };

  const handleDelete = async (id: string) => {
    const response = await dispatch(deleteMember(id));
    if (deleteMember.fulfilled.match(response)) {
      toast.success("Member deleted successfully");
    } else {
      toast.error("Failed to delete member");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="mb-6 text-2xl font-semibold">Members Management</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="p-4 bg-white rounded shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(members) && members.length > 0 ? (
                members.map((member: Member) => (
                  <tr key={member.id} className="border">
                    <td className="p-2 border">{member.id}</td>
                    <td className="p-2 border">{member.name}</td>
                    <td className="p-2 border">{member.email}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="mr-2 text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;
