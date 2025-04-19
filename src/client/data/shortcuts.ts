type Shortcut = {
    action: string;
    shortcut: string;
    description: string;
}

const shortcuts: Shortcut[] = [
    {
        action: "Select a range of rows",
        shortcut: "Shift + Click",
        description: "Click on a row number, then Shift+Click on another row to select all rows in between."
    }
]

export default shortcuts;