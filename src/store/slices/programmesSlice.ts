import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Programme, PaginationParams, ProgrammeFilters } from '../../types';
import { programmesApi } from '../../api/programmes';


interface ProgrammesState {
  programmes: Programme[];
  selectedProgramme: Programme | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationParams;
  filters: ProgrammeFilters;
  domaines: string[];
}

const initialState: ProgrammesState = {
  programmes: [],
  selectedProgramme: null,
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
    domaine: '',
    niveau: '',
  },
  domaines: [],
};

// Thunks asynchrones
export const fetchProgrammes = createAsyncThunk(
  'programmes/fetchProgrammes',
  async (
    params: { page: number; limit: number; filters?: ProgrammeFilters },
    { rejectWithValue }
  ) => {
    try {
      const response = await programmesApi.getAll(params);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDomaines = createAsyncThunk(
  'programmes/fetchDomaines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await programmesApi.getDomaines();
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const createProgramme = createAsyncThunk(
  'programmes/createProgramme',
  async (data: Omit<Programme, 'idProgramme'>, { rejectWithValue }) => {
    try {
      const response = await programmesApi.create(data);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const updateProgramme = createAsyncThunk(
  'programmes/updateProgramme',
  async ({ id, data }: { id: number; data: Partial<Programme> }, { rejectWithValue }) => {
    try {
      const response = await programmesApi.update(id, data);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProgramme = createAsyncThunk(
  'programmes/deleteProgramme',
  async (id: number, { rejectWithValue }) => {
    try {
      await programmesApi.delete(id);
      return id;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

const programmesSlice = createSlice({
  name: 'programmes',
  initialState,
  reducers: {
    setSelectedProgramme: (state, action: PayloadAction<Programme | null>) => {
      state.selectedProgramme = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProgrammeFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Programmes
      .addCase(fetchProgrammes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgrammes.fulfilled, (state, action) => {
        state.loading = false;
        state.programmes = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchProgrammes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Domaines
      .addCase(fetchDomaines.fulfilled, (state, action) => {
        state.domaines = action.payload;
      })
      // Create
      .addCase(createProgramme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgramme.fulfilled, (state, action) => {
        state.loading = false;
        state.programmes.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(createProgramme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateProgramme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgramme.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.programmes.findIndex(
          (p) => p.idProgramme === action.payload.data.idProgramme
        );
        if (index !== -1) {
          state.programmes[index] = action.payload.data;
        }
      })
      .addCase(updateProgramme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteProgramme.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgramme.fulfilled, (state, action) => {
        state.loading = false;
        state.programmes = state.programmes.filter(
          (p) => p.idProgramme !== action.payload
        );
        state.pagination.total -= 1;
      })
      .addCase(deleteProgramme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedProgramme, setFilters, resetFilters, clearError } =
  programmesSlice.actions;
export default programmesSlice.reducer;
