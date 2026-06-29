import React from "react";
import {
  FaFacebookSquare,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

function Footer({
  setPrivacyOpen,
  setTermsOpen,
  setRefundOpen,
  setShippingOpen,
}) {
  return (
    <div className="bg-gray-950 text-gray-300 mt-16">
      <div className="max-w-[1240px] mx-auto py-16 px-8 grid lg:grid-cols-5 md:grid-cols-2 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <p className="text-gray-500 text-xs mt-1">
              Obisco Prime Limited (RC-9542773)
            </p>
            <p className="text-orange-500 text-xs font-semibold tracking-widest mt-1">
              Shop Dey Go! 🛒
            </p>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            OBISCO STORE is Nigeria's growing online marketplace where you can
            shop for anything — from everyday essentials to premium products,
            pay your bills, and enjoy fast delivery across Nigeria.
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="https://www.facebook.com/share/1Ke2BTu7dD/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <FaFacebookSquare size={26} />
            </a>
            <a
              href="https://www.instagram.com/obisco_gadgets?igsh=MTNkOHgyOGVpYXBnMQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-pink-500 transition"
            >
              <FaInstagram size={26} />
            </a>
            <a
              href="https://www.tiktok.com/@obisco_gadgets?_r=1&_t=ZT-95PuaHLecEX"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <FaTiktok size={26} />
            </a>
            <a
              href="https://wa.me/2348145674093"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-green-500 transition"
            >
              <FaWhatsapp size={26} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h6 className="font-bold text-white text-sm uppercase tracking-widest mb-4">
            Shop
          </h6>
          <ul className="flex flex-col gap-2">
            {["Gadgets & Electronics", "Fashion & Clothing", "Pay Bills"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-orange-500 transition"
                  >
                    {item}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h6 className="font-bold text-white text-sm uppercase tracking-widest mb-4">
            Contact Us
          </h6>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3">
              <MdPhone size={20} className="text-orange-500 shrink-0" />
              <a
                href="tel:+2348145674093"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                +234 814 567 4093
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MdEmail size={20} className="text-orange-500 shrink-0" />
              <a
                href="mailto:obiscolmt@gmail.com"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                obiscolmt@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaWhatsapp size={20} className="text-green-500 shrink-0" />

              <a
                href="https://wa.me/2348145674093"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-gray-400 hover:text-green-500 transition"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>

          {/* Customer Service */}
          <h6 className="font-bold text-white text-sm uppercase tracking-widest mb-4 mt-8">
            Customer Service
          </h6>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                Track My Order
              </a>
            </li>
            <li>
              <button
                onClick={() => setRefundOpen(true)}
                className="text-sm text-gray-400 hover:text-orange-500 transition text-left"
              >
                Refund Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => setShippingOpen(true)}
                className="text-sm text-gray-400 hover:text-orange-500 transition text-left"
              >
                Shipping Policy
              </button>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                Payment Guide
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                FAQs
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1240px] mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 OBISCO STORE. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-xs text-gray-500 hover:text-orange-500 transition"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTermsOpen(true)}
              className="text-xs text-gray-500 hover:text-orange-500 transition"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setRefundOpen(true)}
              className="text-xs text-gray-500 hover:text-orange-500 transition"
            >
              Refund Policy
            </button>
            <button
              onClick={() => setShippingOpen(true)}
              className="text-xs text-gray-500 hover:text-orange-500 transition"
            >
              Shipping Policy
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">We accept:</span>
            <span className="bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded">
              Debit Card
            </span>
            <span className="bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded">
              Bank Transfer
            </span>
            <span className="bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded">
              USSD
            </span>
            <span className="bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded">
              Paystack ✅
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
