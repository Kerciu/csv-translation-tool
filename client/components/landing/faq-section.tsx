import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import faqs from '@/data/faqs';

const FAQSection = () => {
  return (
    <section className='bg-background py-12'>
      <div className='container mx-auto px-4'>
        <div className='mb-8 text-center'>
          <h2 className='text-2xl font-bold'>Frequently Asked Questions</h2>
          <p className='mt-2 text-muted-foreground'>Learn more about our CSV translation tool</p>
        </div>

        <div className='mx-auto max-w-3xl'>
          <Accordion type='single' collapsible className='w-full'>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
