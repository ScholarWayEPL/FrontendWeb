import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Etablissement, PaginationParams, EtablissementFilters } from '../../types';
import { etablissementsApi } from '../../api/etablissements';

interface EtablissementsState {
  etablissements: Etablissement[];
  selectedEtablissement: Etablissement | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationParams;
  filters: EtablissementFilters;
}

const initialState: EtablissementsState = {
  etablissements: [],
  selectedEtablissement: null,
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
    type: '',
    localisation: '',
  },
};

// Thunks asynchrones
export const fetchEtablissements = createAsyncThunk(
  'etablissements/fetchEtablissements',
  async (
    params: { page: number; limit: number; filters?: EtablissementFilters },
    { rejectWithValue }
  ) => {
    try {
      const response = await etablissementsApi.getAll(params);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const createEtablissement = createAsyncThunk(
  'etablissements/createEtablissement',
  async (data: Omit<Etablissement, 'idEtablissement'>, { rejectWithValue }) => {
    try {
      const response = await etablissementsApi.create(data);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const updateEtablissement = createAsyncThunk(
  'etablissements/updateEtablissement',
  async ({ id, data }: { id: number; data: Partial<Etablissement> }, { rejectWithValue }) => {
    try {
      const response = await etablissementsApi.update(id, data);
      return response;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

export const deleteEtablissement = createAsyncThunk(
  'etablissements/deleteEtablissement',
  async (id: number, { rejectWithValue }) => {
    try {
      await etablissementsApi.delete(id);
      return id;
    } catch (error: unknown) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

const etablissementsSlice = createSlice({
  name: 'etablissements',
  initialState,
  reducers: {
    setSelectedEtablissement: (state, action: PayloadAction<Etablissement | null>) => {
      state.selectedEtablissement = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EtablissementFilters>>) => {
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
      // Fetch
      .addCase(fetchEtablissements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEtablissements.fulfilled, (state, action) => {
        state.loading = false;
        state.etablissements = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchEtablissements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createEtablissement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEtablissement.fulfilled, (state, action) => {
        state.loading = false;
        state.etablissements.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(createEtablissement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateEtablissement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEtablissement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.etablissements.findIndex(
          (e) => e.idEtablissement === action.payload.data.idEtablissement
        );
        if (index !== -1) {
          state.etablissements[index] = action.payload.data;
        }
      })
      .addCase(updateEtablissement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteEtablissement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEtablissement.fulfilled, (state, action) => {
        state.loading = false;
        state.etablissements = state.etablissements.filter(
          (e) => e.idEtablissement !== action.payload
        );
        state.pagination.total -= 1;
      })
      .addCase(deleteEtablissement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedEtablissement, setFilters, resetFilters, clearError } =
  etablissementsSlice.actions;
export default etablissementsSlice.reducer;
