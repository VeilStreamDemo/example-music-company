import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { customersApi, invoicesApi } from '../services/api';
import { Customer, Invoice } from '../types';
import {
  Box,
  CircularProgress,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { Home, People } from '@mui/icons-material';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [customerData, invoicesData] = await Promise.all([
          customersApi.getById(Number(id)),
          invoicesApi.getAll(0, 1000, Number(id)),
        ]);
        setCustomer(customerData);
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box p={4}>
        <Typography variant="h4">Customer not found</Typography>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (value: number | string) => {
    return `$${Number(value).toFixed(2)}`;
  };

  const totalSpent = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);

  const invoiceColumns = [
    { id: 'invoice_id', label: 'Invoice ID', minWidth: 100 },
    {
      id: 'invoice_date',
      label: 'Date',
      minWidth: 120,
      format: (value: string) => formatDate(value),
    },
    { id: 'billing_city', label: 'Billing City', minWidth: 150 },
    { id: 'billing_country', label: 'Billing Country', minWidth: 120 },
    {
      id: 'total',
      label: 'Total',
      minWidth: 100,
      align: 'right' as const,
      format: (value: number | string) => formatCurrency(value),
    },
  ];

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/customers');
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Customers
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <People sx={{ mr: 0.5 }} fontSize="inherit" />
          {customer.first_name} {customer.last_name}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        {customer.first_name} {customer.last_name}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {customer.email || 'N/A'}
            </Typography>
            {customer.phone && (
              <Typography variant="body2" color="text.secondary">
                <strong>Phone:</strong> {customer.phone}
              </Typography>
            )}
            {customer.company && (
              <Typography variant="body2" color="text.secondary">
                <strong>Company:</strong> {customer.company}
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Address
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {customer.address || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer.city && customer.state
                ? `${customer.city}, ${customer.state}`
                : customer.city || customer.state || ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer.country || ''} {customer.postal_code || ''}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Purchase History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total Invoices: {invoices.length} | Total Spent: {formatCurrency(totalSpent)}
        </Typography>
      </Box>

      <EntityList
        title=""
        columns={invoiceColumns}
        data={invoices.map((i) => ({ ...i, id: i.invoice_id }))}
        onRowClick={(invoiceId) => navigate(`/invoices/${invoiceId}`)}
      />
    </Box>
  );
};

