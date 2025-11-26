import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { customersApi } from '../services/api';
import { Customer } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await customersApi.getAll();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    { id: 'customer_id', label: 'ID', minWidth: 50 },
    { id: 'first_name', label: 'First Name', minWidth: 120 },
    { id: 'last_name', label: 'Last Name', minWidth: 120 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'city', label: 'City', minWidth: 100 },
    { id: 'country', label: 'Country', minWidth: 100 },
  ];

  return (
    <EntityList
      title="Customers"
      columns={columns}
      data={customers.map(c => ({ ...c, id: c.customer_id }))}
      onRowClick={(id) => navigate(`/customers/${id}`)}
    />
  );
};

