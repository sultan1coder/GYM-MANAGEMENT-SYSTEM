import React from 'react';
import { useMemberGetAll } from '../hooks/member';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import Spinner from './Spinner';

const SimpleMemberDisplay: React.FC = () => {
  // This is how you add member fetching to any component!
  const { members, isLoading, error, refetch } = useMemberGetAll();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <button 
              onClick={refetch} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Simple Member Display ({members?.length || 0} members)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members?.slice(0, 5).map((member) => (
            <div key={member.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{member.name}</h3>
                <div className="flex gap-2">
                  <Badge variant={member.email_verified ? "default" : "secondary"}>
                    {member.email_verified ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">
                    {member.membershiptype}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                {member.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {member.phone_number}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Age: {member.age}
                </div>
                {member.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {member.address.city}, {member.address.state}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {members && members.length > 5 && (
            <div className="text-center text-gray-500 text-sm">
              Showing 5 of {members.length} members. Use the full MemberList component for complete functionality.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleMemberDisplay;
