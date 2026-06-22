import { pdf } from '@react-pdf/renderer';
import { ExportPDFStyle } from '../ExportPDFStyle';

export const useExportPDF = () => {
  const exportToPDF = async (editor) => {
    const jsonContent = editor.getJSON().content; // Editor se data uthao
    console.log(jsonContent)
    // PDF generate karo
    const blob = await pdf(<ExportPDFStyle content={jsonContent} />).toBlob();

    // Download trigger karo
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-document.pdf';
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  };

  return { exportToPDF };
};