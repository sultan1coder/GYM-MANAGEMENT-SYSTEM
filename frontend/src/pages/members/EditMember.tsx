import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BASE_API_URL } from "@/constants";
import { Member } from "@/types/members/memberAll";

function EditMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`${BASE_API_URL}/members/single${id}`);
        setFormData(res.data.member);
      } catch (err) {
        console.error("Failed to fetch member:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_API_URL}/members/edit/${id}`, formData);
      alert("Member updated successfully!");
      navigate("/members");
    } catch (err) {
      console.error("Failed to update member:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!formData) return <p>Member not found</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl p-6 mx-auto space-y-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Member</h1>
      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
      <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <Input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" />
      <Input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" />
      <Input name="membershiptype" value={formData.membershiptype} onChange={handleChange} placeholder="Membership Type" />
      <Button type="submit" className="text-white bg-blue-600">
        Update Member
      </Button>
    </form>
  );
}

export default EditMember;
