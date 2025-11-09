// src/sanity/structure.ts
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('order').title('Orders'),
      S.documentTypeListItem('quote').title('Quotes'),
      S.divider(),
      
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('briefForm').title('Project Brief Forms'),
      
      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            'order',
            'quote',
            'service', 
            'project', 
            'testimonial', 
            'briefForm'
          ].includes(
            item.getId() || ''
          )
      ),
    ])