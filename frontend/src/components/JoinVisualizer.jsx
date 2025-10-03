import React from 'react';
import { Box, Typography, Paper, Grid, useTheme } from '@mui/material';

const VennDiagram = ({ joinType, leftTable, rightTable, highlightedArea, description }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const getCircleStyle = (position) => {
        const baseStyle = {
            width: 140,
            height: 140,
            borderRadius: '50%',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 600,
            border: `3px solid ${theme.palette.primary.main}`,
            transition: 'all 0.3s ease',
            padding: '12px',
            textAlign: 'center',
            wordBreak: 'break-word',
            lineHeight: 1.2
        };

        const isHighlighted =
            (position === 'left' && (highlightedArea === 'left-and-intersection' || highlightedArea === 'all')) ||
            (position === 'right' && (highlightedArea === 'right-and-intersection' || highlightedArea === 'all')) ||
            (position === 'intersection' && (highlightedArea === 'intersection' || highlightedArea === 'left-and-intersection' || highlightedArea === 'right-and-intersection' || highlightedArea === 'all'));

        return {
            ...baseStyle,
            backgroundColor: isHighlighted
                ? isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'
                : isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            left: position === 'left' ? 0 : 70,
            zIndex: position === 'left' ? 1 : 2,
            color: theme.palette.text.primary
        };
    };

    return (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
                {joinType}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {description}
            </Typography>

            <Box sx={{
                position: 'relative',
                height: 160,
                width: 230,
                margin: '0 auto',
                mb: 2
            }}>
                <Box sx={getCircleStyle('left')}>
                    {leftTable}
                </Box>
                <Box sx={getCircleStyle('right')}>
                    {rightTable}
                </Box>
            </Box>
        </Box>
    );
};

const DataTable = ({ title, data, highlightRows = [] }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Handle case where data is a string (like "Same as Table A")
    if (typeof data === 'string') {
        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {title}
                </Typography>
                <Box sx={{ 
                    p: 2,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: 1,
                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary
                }}>
                    {data}
                </Box>
            </Box>
        );
    }

    if (!data || !Array.isArray(data) || data.length === 0) return null;

    const columns = Object.keys(data[0]);

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {title}
            </Typography>
            <Box sx={{
                overflowX: 'auto',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 1
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem'
                }}>
                    <thead>
                        <tr style={{
                            backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'
                        }}>
                            {columns.map(col => (
                                <th key={col} style={{
                                    padding: '8px 12px',
                                    textAlign: 'left',
                                    fontWeight: 600,
                                    borderBottom: `2px solid ${theme.palette.primary.main}`
                                }}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx} style={{
                                backgroundColor: highlightRows.includes(idx)
                                    ? isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
                                    : 'transparent'
                            }}>
                                {columns.map(col => (
                                    <td key={col} style={{
                                        padding: '8px 12px',
                                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                                        color: row[col] === null ? theme.palette.text.disabled : theme.palette.text.primary,
                                        fontStyle: row[col] === null ? 'italic' : 'normal'
                                    }}>
                                        {row[col] === null ? 'NULL' : row[col]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

export default function JoinVisualizer({ visualData }) {
    const theme = useTheme();

    if (!visualData) return null;

    // Handle single diagram or array of diagrams
    const diagrams = Array.isArray(visualData) ? visualData : [visualData];

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                mb: 3,
                backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
            }}
        >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                📊 Visual Guide to SQL JOINs
            </Typography>

            <Grid container spacing={3}>
                {diagrams.map((diagram, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <VennDiagram
                            joinType={diagram.joinType}
                            leftTable={diagram.leftTable}
                            rightTable={diagram.rightTable}
                            highlightedArea={diagram.highlightedArea}
                            description={diagram.description}
                        />

                        {diagram.example && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                                    Example:
                                </Typography>
                                <DataTable
                                    title="Table A (Input)"
                                    data={diagram.example.tableA}
                                />
                                <DataTable
                                    title="Table B (Input)"
                                    data={diagram.example.tableB}
                                />
                                <DataTable
                                    title="Result"
                                    data={diagram.example.result}
                                    highlightRows={diagram.example.result.map((_, i) => i)}
                                />
                            </Box>
                        )}
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}
