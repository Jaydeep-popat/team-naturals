import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  UserIcon, 
  SmartphoneIcon, 
  CreditCardIcon, 
  SettingsIcon, 
  CookieIcon, 
  Share2Icon, 
  LockIcon, 
  ShieldCheckIcon, 
  HistoryIcon, 
  BabyIcon, 
  ExternalLinkIcon, 
  RefreshCcwIcon, 
  ScaleIcon, 
  MailIcon 
} from 'lucide-react';
import { LegalPage, LegalSection, TodoPlaceholder } from '@/src/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | Team Naturals',
  description:
    'How Team Naturals collects, uses, and protects your personal information when you shop for handmade natural soaps and skincare.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Team Naturals',
    description: 'Learn how Team Naturals protects your privacy and handles your personal information securely.',
    url: '/privacy',
    type: 'website',
    siteName: 'Team Naturals',
  },
};

const SECTIONS = [
  { id: 'info-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Information' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'sharing', label: 'How We Share Information' },
  { id: 'security', label: 'Data Storage & Security' },
  { id: 'your-rights', label: 'Your Rights' },
  { id: 'retention', label: 'Data Retention' },
  { id: 'childrens', label: "Children's Privacy" },
  { id: 'third-party', label: 'Third-Party Links' },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'grievance', label: 'Grievance Officer' },
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

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      badge="Legal"
      description="We believe in complete transparency. Here is exactly what we collect, why we need it, and how we protect it."
      sections={SECTIONS}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy",
            "url": "https://teamnaturals.in/privacy",
            "description": "How Team Naturals collects, uses, and protects your personal information when you shop for handmade natural soaps and skincare.",
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
          Team Naturals (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;) operates{' '}
          <Link href="https://teamnaturals.in" className="font-semibold text-forest underline underline-offset-2 hover:text-terracotta transition-colors">
            teamnaturals.in
          </Link>{' '}
          and is committed to protecting the privacy of everyone who visits our Site or purchases our handcrafted products.
        </p>
      </div>

      <LegalSection id="info-we-collect" number="1" title="Information We Collect">
        <SubSection icon={UserIcon} title="Information you give us directly">
          <BulletList items={[
            "Name, email address, and phone number when you create an account or place an order.",
            "Delivery address (including PIN code) for accurate order fulfilment.",
            "OTP verification data used to securely confirm your phone number.",
            "Order history, product preferences, and any specific notes you add at checkout.",
            "Information you submit through our contact form, wholesale enquiry, or WhatsApp."
          ]} />
        </SubSection>

        <SubSection icon={SmartphoneIcon} title="Information collected automatically">
          <BulletList items={[
            "Device and browser information, IP address, and approximate geographical location.",
            "Pages visited, time spent on the Site, and navigation paths (via cookies).",
            "App installation and usage data if you install Team Naturals as a Progressive Web App (PWA)."
          ]} />
        </SubSection>

        <SubSection icon={CreditCardIcon} title="Payment Information">
          <p className="text-forest/80 leading-relaxed">
            We <strong className="text-forest">do not</strong> store your card, UPI, or net-banking details on our servers. All payments are processed securely by our trusted third-party payment gateway partner, which handles your data in strict accordance with RBI guidelines and PCI-DSS security standards.
          </p>
        </SubSection>
      </LegalSection>

      <LegalSection id="how-we-use" number="2" title="How We Use Your Information">
        <p className="text-forest/80 mb-4">We use the information we collect to:</p>
        <div className="rounded-2xl border border-forest/5 bg-white p-6">
          <BulletList items={[
            <span key="1"><strong className="text-forest">Fulfil Orders:</strong> Process, pack, and deliver your orders, and send updates via email or WhatsApp.</span>,
            <span key="2"><strong className="text-forest">Manage Accounts:</strong> Create and secure your account with OTP-based login.</span>,
            <span key="3"><strong className="text-forest">Support:</strong> Respond promptly to customer support queries and wholesale applications.</span>,
            <span key="4"><strong className="text-forest">Improve Experience:</strong> Analyze Site usage to improve our products and shopping interface.</span>,
            <span key="5"><strong className="text-forest">Marketing (Optional):</strong> Send offers, new launches, and newsletters only if you have explicitly opted in.</span>,
            <span key="6"><strong className="text-forest">Security:</strong> Detect and prevent fraud, abuse, or unauthorized access to our platform.</span>
          ]} />
        </div>
      </LegalSection>

      <LegalSection id="cookies" number="3" title="Cookies & Tracking Technologies">
        <div className="flex gap-4 items-start">
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
            <CookieIcon size={20} strokeWidth={2} />
          </div>
          <p className="text-forest/80 leading-relaxed flex-1">
            We use cookies and similar technologies to keep you logged in, remember items in your cart, and understand how visitors use our Site. You can disable cookies in your browser settings, though some parts of the Site (like your shopping cart) may not function properly without them.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="sharing" number="4" title="How We Share Your Information">
        <p className="text-forest/80 mb-4">
          We <strong className="text-forest">never sell</strong> your personal information. We only share it with trusted partners necessary to run our business:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Share2Icon, title: "Logistics Partners", desc: "To get your order to your doorstep." },
            { icon: CreditCardIcon, title: "Payment Gateways", desc: "To process your payment securely." },
            { icon: SmartphoneIcon, title: "Messaging Providers", desc: "For WhatsApp order updates and OTPs." },
            { icon: SettingsIcon, title: "Analytics Services", desc: "To help us understand and improve Site usage." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-forest/10 bg-white p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/5 text-forest">
                <item.icon size={18} strokeWidth={2} />
              </span>
              <div>
                <p className="font-bold text-forest text-sm">{item.title}</p>
                <p className="mt-1 text-xs text-forest/70">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-forest/70 italic">
          *We may also share information with law enforcement or regulators, but only where strictly required by law.
        </p>
      </LegalSection>

      <LegalSection id="security" number="5" title="Data Storage & Security">
        <div className="flex gap-4 items-start rounded-2xl border border-forest/10 bg-forest/5 p-6">
          <ShieldCheckIcon size={24} className="text-forest shrink-0 mt-0.5" />
          <p className="text-forest/80 leading-relaxed text-sm sm:text-base">
            We use reasonable technical and organisational safeguards including encryption in transit, access controls, and secure cloud hosting to protect your information. While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the Internet is 100% secure.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="your-rights" number="6" title="Your Rights">
        <p className="text-forest/80 mb-4">Depending on applicable law, you have the right to:</p>
        <div className="rounded-2xl border border-forest/10 bg-white p-6">
          <BulletList items={[
            <span key="1"><strong className="text-forest">Access</strong> the personal information we hold about you.</span>,
            <span key="2"><strong className="text-forest">Correct</strong> inaccurate or incomplete information (via the Account dashboard).</span>,
            <span key="3"><strong className="text-forest">Delete</strong> your account and associated personal data upon request.</span>,
            <span key="4"><strong className="text-forest">Opt-out</strong> of marketing messages at any time (reply STOP on WhatsApp, or click unsubscribe in emails).</span>
          ]} />
        </div>
        <p className="mt-6 text-forest/80">
          To exercise any of these rights, simply email us at{' '}
          <a href="mailto:info@teamnaturals.com" className="font-semibold text-forest underline underline-offset-2">info@teamnaturals.com</a>.
        </p>
      </LegalSection>

      <LegalSection id="retention" number="7" title="Data Retention">
        <div className="flex gap-4 items-start">
          <HistoryIcon size={24} className="text-forest/50 shrink-0" />
          <p className="text-forest/80 leading-relaxed">
            We retain your personal information only for as long as your account is active, or as needed to fulfil orders, comply with legal and tax obligations, resolve disputes, and enforce our agreements.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="childrens" number="8" title="Children's Privacy">
        <div className="flex gap-4 items-start">
          <BabyIcon size={24} className="text-forest/50 shrink-0" />
          <p className="text-forest/80 leading-relaxed">
            Our Site is not directed at children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will delete it.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="third-party" number="9" title="Third-Party Links">
        <div className="flex gap-4 items-start">
          <ExternalLinkIcon size={24} className="text-forest/50 shrink-0" />
          <p className="text-forest/80 leading-relaxed">
            Our Site may contain links to third-party websites (such as Instagram or payment gateways). We are not responsible for their privacy practices, and we encourage you to review their policies separately when leaving our Site.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="changes" number="10" title="Changes to This Policy">
        <div className="flex gap-4 items-start">
          <RefreshCcwIcon size={24} className="text-forest/50 shrink-0" />
          <p className="text-forest/80 leading-relaxed">
            We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision. Your continued use of the Site after changes constitutes your acceptance of the updated policy.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="grievance" number="11" title="Grievance Officer">
        <div className="rounded-2xl border border-forest/10 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4 border-b border-forest/10 pb-4">
            <ScaleIcon size={24} className="text-forest" />
            <h3 className="font-display text-lg font-bold text-forest">Regulatory Contact</h3>
          </div>
          <p className="text-sm text-forest/80 mb-5">
            In accordance with the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023, the contact details of our Grievance Officer are:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-forest/50">Name</p>
              <p className="mt-1 font-semibold text-forest">Team Naturals</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-forest/50">Email</p>
              <a href="mailto:info@teamnaturals.com" className="mt-1 block font-semibold text-forest hover:text-terracotta">info@teamnaturals.com</a>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-forest/50">Phone</p>
              <a href="tel:+919313010084" className="mt-1 block font-semibold text-forest hover:text-terracotta">+91 93130 10084</a>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-forest/50">Address</p>
              <p className="mt-1 font-semibold text-forest">Morbi, Gujarat, India</p>
            </div>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="contact" number="12" title="Contact Us">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-forest/5 p-6 flex flex-col items-center text-center">
            <MailIcon size={24} className="text-forest mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-forest/50 mb-1">Email</p>
            <a href="mailto:info@teamnaturals.com" className="text-sm font-semibold text-forest hover:text-terracotta">info@teamnaturals.com</a>
          </div>
          <div className="rounded-2xl bg-forest/5 p-6 flex flex-col items-center text-center">
            <SmartphoneIcon size={24} className="text-forest mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-forest/50 mb-1">WhatsApp</p>
            <a href="https://wa.me/919313010084" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-forest hover:text-terracotta">+91 93130 10084</a>
          </div>
          <div className="rounded-2xl bg-forest/5 p-6 flex flex-col items-center text-center">
            <UserIcon size={24} className="text-forest mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-forest/50 mb-1">Address</p>
            <p className="text-sm font-semibold text-forest">Morbi, Gujarat<br/>India</p>
          </div>
        </div>
      </LegalSection>
    </LegalPage>
  );
}
