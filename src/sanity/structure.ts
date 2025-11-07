// src/sanity/structure.ts
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Our singleton type
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      
      S.divider(),

      // Regular document types
      ...S.documentTypeListItems().filter(
        (item) =>
          !['service', 'project', 'testimonial'].includes(
            item.getId() || ''
          )
      ),
    ])