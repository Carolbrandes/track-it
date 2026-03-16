import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

// Define the structure of the data we expect to export
export interface TransactionForExport {
  date: Date | string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string | { name: string };
  currency: string;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const formatDate = (date: Date | string) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

const getCategoryName = (category: string | { name: string }) => {
  if (typeof category === 'string') return category;
  return category?.name || 'Uncategorized';
};

export const exportToCSV = (data: TransactionForExport[], filename: string) => {
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Currency'];
  const rows = data.map((item) => [
    formatDate(item.date),
    `"${item.description.replaceAll(/"/g, '""')}"`, // Escape quotes
    item.amount,
    item.type,
    `"${getCategoryName(item.category).replaceAll(/"/g, '""')}"`,
    item.currency,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export const exportToXML = (data: TransactionForExport[], filename: string) => {
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<transactions>\n';

  data.forEach((item) => {
    xmlContent += '  <transaction>\n';
    xmlContent += `    <date>${formatDate(item.date)}</date>\n`;
    xmlContent += `    <description>${item.description.replaceAll(/&/g, '&amp;').replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;')}</description>\n`;
    xmlContent += `    <amount>${item.amount}</amount>\n`;
    xmlContent += `    <type>${item.type}</type>\n`;
    xmlContent += `    <category>${getCategoryName(item.category).replaceAll(/&/g, '&amp;').replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;')}</category>\n`;
    xmlContent += `    <currency>${item.currency}</currency>\n`;
    xmlContent += '  </transaction>\n';
  });

  xmlContent += '</transactions>';

  const blob = new Blob([xmlContent], { type: 'text/xml;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xml`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export const exportToPDF = (data: TransactionForExport[], filename: string) => {
  const doc = new jsPDF();

  const tableColumn = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Currency'];
  const tableRows: any[] = [];

  data.forEach((item) => {
    const transactionData = [
      formatDate(item.date),
      item.description,
      formatCurrency(item.amount, item.currency),
      item.type,
      getCategoryName(item.category),
      item.currency,
    ];
    tableRows.push(transactionData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.text('Transaction Report', 14, 15);
  doc.save(`${filename}.pdf`);
};

export const exportElementToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Improve quality
      useCORS: true, // Handle images from other domains if any
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape', // Charts often look better in landscape
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
