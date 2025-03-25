import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../constants";
import { NewMember, ICreateBody } from "../../types/member";

interface MemberState {
    loading: boolean;
    members: NewMember[];
    member: NewMember | null;
    error: string;
}

const initialState: MemberState = {
    loading: false,
    members: [],
    member: null,
    error: ""
};

// Fetch all members
export const fetchMembers = createAsyncThunk("members/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/members`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data.message || DEFAULT_ERROR_MESSAGE);
        }
        return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
});

// Fetch single member by ID
export const fetchMemberById = createAsyncThunk("members/fetchById", async (id: string, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/members/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data.message || DEFAULT_ERROR_MESSAGE);
        }
        return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
});

// Create a new member
export const createMember = createAsyncThunk("members/create", async (data: ICreateBody, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/members`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data.message || DEFAULT_ERROR_MESSAGE);
        }
        return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
});

// Update a member
export const updateMember = createAsyncThunk("members/update", async ({ id, data }: { id: string, data: ICreateBody }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${BASE_API_URL}/members/${id}`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data.message || DEFAULT_ERROR_MESSAGE);
        }
        return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
});

// Delete a member
export const deleteMember = createAsyncThunk("members/delete", async (id: string, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE_API_URL}/members/${id}`);
        return id;
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data.message || DEFAULT_ERROR_MESSAGE);
        }
        return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
});

export const memberSlice = createSlice({
    name: "members",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all members
            .addCase(fetchMembers.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(fetchMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch single member
            .addCase(fetchMemberById.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(fetchMemberById.fulfilled, (state, action) => {
                state.loading = false;
                state.member = action.payload;
            })
            .addCase(fetchMemberById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create member
            .addCase(createMember.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(createMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members.push(action.payload);
            })
            .addCase(createMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update member
            .addCase(updateMember.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(updateMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members = state.members.map(member => 
                    member.id === action.payload.id ? action.payload : member);
            })
            .addCase(updateMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete member
            .addCase(deleteMember.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(deleteMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members = state.members.filter(member => member.id !== action.payload);
            })
            .addCase(deleteMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default memberSlice.reducer;
