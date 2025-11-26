import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { invoicesApi } from '../services/api';
import { Invoice } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoicesApi.getAll();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { id: 'invoice_id', label: 'ID', minWidth: 50 },
    {
      id: 'invoice_date',
      label: 'Date',
      minWidth: 100,
      format: (value: string) => formatDate(value),
    },
    { id: 'customer_name', label: 'Customer', minWidth: 200 },
    { id: 'billing_country', label: 'Country', minWidth: 100 },
    {
      id: 'total',
      label: 'Total',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number | string) => `$${Number(value).toFixed(2)}`,
    },
  ];

  return (
    <EntityList
      title="Invoices"
      columns={columns}
      data={invoices.map(i => ({
        ...i,
        id: i.invoice_id,
        customer_name: i.customer
          ? `${i.customer.first_name} ${i.customer.last_name}`
          : '-',
      }))}
      onRowClick={(id) => navigate(`/invoices/${id}`)}
    />
  );
};

