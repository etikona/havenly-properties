export type LeadType = "buyer" | "landowner" | "contact";

export interface Lead {
  _id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  message?: string;
  // Buyer-specific
  projectInterest?: string;
  budget?: string;
  // Landowner-specific
  landLocation?: string;
  landSizeKatha?: number;
  isRead: boolean;
  createdAt: Date;
}

// Inquiry form inputs (validated before API call)
export type BuyerInquiryInput = Omit<
  Lead,
  "_id" | "isRead" | "createdAt" | "type"
> & {
  type: "buyer";
};

export type LandownerInquiryInput = Omit<
  Lead,
  "_id" | "isRead" | "createdAt" | "type"
> & {
  type: "landowner";
};
