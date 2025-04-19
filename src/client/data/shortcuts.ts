type Shortcut = {
    action: string;
    shortcut: string;
    description: string;
}

const shortcuts: Shortcut[] = [
    {
        action: "Select a single row",
        shortcut: "Click on row #",
        description: "Click on the row number to select a single row",
      },
      {
        action: "Select a range of rows",
        shortcut: "Shift + Click",
        description: "Click on a row number, then Shift+Click on another row to select all rows in between",
      },
      {
        action: "Select/deselect multiple rows",
        shortcut: "Ctrl/Cmd + Click",
        description: "Hold Ctrl (Windows) or Cmd (Mac) and click on row numbers to select or deselect multiple rows",
      },
      {
        action: "Deselect all rows",
        shortcut: "Escape",
        description: "Press Escape to clear all row selections",
      },
]

export default shortcuts;