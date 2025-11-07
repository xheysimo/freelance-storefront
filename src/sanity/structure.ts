// src/sanity/structure.ts
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('order').title('Orders'), // <-- 1. ADD
      S.divider(),                                    // <-- 2. ADD
      
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('briefForm').title('Project Brief Forms'),
      
      S.divider(),

      // Regular document types
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            'order', // <-- 3. ADD
            'service', 
            'project', 
            'testimonial', 
            'briefForm'
          ].includes(
            item.getId() || ''
          )
      ),
    ])