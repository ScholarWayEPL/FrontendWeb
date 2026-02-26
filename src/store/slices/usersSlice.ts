import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Bachelier, PaginationParams } from '../../types';
import { usersApi } from '../../api/users';

interface UsersFilters {
  search: string;
  serieBac: string;
}

interface UsersState {
  bacheliers: Bachelier[];
  selectedBachelier: Bachelier | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationParams;
  filters: UsersFilters;
  series: string[];
}

const initialState: UsersState = {
  bacheliers: [],
  selectedBachelier: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    serieBac: '',
  },
  series: [],
};

// Thunks asynchrones
export const fetchBacheliers = createAsyncThunk(
  'users/fetchBacheliers',
  async (
    params: { page: number; limit: number; filters?: UsersFilters },
    { rejectWithValue }
  ) => {
    try {
      const response = await usersApi.getAll(params);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSeries = createAsyncThunk(
  'users/fetchSeries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersApi.getSeries();
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const createBachelier = createAsyncThunk(
  'users/createBachelier',
  async (data: Omit<Bachelier, 'idUtilisateur' | 'dateCreation'>, { rejectWithValue }) => {
    try {
      const response = await usersApi.create(data);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const updateBachelier = createAsyncThunk(
  'users/updateBachelier',
  async ({ id, data }: { id: number; data: Partial<Bachelier> }, { rejectWithValue }) => {
    try {
      const response = await usersApi.update(id, data);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBachelier = createAsyncThunk(
  'users/deleteBachelier',
  async (id: number, { rejectWithValue }) => {
    try {
      await usersApi.delete(id);
      return id;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedBachelier: (state, action: PayloadAction<Bachelier | null>) => {
      state.selectedBachelier = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<UsersFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { search: '', serieBac: '' };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bacheliers
      .addCase(fetchBacheliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBacheliers.fulfilled, (state, action) => {
        state.loading = false;
        state.bacheliers = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchBacheliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch series
      .addCase(fetchSeries.fulfilled, (state, action) => {
        state.series = action.payload;
      })
      // Create
      .addCase(createBachelier.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBachelier.fulfilled, (state, action) => {
        state.loading = false;
        state.bacheliers.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(createBachelier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateBachelier.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBachelier.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bacheliers.findIndex(
          (b) => b.idUtilisateur === action.payload.data.idUtilisateur
        );
        if (index !== -1) {
          state.bacheliers[index] = action.payload.data;
        }
      })
      .addCase(updateBachelier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteBachelier.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBachelier.fulfilled, (state, action) => {
        state.loading = false;
        state.bacheliers = state.bacheliers.filter((b) => b.idUtilisateur !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteBachelier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedBachelier, setFilters, resetFilters, clearError } = usersSlice.actions;
export default usersSlice.reducer;
