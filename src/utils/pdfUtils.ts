import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Add the autoTable type to jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Define the type for the didDrawPage data parameter
interface AutoTableData {
  settings: {
    margin: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    };
  };
  pageNumber: number;
  pageCount: number;
  cursor: {
    x: number;
    y: number;
  };
}

/**
 * Creates a new jsPDF instance with autoTable functionality
 * @returns A jsPDF instance with autoTable functionality
 */
export const createPDF = (): jsPDF => {
  return new jsPDF();
};

/**
 * Exports data to a PDF file
 * @param filename The name of the file to save
 * @param title The title to display at the top of the PDF
 * @param headers The column headers for the table
 * @param data The data to display in the table
 * @param options Additional options for the PDF
 */
export const exportToPDF = (
  filename: string,
  title: string,
  headers: string[],
  data: any[][],
  options: {
    fontSize?: number;
    theme?: 'striped' | 'grid' | 'plain';
    addPageNumbers?: boolean;
  } = {}
): void => {
  try {
    const doc = createPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Set default options
    const fontSize = options.fontSize || 10;
    const theme = options.theme || 'striped';
    const addPageNumbers = options.addPageNumbers !== false;
    
    // Add table
    doc.autoTable({
      startY: 30,
      head: [headers],
      body: data,
      styles: {
        fontSize,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      margin: { top: 30 },
      theme,
      didDrawPage: addPageNumbers ? (data: AutoTableData) => {
        // Add page number at the bottom
        doc.setFontSize(10);
        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      } : undefined
    });
    
    // Save the PDF
    doc.save(filename);
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw new Error('Failed to create PDF');
  }
}; 