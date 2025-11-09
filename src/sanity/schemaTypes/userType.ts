// src/sanity/schemaTypes/userType.ts
import {defineField, defineType} from 'sanity'

export const userType = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'password',
      title: 'Password (Hashed)',
      type: 'string',
      readOnly: true,
      hidden: true, 
    }),
    
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: 'passwordResetToken',
      title: 'Password Reset Token',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'passwordResetExpires',
      title: 'Password Reset Expires',
      type: 'datetime',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
})