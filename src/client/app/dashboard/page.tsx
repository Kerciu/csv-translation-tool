import CSVUploader from '@/components/csv-uploader'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'

const Dashboard = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <CSVUploader />
      </main>

      <Footer/>
    </div>
  )
}

export default Dashboard