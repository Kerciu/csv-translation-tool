import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

const RowRangeSelector = () => {
  return (
    <Card>
        <CardContent>
            <div>
                <div>
                    <div>
                        Start Row
                    </div>

                    <div>
                        End Row
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