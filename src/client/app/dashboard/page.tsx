import CSVUploader from '@/components/csv-uploader'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'

const Dashboard = () => {

    const onFileUpload = () => {}
    return (
        <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
            <CSVUploader onFileUpload={onFileUpload}/>
        </main>

        <Footer/>
        </div>
    )
}

export default Dashboard