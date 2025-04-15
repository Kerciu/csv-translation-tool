import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'

const RowRangeSelector = () => {

    const [startRow, setStartRow] = useState<number>(1);
    const [endRow, setEndRow] = useState<number>(1);
        
    return (
        <Card>
            <CardContent>
                <div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label  htmlFor='start-row'>
                                Start Row
                            </Label>
                            <Input
                                id='start-row'
                                type='number'
                                value={startRow}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label  htmlFor='end-row'>
                                End Row
                            </Label>
                            <Input
                                id='end-row'
                                type='number'
                                value={endRow}
                            />
                        </div>
                    </div>

                    <div>
                        <div> Selected # of # rows</div>

                        <Button>
                            Select All Rows
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default RowRangeSelector