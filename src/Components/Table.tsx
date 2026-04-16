import "react-data-grid/lib/styles.css";
import { DataGrid } from "react-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import type { Contribution } from "../types/entities";

interface TableProps {
  myContribution: Contribution[];
}

interface ContributionRow {
  id: number;
  title: string;
  category: string;
  amount: string;
  date: string;
}

const Table = ({ myContribution }: TableProps) => {
  const columns = [
    { key: "id", name: "SL NO", width: 80 },
    { key: "title", name: "Title", resizable: true },
    { key: "category", name: "Category" },
    { key: "amount", name: "Budget ($)", width: 120 },
    { key: "date", name: "Date Reported", width: 150 },
  ];

  const rows: ContributionRow[] = myContribution.map((item, index) => ({
    id: index + 1,
    title: item.title,
    category: item.category,
    amount: `$${item.amount}`,
    date: item.date,
  }));

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Contribution Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = columns.map((col) => col.name);
    const tableRows = rows.map((row) => [row.id, row.title, row.category, row.amount, row.date]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save("CleanCity_Contributions.pdf");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          onClick={exportToPDF}
          className="btn btn-secondary gap-2 rounded-2xl font-bold shadow-lg shadow-secondary/20"
        >
          <Download size={20} />
          Export to PDF
        </button>
      </div>

      <div className="max-w-[100vw] overflow-hidden overflow-x-auto rounded-2xl border border-base-200 shadow-sm">
        <DataGrid
          columns={columns}
          rows={rows}
          className="rdg-light h-[500px]"
          rowHeight={60}
          headerRowHeight={50}
        />
      </div>

      <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-base-content/40">
        End of data • {myContribution.length} records found
      </p>
    </div>
  );
};

export default Table;
