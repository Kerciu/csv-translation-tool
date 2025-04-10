'use client';

import CSVTable from '@/components/csv-table';
import CSVUploader from '@/components/csv-uploader'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React, { useState } from 'react'

const Dashboard = () => {

    const [fileUploaded, setFileUploaded] = useState<boolean>(true);

    const handleFileUpload = () => {}

    return (
        <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
            {fileUploaded ?
                <CSVTable />
                :
                <CSVUploader onFileUpload={handleFileUpload}/>
            }
        </main>

        <Footer/>
        </div>
    )
}

export default Dashboard