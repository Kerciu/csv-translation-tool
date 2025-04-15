import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'

interface RowRangeSelectorProps {
    totalRows: number
}

const RowRangeSelector = ({ totalRows }: RowRangeSelectorProps) => {

    const [startRow, setStartRow] = useState<number>(1);
    const [endRow, setEndRow] = useState<number>(1);
    
    const handleStartRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= totalRows)
        {
            setStartRow(value);
            if (value > endRow)
            {
                setEndRow(value);
            }
        }
    }

    const handleEndRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value);
        if (!isNaN(value) && value >= startRow && value <= totalRows)
        {
            setEndRow(value);
        }
    }

    return (
        <Card>
            <CardContent className='pt-6'>
                <div className='flex flex-col space-y-4'>

                    <div className='flex items-center justify-between'>
                        <h3 className='text-lg font-medium'>Row Selection</h3>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label  htmlFor='start-row'>
                                Start Row
                            </Label>
                            <Input
                                id='start-row'
                                type='number'
                                min={1}
                                max={totalRows}
                                value={startRow}
                                onChange={handleStartRowChange}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label  htmlFor='end-row'>
                                End Row
                            </Label>
                            <Input
                                id='end-row'
                                type='number'
                                min={1}
                                max={totalRows}
                                value={endRow}
                                onChange={handleEndRowChange}
                            />
                        </div>
                    </div>

                    <div className='flex justify-between items-center'>
                        <div className='text-sm text-muted-foreground'>
                            Selected {endRow - startRow + 1} of {totalRows} rows
                        </div>

                        <Button variant='outline' size='sm'>
                            Select All Rows
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default RowRangeSelector