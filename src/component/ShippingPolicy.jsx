import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const ShippingPolicy = ({ open, setOpen }) => {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[60]"
        onClick={() => setOpen(false)}
      />
      <div className="fixed inset-0 sm:inset-4 md:inset-8 bg-white z-[70] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b bg-gray-950 shrink-0">
          <div>
            <h2 className="text-xl font-black text-white">
              🚚 Shipping Policy
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Last updated: May 2026
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 max-w-3xl mx-auto w-full">
          <div className="flex flex-col gap-6 text-gray-700 text-sm leading-relaxed">
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                Shipping Policy
              </h1>
              <p>
                At OBISCO Store, we strive to deliver your orders as quickly and
                safely as possible. This policy explains how we handle delivery
                of physical products ordered through our website.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900 mb-2">
                1. Shipping Locations
              </h2>
              <p>
                We currently ship to all states across <strong>Nigeria</strong>.
                We do not currently offer international shipping.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900 mb-2">
                2. Delivery Times & Fees
              </h2>
              <div className="overflow-x-auto mt-2">
                <table className="w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 border border-gray-200">
                        Location
                      </th>
                      <th className="text-left p-3 border border-gray-200">
                        Delivery Time
                      </th>
                      <th className="text-left p-3 border border-gray-200">
                        Shipping Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-gray-200">
                        Enugu State
                      </td>
                      <td className="p-3 border border-gray-200">
                        1–2 business days
                      </td>
                      <td className="p-3 border border-gray-200">
                        ₦500 – ₦1,000
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border border-gray-200">
                        South East Nigeria
                      </td>
                      <td className="p-3 border border-gray-200">
                        2–4 business days
                      </td>
                      <td className="p-3 border border-gray-200">
                        ₦1,000 – ₦2,000
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-gray-200">
                        Lagos & Abuja
                      </td>
                      <td className="p-3 border border-gray-200">
                        2–5 business days
                      </td>
                      <td className="p-3 border border-gray-200">
                        ₦1,500 – ₦3,000
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 border border-gray-200">
                        Other States
                      </td>
                      <td className="p-3 border border-gray-200">
                        3–7 business days
                      </td>
                      <td className="p-3 border border-gray-200">
                        ₦2,000 – ₦4,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-gray-500 text-xs">
                Note: Delivery times are estimates and may vary due to logistics
                or public holidays.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900 mb-2">
                3. Order Processing
              </h2>
              <p>
                Orders are processed within <strong>1–2 business days</strong>{" "}
                after payment confirmation. Orders placed on weekends or public
                holidays will be processed the next business day.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900 mb-2">
                4. Payment Before Shipment
              </h2>
              <p className="mb-2">
                All orders must be paid before shipment. We accept the following
                payment methods:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>
                  Online payment via <strong>Paystack</strong> (debit card, bank
                  transfer, USSD)
                </li>
                <li>Direct bank transfer (details provided at checkout)</li>
                <li>Mobile money transfer</li>
              </ul>
              <p className="mt-2">
                Payment confirmation is required before your order is processed
                and shipped.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900 mb-2">
                5. Order Tracking
              </h2>
              <p>
                Once your order is shipped, you will receive a tracking number
                via email or WhatsApp to monitor your delivery.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900 mb-2">
                6. Failed Delivery
              </h2>
              <p>
                If a delivery attempt fails due to an incorrect address or
                unavailability, we will contact you to reschedule. Additional
                charges may apply for re-delivery.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900 mb-2">
                7. VTU Services
              </h2>
              <p>
                VTU services (airtime, data, electricity, cable TV) are
                delivered <strong>instantly</strong> and digitally. No physical
                shipping is required.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900 mb-2">
                8. Contact Us
              </h2>
              <p>For shipping-related inquiries:</p>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-2">
                <p>
                  <strong>OBISCO Store</strong>
                </p>
                <p>
                  📍 Plot 928 Amokpo Umuchigbo Ujem Nike, Enugu State, Nigeria
                </p>
                <p>📧 Email: obiscostore1@gmail.com</p>
                <p>📱 WhatsApp: +234 904 986 3067</p>
                <p>🌐 Website: obisco.store</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
