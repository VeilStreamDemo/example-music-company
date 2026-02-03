import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoicesApi } from '../services/api';
import { Invoice } from '../types';
import {
  Box,
  CircularProgress,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Home, Receipt, People } from '@mui/icons-material';

export const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      try {
        const invoiceData = await invoicesApi.getById(Number(id));
        setInvoice(invoiceData);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box p={4}>
        <Typography variant="h4">Invoice not found</Typography>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (value: number | string) => {
    return `$${Number(value).toFixed(2)}`;
  };

  const customerName = invoice.customer
    ? `${invoice.customer.first_name} ${invoice.customer.last_name}`
    : 'Unknown Customer';

  const lineItemTotal = (unitPrice: number, quantity: number) => {
    return Number(unitPrice) * quantity;
  };

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
        {invoice.customer_id && (
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/customers/${invoice.customer_id}`);
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            {customerName}
          </Link>
        )}
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <Receipt sx={{ mr: 0.5 }} fontSize="inherit" />
          Invoice #{invoice.invoice_id}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Invoice #{invoice.invoice_id}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Invoice Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Date:</strong> {formatDate(invoice.invoice_date)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Customer:</strong>{' '}
              {invoice.customer_id ? (
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/customers/${invoice.customer_id}`);
                  }}
                >
                  {customerName}
                </Link>
              ) : (
                customerName
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Total:</strong> {formatCurrency(invoice.total)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Billing Address
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {invoice.billing_address || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.billing_city && invoice.billing_state
                ? `${invoice.billing_city}, ${invoice.billing_state}`
                : invoice.billing_city || invoice.billing_state || ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.billing_country || ''} {invoice.billing_postal_code || ''}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Line Items
        </Typography>
        {invoice.invoice_lines && invoice.invoice_lines.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Track</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Unit Price</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Quantity</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Line Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.invoice_lines.map((line) => (
                  <TableRow key={line.invoice_line_id}>
                    <TableCell>
                      {line.track?.name || `Track ID: ${line.track_id}`}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(line.unit_price)}
                    </TableCell>
                    <TableCell align="right">{line.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(lineItemTotal(line.unit_price, line.quantity))}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <strong>Total:</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{formatCurrency(invoice.total)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No line items found for this invoice.
          </Typography>
        )}
      </Box>
    </Box>
  );
};


