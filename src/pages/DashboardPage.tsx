import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/storeRedux';
import { ProjectData } from '../interface';
import axios from 'axios';

const DashboardPage: React.FC = () => {
  const token = useSelector((state: RootState) => state.localStorage.value);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);

  const fetchProjectData = async () => {
    try {
      const response = await axios.get('http://localhost:6347/api/proyek', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setProjectData(response.data.data);
      console.log(response.data.data);

    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };
  const rows = [
    { id: 1, name: 'Project A', quantity: 120, location: 'Warehouse 1' },
    { id: 2, name: 'Project B', quantity: 80, location: 'Warehouse 2' },
    { id: 3, name: 'Project C', quantity: 150, location: 'Warehouse 3' },
  ];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Project Name', width: 200 },
  ];

  useEffect(() => {
    fetchProjectData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Box className="mb-12">
        <Typography variant="h4" className="text-4xl font-bold" sx={{ color: '#65558f', mb: 2, mx: 3 }}>
          Dashboard
        </Typography>
      </Box>
      <Box className="border-2 rounded-lg h-[80vh] shadow-2xl mx-3" sx={{ padding: 2 }}>
        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Project</Typography>
                <Typography variant="h4">{projectData.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Active Project</Typography>
                <Typography variant="h4">3</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Pending Project</Typography>
                <Typography variant="h4">27</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Completed Project</Typography>
                <Typography variant="h4">120</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Data Table */}
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Project
          </Typography>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection />
          </div>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
