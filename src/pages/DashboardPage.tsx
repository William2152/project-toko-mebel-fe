import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/storeRedux';
import { ProjectData } from '../interface';
import axios from 'axios';
import {
  AssignmentOutlined,
  CheckCircleOutline,
  HourglassEmptyOutlined,
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  const token = useSelector((state: RootState) => state.localStorage.value);
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [projectDataSelesai, setProjectDataSelesai] = useState<ProjectData[]>([]);
  const [projectDataActive, setProjectDataActive] = useState<ProjectData[]>([]);

  const fetchProjectData = async () => {
    try {
      const response = await axios.get('http://localhost:6347/api/proyek', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectData(response.data.data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const fetchProjectSelesai = async () => {
    try {
      const response = await axios.get('http://localhost:6347/api/master/proyek?status=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectDataSelesai(response.data.data);
    } catch (error) {
      console.error('Error fetching project selesai:', error);
    }
  };

  const fetchProjectActive = async () => {
    try {
      const response = await axios.get('http://localhost:6347/api/master/proyek?status=false', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectDataActive(response.data.data);
    } catch (error) {
      console.error('Error fetching active project:', error);
    }
  };

  const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-GB').format(new Date(date));
  };

  const formattedProjectData = projectData.map((project) => ({
    ...project,
    start: formatDate(project.start),
    deadline: formatDate(project.deadline),
  }));

  useEffect(() => {
    fetchProjectData();
    fetchProjectSelesai();
    fetchProjectActive();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nama', headerName: 'Project Name', width: 200 },
    { field: 'start', headerName: 'Start Date', width: 200 },
    { field: 'deadline', headerName: 'Deadline', width: 200 },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#3f51b5' }}>
        Dashboard
      </Typography>

      {/* Statistic Cards */}
      <Grid container spacing={4} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AssignmentOutlined sx={{ verticalAlign: 'middle', mr: 1, color: '#1976d2' }} />
                Total Projects
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {projectData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#f9fbe7' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <HourglassEmptyOutlined sx={{ verticalAlign: 'middle', mr: 1, color: '#8bc34a' }} />
                Active Projects
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8bc34a' }}>
                {projectDataActive.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CheckCircleOutline sx={{ verticalAlign: 'middle', mr: 1, color: '#4caf50' }} />
                Completed Projects
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {projectDataSelesai.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
          Recent Projects
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={formattedProjectData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            components={{ Toolbar: GridToolbar }}
            sx={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: 1 }}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
