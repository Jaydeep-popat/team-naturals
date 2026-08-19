import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  InfoIcon, 
  UserCheckIcon, 
  KeyRoundIcon, 
  SparklesIcon, 
  CreditCardIcon, 
  ShoppingBagIcon, 
  TruckIcon, 
  RefreshCcwIcon, 
  PackageIcon, 
  CopyrightIcon, 
  ShieldAlertIcon, 
  ScaleIcon, 
  FileWarningIcon, 
  Globe2Icon, 
  BookOpenCheckIcon, 
  MailIcon, 
  SmartphoneIcon, 
  UserIcon 
} from 'lucide-react';
import { LegalPage, LegalSection, TodoPlaceholder } from '@/src/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Team Naturals',
  description:
    'Terms of use and sale for teamnaturals.in — orders, pricing, shipping, and product terms for our handmade natural skincare.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | Team Naturals',
    description: 'Read the terms of use and sale for Team Naturals, including orders, pricing, shipping, and product information.',
    url: '/terms',
    type: 'website',
    siteName: 'Team Naturals',
  },
};

const SECTIONS = [
  { id: 'about-us', label: 'About Us' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'account', label: 'Account Registration' },
  { id: 'products', label: 'Products & Variations' },
  { id: 'pricing', label: 'Pricing & Payment' },
  { id: 'orders', label: 'Orders & Cancellations' },
  { id: 'shipping', label: 'Shipping & Delivery' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'wholesale', label: 'Wholesale & Bulk Orders' },
  { id: 'ip', label: 'Intellectual Property' },
  { id: 'acceptable-use', label: 'Acceptable Use' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'indemnification', label: 'Indemnification' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'changes', label: 'Changes to These Terms' },
  { id: 'contact', label: 'Contact Us' },
];

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest/40" />
          <span className="text-forest/80 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SubSection({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-forest/10 bg-white/50 p-6 sm:p-8">
      <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-forest mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest/10 text-forest">
          <Icon size={16} strokeWidth={2} />
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      badge="Legal"
      description="By accessing our Site or placing an order, you agree to be bound by these terms. Please read them carefully before purchasing."
      sections={SECTIONS}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms & Conditions",
            "url": "https://teamnaturals.in/terms",
            "description": "Terms of use and sale for teamnaturals.in — orders, pricing, shipping, and product terms for our handmade natural skincare.",
            "publisher": {
              "@type": "Organization",
              "name": "Team Naturals"
            }
          })
        }}
      />

      {/* Intro / Last Updated */}
      <div className="rounded-2xl border border-forest/10 bg-cream-soft p-6 text-sm text-forest/70 shadow-sm mb-10">
        <p>
          <strong className="text-forest">Last updated:</strong> <span className="font-semibold text-forest">August 18, 2026</span>
        </p>
        <p className="mt-2">
          Welcome to Team Naturals. These Terms & Conditions (&quot;Terms&quot;) govern your use of{' '}
          <Link href="https://teamnaturals.in" className="font-semibold text-forest underline underline-offset-2 hover:text-terracotta transition-colors">
            teamnaturals.in
          </Link>{' '}
          and any purchase you make from our store.
        </p>
      </div>

      <LegalSection id="about-us" number="1" title="About Us">
        <div className="flex gap-4 items-start">
          <InfoIcon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            Team Naturals is a handmade, natural skincare brand based in Morbi, Gujarat, India, offering cold-processed soaps and a clay face wash crafted meticulously in small batches.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="eligibility" number="2" title="Eligibility">
        <div className="flex gap-4 items-start">
          <UserCheckIcon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            You must be at least 18 years old, or be using the Site under the strict supervision of a parent or guardian, and be fully capable of entering into a legally binding contract to place an order with us.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="account" number="3" title="Account Registration">
        <div className="rounded-2xl border border-forest/10 bg-white p-6">
          <h4 className="flex items-center gap-2 font-display text-base font-bold text-forest mb-3">
            <KeyRoundIcon size={16} className="text-forest/60" /> Account Responsibilities
          </h4>
          <BulletList items={[
            <span key="1">You may need to create an account (via mobile number and OTP verification) to place an order or track history.</span>,
            <span key="2">You are entirely responsible for keeping your account and OTP access secure, and for all activity that occurs under your account.</span>,
            <span key="3">If you suspect unauthorised use of your account, notify us immediately at <a href="mailto:info@teamnaturals.com" className="font-semibold text-forest underline underline-offset-2">info@teamnaturals.com</a>.</span>
          ]} />
        </div>
      </LegalSection>

      <LegalSection id="products" number="4" title="Products & Variations">
        <div className="rounded-2xl border border-forest/10 bg-white p-6">
          <h4 className="flex items-center gap-2 font-display text-base font-bold text-forest mb-3">
            <SparklesIcon size={16} className="text-forest/60" /> Handmade Disclaimer
          </h4>
          <BulletList items={[
            <span key="1">All products are handmade in small batches using natural ingredients. Slight variations in colour, texture, weight, and fragrance between batches are normal and are not considered defects.</span>,
            <span key="2">We make every reasonable effort to display product colours and details accurately, but actual products may vary slightly from images due to screen settings.</span>,
            <span key="3"><strong className="text-forest">Patch Test Recommended:</strong> As with any botanical skincare product, we highly recommend a patch test before full use. Discontinue use and consult a doctor if irritation occurs. Our products are not a substitute for professional medical or dermatological advice.</span>
          ]} />
        </div>
      </LegalSection>

      <LegalSection id="pricing" number="5" title="Pricing & Payment">
        <div className="flex gap-4 items-start rounded-2xl border border-forest/10 bg-forest/5 p-6">
          <CreditCardIcon size={24} className="text-forest shrink-0 mt-0.5" />
          <div className="flex-1">
            <BulletList items={[
              "All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless explicitly stated otherwise.",
              "We accept the payment methods shown at checkout, securely processed through our integrated payment gateway.",
              "We reserve the right to change product prices at any time without prior notice; the price charged will always be the price displayed when you place your order."
            ]} />
          </div>
        </div>
      </LegalSection>

      <LegalSection id="orders" number="6" title="Order Acceptance & Cancellation">
        <SubSection icon={ShoppingBagIcon} title="Placing & Cancelling Orders">
          <BulletList items={[
            <span key="1">Placing an order constitutes an offer to buy; it is confirmed only once we accept it (via order confirmation email/WhatsApp) and payment is verified.</span>,
            <span key="2">We reserve the right to cancel or refuse any order — e.g., due to stock unavailability, pricing errors, suspected fraud, or delivery restrictions. We will refund any amount already paid in such cases.</span>,
            <span key="3">You may cancel an order before dispatch by contacting us via WhatsApp or email. Once dispatched, our standard <Link href="/returns" className="font-semibold text-forest underline underline-offset-2">Returns & Refunds Policy</Link> applies.</span>
          ]} />
        </SubSection>
      </LegalSection>

      <LegalSection id="shipping" number="7" title="Shipping & Delivery">
        <div className="flex gap-4 items-start">
          <TruckIcon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            Shipping timelines, charges, and coverage zones are detailed comprehensively on our{' '}
            <Link href="/shipping" className="font-semibold text-forest underline underline-offset-2 hover:text-terracotta">
              Shipping & Delivery
            </Link>{' '}
            page, which forms an integral part of these Terms. We currently ship within India only.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="returns" number="8" title="Returns, Refunds & Exchanges">
        <div className="flex gap-4 items-start">
          <RefreshCcwIcon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            Please refer to our{' '}
            <Link href="/returns" className="font-semibold text-forest underline underline-offset-2 hover:text-terracotta">
              Returns & Refunds Policy
            </Link>{' '}
            for eligibility, timelines, and the exact process. As our products are personal care items, returns are subject to strict hygiene and product-condition requirements described therein.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="wholesale" number="9" title="Wholesale & Bulk Orders">
        <div className="flex gap-4 items-start rounded-2xl border border-forest/10 bg-white p-6">
          <PackageIcon size={24} className="text-forest shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed flex-1">
            Wholesale pricing, minimum order quantities, and delivery terms are outlined on our{' '}
            <Link href="/wholesale" className="font-semibold text-forest underline underline-offset-2 hover:text-terracotta">
              Wholesale
            </Link>{' '}
            page and may be subject to a separate B2B agreement or specific invoice terms. Standard consumer return/exchange terms do not apply to bulk orders unless agreed in writing.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="ip" number="10" title="Intellectual Property">
        <div className="flex gap-4 items-start">
          <CopyrightIcon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            All content on this Site — including our brand name, logo, product photography, packaging design, written content, and site architecture — is the exclusive property of Team Naturals and may not be copied, reproduced, or utilized without our express written permission.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="acceptable-use" number="11" title="Acceptable Use">
        <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-6">
          <h4 className="flex items-center gap-2 font-display text-base font-bold text-terracotta mb-3">
            <ShieldAlertIcon size={16} /> Restricted Actions
          </h4>
          <p className="text-terracotta/80 text-sm mb-3">You explicitly agree not to:</p>
          <ul className="space-y-3">
            {[
              "Use the Site for any unlawful purpose or in violation of these Terms.",
              "Attempt to gain unauthorised access to our systems, secure areas, or user accounts.",
              "Interfere with the Site's normal operation using bots, scraping scripts, or malicious code.",
              "Post false, misleading, defamatory, or infringing content (including fraudulent reviews)."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta/60" />
                <span className="text-terracotta/90 leading-relaxed text-sm sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </LegalSection>

      <LegalSection id="liability" number="12" title="Limitation of Liability">
        <div className="flex gap-4 items-start">
          <FileWarningIcon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            To the maximum extent permitted by law, Team Naturals shall not be liable for indirect, incidental, or consequential damages arising from your use of the Site or our products, including allergic reactions resulting from a failure to patch-test or from pre-existing skin sensitivities not disclosed to us. Our total cumulative liability for any claim relating to an order shall never exceed the actual amount you paid for that specific order.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="indemnification" number="13" title="Indemnification">
        <div className="flex gap-4 items-start">
          <ScaleIcon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            You agree to indemnify, defend, and hold Team Naturals and its affiliates harmless from any claims, losses, liabilities, or damages (including legal fees) arising out of your misuse of the Site, your violation of these Terms, or your infringement of any third-party rights.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="governing-law" number="14" title="Governing Law & Jurisdiction">
        <div className="flex gap-4 items-start">
          <Globe2Icon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            These Terms are governed strictly by the laws of India. Any disputes arising in connection with these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the competent courts located in Morbi / Rajkot, Gujarat.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="changes" number="15" title="Changes to These Terms">
        <div className="flex gap-4 items-start">
          <BookOpenCheckIcon size={24} className="text-forest/50 shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed">
            We may revise these Terms periodically to reflect changes in the law or our business practices. The &quot;Last updated&quot; date at the top reflects the most recent revision. Your continued use of the Site after changes are posted constitutes your binding acceptance of those changes.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="contact" number="16" title="Contact Us">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-forest/5 p-6 flex flex-col items-center text-center">
            <MailIcon size={24} className="text-forest mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-forest/50 mb-1">Email Support</p>
            <a href="mailto:info@teamnaturals.com" className="text-sm font-semibold text-forest hover:text-terracotta">info@teamnaturals.com</a>
          </div>
          <div className="rounded-2xl bg-forest/5 p-6 flex flex-col items-center text-center">
            <SmartphoneIcon size={24} className="text-forest mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-forest/50 mb-1">WhatsApp</p>
            <a href="https://wa.me/919313010084" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-forest hover:text-terracotta">+91 93130 10084</a>
          </div>
          <div className="rounded-2xl bg-forest/5 p-6 flex flex-col items-center text-center">
            <UserIcon size={24} className="text-forest mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-forest/50 mb-1">HQ Address</p>
            <p className="text-sm font-semibold text-forest">Morbi, Gujarat<br/>India</p>
          </div>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
