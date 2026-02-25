import type { SxProps, Theme } from '@mui/material';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { BORDER_RADIUS } from '../../constants';

interface SearchFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
    size?: 'small' | 'medium';
    sx?: SxProps<Theme>;
}

const SearchField: React.FC<SearchFieldProps> = ({
    value,
    onChange,
    placeholder = 'Rechercher...',
    fullWidth = false,
    size = 'small',
    sx,
}) => {
    return (
        <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            size={size}
            fullWidth={fullWidth}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                ),
            }}
            sx={{
                minWidth: fullWidth ? 'auto' : 280,
                '& .MuiOutlinedInput-root': {
                    borderRadius: BORDER_RADIUS.sm,
                    bgcolor: 'grey.50',
                    '&:hover': {
                        bgcolor: 'grey.100',
                    },
                    '&.Mui-focused': {
                        bgcolor: 'white',
                    },
                },
                ...sx,
            }}
        />
    );
};

export default SearchField;
