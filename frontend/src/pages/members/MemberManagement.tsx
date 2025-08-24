import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { 
  Users, 
  Plus, 
  Settings, 
  BarChart3, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import MemberList from '../../components/MemberList';
import SimpleMemberDisplay from '../../components/SimpleMemberDisplay';
import { Member } from '../../types/members/memberAll';
import { useMemberRemove } from '../../hooks/member';

const MemberManagement: React.FC = () => {
  const navigate = useNavigate();
  const { handleRemove, isLoading: isDeleting } = useMemberRemove();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Handle member selection (view details)
  const handleMemberSelect = (member: Member) => {
    // You can navigate to a detailed view or show a modal
    navigate(`/members/single/${member.id}`);
  };

  // Handle member edit
  const handleMemberEdit = (member: Member) => {
    navigate(`/members/update/${member.id}`);
  };

  // Handle member delete
  const handleMemberDelete = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (memberToDelete) {
      try {
        await handleRemove(memberToDelete.id);
        setShowDeleteDialog(false);
        setMemberToDelete(null);
        // The MemberList component will automatically refresh
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all gym members, view statistics, and perform bulk operations
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/members/register')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Member
          </Button>
          <Button variant="outline" onClick={() => navigate('/members/dashboard')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">Loading...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">Loading...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-gray-900">Loading...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Reports</p>
                <p className="text-2xl font-bold text-gray-900">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Demonstration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Feature Demonstration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Simple Member Display</h3>
              <p className="text-sm text-gray-600 mb-4">
                This shows how to add basic member fetching to any component using the{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">useMemberGetAll</code> hook.
              </p>
              <SimpleMemberDisplay />
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Advanced Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Search & Filtering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Pagination</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Bulk Actions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Export to CSV</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Sorting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Member Status Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Member List with All Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Complete Member Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList
            showActions={true}
            onMemberSelect={handleMemberSelect}
            onMemberEdit={handleMemberEdit}
            onMemberDelete={handleMemberDelete}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>{memberToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagement;
