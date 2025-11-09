// src/app/book/submit-brief/actions.ts
'use server'

import { sanityMutationClient } from "@/sanity/lib/mutationClient";

interface ProjectBrief {
  title: string
  fields: any[]
}

interface BriefDataResult {
  orderId: string;
  briefData: ProjectBrief;
  error?: string;
}

export async function getBriefDataForOrder(orderId: string): Promise<BriefDataResult> {
  if (!orderId) {
    return { error: 'Order ID is missing.', orderId: '', briefData: { title: '', fields: [] } };
  }

  try {
    const order = await sanityMutationClient.fetch<any>(
      `*[_type == "order" && _id == $orderId][0]{
        "orderId": _id,
        projectBrief,
        service->{
          projectBrief->{
            title,
            fields
          }
        }
      }`,
      { orderId }
    );

    if (!order) {
      throw new Error('No matching order found.');
    }

    if (order.projectBrief !== 'Pending submission...') {
      return { 
        error: 'This project brief has already been submitted.', 
        orderId: order.orderId, 
        briefData: order.service.projectBrief 
      };
    }
    
    if (!order.service?.projectBrief) {
      throw new Error('No project brief is associated with this service.');
    }

    return {
      orderId: order.orderId,
      briefData: order.service.projectBrief
    };

  } catch (err: any) {
    console.error("Error fetching brief data:", err.message);
    return { error: err.message, orderId: '', briefData: { title: '', fields: [] } };
  }
}