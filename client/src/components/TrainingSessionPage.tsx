import React from 'react';
import MyAppBar from './MyAppBar';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import NewSessionButton from './NewSessionButton';

const TrainingSessionPage: React.FC = () => {
    return (
      <>
        <MyAppBar/>
        <Box sx={{ height:'100%', width: '100%', '& > *': { mt: 1 } }}>
          <NewSessionButton/>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
            pagination: {
              paginationModel: {
              pageSize: 5,
              },
            },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </>
    );
}

const columns: GridColDef<typeof rows[number]>[] = [
  {
    field:'id',
    headerName:'ID',
    width: 90,
  },
  { 
    field: 'dateTime', 
    headerName: 'Date and Time', 
    width: 160 
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
    editable: false,
  },
  {
    field: 'notes',
    headerName: 'Notes',
    width: 150,
    editable: false,
  },
  {
    field: 'duration',
    headerName: 'Duration',
    type: 'number',
    width: 110,
    editable: false,
  },
  {
    field: 'fingerLoad',
    headerName: 'Finger Load',
    type: 'number',
    width: 160,
    editable: false,
  },
  {
    field: 'upperLoad',
    headerName: 'Upper Load',
    type: 'number',
    width: 160,
    editable: false,
  },
  {
    field: 'lowerLoad',
    headerName: 'Lower Load',
    type: 'number',
    width: 160,
    editable: false,
  },
  {
    field: 'fingerStrain',
    headerName: 'Finger Strain',
    type: 'number',
    width: 160,
    editable: false,
  },
  {
    field: 'upperStrain',
    headerName: 'Upper Strain',
    type: 'number',
    width: 160,
    editable: false,
  },
  {
    field: 'lowerStrain',
    headerName: 'Lower Strain',
    type: 'number',
    width: 160,
    editable: false,
  }
];

const rows = [
  { id:1, dateTime: '03/17/24 7:00PM', name: 'Bouldering', notes:'slab, cave', duration:2, fingerLoad:6, upperLoad:6, lowerLoad:3, fingerStrain:2, upperStrain:2, lowerStrain:1 },
  { id:2, dateTime: '03/20/24 8:00PM', name: 'Cardio, Bouldering, Power/Strength Endurance', notes:'Biked to slaughter, felt great on the wall!', duration:2, fingerLoad:8, upperLoad:9, lowerLoad:2, fingerStrain:2, upperStrain:2, lowerStrain:1 },
];

export default TrainingSessionPage;