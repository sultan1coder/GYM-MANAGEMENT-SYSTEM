import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Table} from "@/components/ui/table";
import { Toast } from "react-hot-toast";


interface Member {
    id: string;
    name: string;
    email : string;
    phone : string;
}


const MembersPage = () => {
  return <div className="p-6">
    <h1 className="mb-4 text-2xl font-semibold">Members Management</h1>
    
    <input
     type="text" 
    placeholder="Search members"
    // value={searchQuery}
    />
    
  </div>;
};

export default MembersPage;
