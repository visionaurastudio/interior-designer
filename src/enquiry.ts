/** Lets other parts of the site (e.g. the 3D studio) pre-fill the enquiry form without importing it. */
export const ENQUIRY_EVENT = 'ssa:enquiry';

export interface EnquiryDraft {
  projectType?: string;
  message?: string;
}

export function sendEnquiryDraft(draft: EnquiryDraft) {
  window.dispatchEvent(new CustomEvent<EnquiryDraft>(ENQUIRY_EVENT, { detail: draft }));
}
