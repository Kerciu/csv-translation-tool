export type Shortcut = {
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
    {
        action: "Translate selected content",
        shortcut: "Space",
        description: "Press Space to translate the selected columns and rows",
    },
    {
        action: "Download CSV file",
        shortcut: "Ctrl/Cmd + S",
        description: "Press Ctrl+S (Windows) or Cmd+S (Mac) to download the current CSV file",
    },
    {
        action: "Edit a cell",
        shortcut: "Click on cell",
        description: "Click on a translated cell in a selected column to edit its content",
    },
    {
        action: "Save cell edit",
        shortcut: "Enter",
        description: "Press Enter to save your changes when editing a cell",
    },
    {
        action: "Cancel cell edit",
        shortcut: "Escape",
        description: "Press Escape to cancel your changes when editing a cell",
    },
]

export default shortcuts;