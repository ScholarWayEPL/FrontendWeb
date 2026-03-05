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
                    bgcolor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    },
                    '&.Mui-focused': {
                        bgcolor: 'background.paper',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '2px',
                        },
                    },
                    '& fieldset': {
                        borderColor: 'transparent',
                        transition: 'border-color 0.2s',
                    },
                },
                ...sx,
            }}
        />
    );
};

export default SearchField;
