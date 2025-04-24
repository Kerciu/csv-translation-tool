import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion'
import faqs from '@/data/faqs'

const FAQSection = () => {
  return (
    <section className='py-12 bg-background'>
      <div className='container px-4 mx-auto'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold'>Frequently Asked Questions</h2>
          <p className='text-muted-foreground mt-2'>Learn more about our CSV translation tool</p>
        </div>

        <div className='max-w-3xl mx-auto'>
          <Accordion type='single' collapsible className='w-full'>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FAQSection