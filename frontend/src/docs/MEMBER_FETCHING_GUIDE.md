# 🚀 Member Fetching Guide

This guide explains how to implement member fetching in your frontend components, create new member display components, and modify existing member fetching logic.

## 📋 Table of Contents

1. [How to Add Member Fetching to Any Component](#how-to-add-member-fetching-to-any-component)
2. [Creating New Member Display Components](#creating-new-member-display-components)
3. [Modifying Existing Member Fetching Logic](#modifying-existing-member-fetching-logic)
4. [Testing Member Fetching Functionality](#testing-member-fetching-functionality)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 How to Add Member Fetching to Any Component

### Method 1: Using the Custom Hook (Recommended)

The easiest way to add member fetching to any component is using the `useMemberGetAll` hook:

```typescript
import React from 'react';
import { useMemberGetAll } from '../hooks/member';

const YourComponent: React.FC = () => {
  // This hook provides everything you need!
  const { members, isLoading, error, refetch } = useMemberGetAll();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Members ({members?.length || 0})</h2>
      {members?.map(member => (
        <div key={member.id}>
          {member.name} - {member.email}
        </div>
      ))}
    </div>
  );
};
```

### Method 2: Direct API Call

For more control, you can call the API directly:

```typescript
import React, { useState, useEffect } from 'react';
import { memberAPI } from '../services/api';

const YourComponent: React.FC = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await memberAPI.getAllMembers();
      if (response.data.isSuccess) {
        setMembers(response.data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ... rest of your component
};
```

### Method 3: Using Redux (if you have Redux setup)

```typescript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMembers } from '../redux/slices/memberSlice';

const YourComponent: React.FC = () => {
  const dispatch = useDispatch();
  const { members, isLoading, error } = useSelector(state => state.members);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  // ... rest of your component
};
```

---

## 🎨 Creating New Member Display Components

### Simple Member Card Component

```typescript
import React from 'react';
import { useMemberGetAll } from '../hooks/member';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const MemberCard: React.FC = () => {
  const { members, isLoading, error } = useMemberGetAll();

  if (isLoading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {members?.map(member => (
            <div key={member.id} className="p-3 border rounded">
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.email}</p>
              <p className="text-sm text-gray-600">Age: {member.age}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

### Advanced Member Table Component

```typescript
import React, { useState, useMemo } from 'react';
import { useMemberGetAll } from '../hooks/member';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';

const MemberTable: React.FC = () => {
  const { members, isLoading, error } = useMemberGetAll();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredMembers = useMemo(() => {
    let filtered = members || [];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [members, searchTerm, sortBy, sortOrder]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Sort: {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Membership</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map(member => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.age}</TableCell>
              <TableCell>
                {member.email_verified ? 'Active' : 'Inactive'}
              </TableCell>
              <TableCell>{member.membershiptype}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## 🔄 Modifying Existing Member Fetching Logic

### 1. Modify the Hook

To change how members are fetched, edit `src/hooks/member.tsx`:

```typescript
// Add new parameters to the hook
export const useMemberGetAll = (options?: {
  limit?: number;
  status?: 'all' | 'active' | 'inactive';
  membershipType?: 'all' | 'MONTHLY' | 'DAILY';
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      let url = `${BASE_API_URL}/members/list`;
      
      // Add query parameters based on options
      const params = new URLSearchParams();
      if (options?.status && options.status !== 'all') {
        params.append('status', options.status);
      }
      if (options?.membershipType && options.membershipType !== 'all') {
        params.append('membershipType', options.membershipType);
      }
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response: AxiosResponse = await api.get(url);
      if (response.status === 200) {
        const data: IGetMembersResponse = response.data;
        setMembers(data.members);
      } else {
        throw Error(response.statusText);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [options?.status, options?.membershipType, options?.limit]);

  return { isLoading, error, members, refetch: fetchMembers };
};
```

### 2. Modify the API Service

To change the API endpoint or add new methods, edit `src/services/api.ts`:

```typescript
export const memberAPI = {
  // Existing methods...
  
  // Add new methods
  getMembersByStatus: (status: string) =>
    api.get<ApiResponse<Member[]>>(`${BASE_API_URL}/members/list?status=${status}`),
    
  getMembersByMembershipType: (type: string) =>
    api.get<ApiResponse<Member[]>>(`${BASE_API_URL}/members/list?membershipType=${type}`),
    
  getMembersWithPagination: (page: number, limit: number) =>
    api.get<ApiResponse<Member[]>>(`${BASE_API_URL}/members/list?page=${page}&limit=${limit}`),
    
  searchMembers: (query: string) =>
    api.get<ApiResponse<Member[]>>(`${BASE_API_URL}/members/search?q=${query}`),
};
```

### 3. Add New Hooks

Create specialized hooks for different use cases:

```typescript
// src/hooks/member.tsx

export const useActiveMembers = () => {
  const { members, isLoading, error, refetch } = useMemberGetAll({
    status: 'active'
  });
  
  return { activeMembers: members, isLoading, error, refetch };
};

export const useMonthlyMembers = () => {
  const { members, isLoading, error, refetch } = useMemberGetAll({
    membershipType: 'MONTHLY'
  });
  
  return { monthlyMembers: members, isLoading, error, refetch };
};

export const useMembersWithPagination = (page: number, limit: number) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const fetchMembers = async () => {
    try {
      const response = await memberAPI.getMembersWithPagination(page, limit);
      if (response.data.isSuccess) {
        setMembers(response.data.data);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, limit]);

  return { members, isLoading, error, totalPages, refetch: fetchMembers };
};
```

---

## 🧪 Testing Member Fetching Functionality

### 1. Test the Hook

```typescript
// Create a test component
const TestMemberFetching: React.FC = () => {
  const { members, isLoading, error, refetch } = useMemberGetAll();

  return (
    <div>
      <h2>Testing Member Fetching</h2>
      
      <div className="mb-4">
        <Button onClick={refetch}>Refresh Data</Button>
      </div>

      <div className="mb-4">
        <strong>Status:</strong> {isLoading ? 'Loading...' : 'Loaded'}
      </div>

      {error && (
        <div className="mb-4 text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-4">
        <strong>Member Count:</strong> {members?.length || 0}
      </div>

      {members && members.length > 0 && (
        <div>
          <strong>First Member:</strong>
          <pre>{JSON.stringify(members[0], null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

### 2. Test API Calls

```typescript
// Test the API directly
const testAPI = async () => {
  try {
    console.log('Testing member API...');
    
    const response = await memberAPI.getAllMembers();
    console.log('API Response:', response);
    
    if (response.data.isSuccess) {
      console.log('Members:', response.data.data);
      console.log('Member count:', response.data.data.length);
    } else {
      console.log('API Error:', response.data.message);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Call this in useEffect or button click
useEffect(() => {
  testAPI();
}, []);
```

### 3. Test Error Handling

```typescript
// Test error scenarios
const testErrorHandling = async () => {
  try {
    // Test with invalid endpoint
    const response = await api.get('/invalid-endpoint');
    console.log('Unexpected success:', response);
  } catch (error) {
    console.log('Expected error caught:', error);
  }
};
```

---

## ✅ Best Practices

### 1. Always Handle Loading States

```typescript
const { members, isLoading, error } = useMemberGetAll();

if (isLoading) {
  return <Spinner />; // Show loading indicator
}

if (error) {
  return <ErrorMessage error={error} onRetry={refetch} />; // Show error with retry
}

// Render your component with data
return <YourComponent members={members} />;
```

### 2. Use Memoization for Expensive Operations

```typescript
const filteredMembers = useMemo(() => {
  return members?.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
}, [members, searchTerm]);
```

### 3. Implement Proper Error Boundaries

```typescript
class MemberErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with member data.</h1>;
    }

    return this.props.children;
  }
}
```

### 4. Use TypeScript for Type Safety

```typescript
interface MemberListProps {
  members: Member[];
  onMemberSelect: (member: Member) => void;
  isLoading?: boolean;
  error?: string | null;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  onMemberSelect,
  isLoading = false,
  error = null
}) => {
  // Your component logic
};
```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Members Not Loading

**Problem:** `members` is always undefined or empty array.

**Solutions:**
- Check if the API endpoint is correct
- Verify authentication headers are being sent
- Check browser console for errors
- Verify the backend is running and accessible

```typescript
// Debug the API call
const fetchMembers = async () => {
  try {
    console.log('Fetching members from:', `${BASE_API_URL}/members/list`);
    const response = await api.get(`${BASE_API_URL}/members/list`);
    console.log('API Response:', response);
    // ... rest of the logic
  } catch (error) {
    console.error('Error fetching members:', error);
  }
};
```

#### 2. Infinite Re-renders

**Problem:** Component keeps re-rendering in a loop.

**Solutions:**
- Check useEffect dependencies
- Ensure state updates don't trigger unnecessary re-renders
- Use useCallback for functions passed as props

```typescript
// Fix infinite re-renders
const fetchMembers = useCallback(async () => {
  // ... fetch logic
}, []); // Empty dependency array

useEffect(() => {
  fetchMembers();
}, [fetchMembers]);
```

#### 3. Type Errors

**Problem:** TypeScript errors related to Member type.

**Solutions:**
- Verify Member interface is imported correctly
- Check if the API response matches the expected type
- Use type guards for runtime type checking

```typescript
// Type guard for Member
const isMember = (obj: any): obj is Member => {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.name === 'string' &&
         typeof obj.email === 'string';
};

// Use in your component
const validMembers = members?.filter(isMember) || [];
```

#### 4. Performance Issues

**Problem:** Component is slow with large member lists.

**Solutions:**
- Implement pagination
- Use virtualization for long lists
- Debounce search inputs
- Memoize expensive calculations

```typescript
// Debounced search
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

useEffect(() => {
  // Only filter when debounced term changes
  // This reduces unnecessary filtering on every keystroke
}, [debouncedSearchTerm]);
```

---

## 📚 Additional Resources

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Query (Alternative to custom hooks)](https://tanstack.com/query/latest)

---

## 🎯 Quick Start Checklist

- [ ] Import the `useMemberGetAll` hook
- [ ] Use the hook in your component
- [ ] Handle loading and error states
- [ ] Display member data
- [ ] Test the functionality
- [ ] Add error handling
- [ ] Optimize performance if needed

---

**Need help?** Check the console for errors, verify your imports, and ensure the backend API is accessible. The `useMemberGetAll` hook should work out of the box for most use cases!
