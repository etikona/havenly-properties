'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitLead } from '@/lib/api';

type LeadType = 'buyer' | 'landowner' | 'contact';

const tabs: { id: LeadType; label: string; desc: string }[] = [
  { id: 'buyer', label: '🏠 Buyer Inquiry', desc: 'Interested in buying a unit' },
  { id: 'landowner', label: '🌿 Landowner JV', desc: 'Want to discuss a joint venture' },
  { id: 'contact', label: '✉️ General Contact', desc: 'Any other inquiry' },
];

export default function ContactSection() {
  const [activeType, setActiveType] = useState<LeadType>('buyer');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', message: '',
    projectInterest: '', budget: '', unitType: '',
    landLocation: '', landSize: '', landDocumentType: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await submitLead({ type: activeType, ...form });
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '', projectInterest: '', budget: '', unitType: '', landLocation: '', landSize: '', landDocumentType: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-stone-800 text-sm transition-all placeholder:text-stone-400';

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* Left info */}
          <div className="lg:col-span-2">
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-5">
              Let's Talk About<br />
              <span className="text-amber-600">Your Dream</span>
            </h2>
            <p className="text-stone-500 leading-relaxed mb-10">
              Whether you're a first-time buyer, an investor, or a landowner looking for
              a trusted partner — our team is ready to help you take the next step.
            </p>

            <div className="space-y-5">
              {[
                { icon: Phone, label: 'Call Us', value: '+880 1700-000000', href: 'tel:+8801700000000' },
                { icon: Mail, label: 'Email Us', value: 'info@realestate-bd.com', href: 'mailto:info@realestate-bd.com' },
                { icon: MapPin, label: 'Head Office', value: 'House 12, Road 5, Gulshan 2, Dhaka 1212', href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-600 flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-4 h-4 text-amber-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide">{label}</div>
                    <div className="text-stone-700 text-sm font-medium mt-0.5">{value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Office hours */}
            <div className="mt-10 p-5 bg-stone-50 rounded-xl border border-stone-100">
              <h4 className="text-sm font-bold text-stone-800 mb-3">Office Hours</h4>
              <div className="space-y-1.5 text-sm text-stone-500">
                <div className="flex justify-between"><span>Saturday – Thursday</span><span className="font-medium text-stone-700">9:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span>Friday</span><span className="font-medium text-stone-700">Closed</span></div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sm:p-8">

              {/* Tabs */}
              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveType(tab.id); setStatus('idle'); }}
                    className={cn(
                      'flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left sm:text-center',
                      activeType === tab.id
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Success state */}
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-14 h-14 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-bold text-stone-900 mb-2">Message Sent!</h3>
                  <p className="text-stone-500 text-sm mb-6">
                    Thank you for reaching out. Our team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Common fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                      <input required className={inputCls} placeholder="Md. Rahim Uddin" value={form.name} onChange={(e) => set('name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
                      <input className={inputCls} placeholder="01700 000000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                    <input required type="email" className={inputCls} placeholder="your@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </div>

                  {/* Buyer-specific */}
                  {activeType === 'buyer' && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Project Interest</label>
                          <input className={inputCls} placeholder="e.g. Skyline Residences" value={form.projectInterest} onChange={(e) => set('projectInterest', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Unit Type</label>
                          <select className={inputCls} value={form.unitType} onChange={(e) => set('unitType', e.target.value)}>
                            <option value="">Select unit type</option>
                            <option>2 Bedroom</option>
                            <option>3 Bedroom</option>
                            <option>4 Bedroom</option>
                            <option>Penthouse</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Budget Range</label>
                        <select className={inputCls} value={form.budget} onChange={(e) => set('budget', e.target.value)}>
                          <option value="">Select budget</option>
                          <option>Under 50 Lakh BDT</option>
                          <option>50 Lakh – 1 Crore BDT</option>
                          <option>1 – 2 Crore BDT</option>
                          <option>Above 2 Crore BDT</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Landowner-specific */}
                  {activeType === 'landowner' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Land Location</label>
                        <input className={inputCls} placeholder="e.g. Mirpur, Dhaka" value={form.landLocation} onChange={(e) => set('landLocation', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Land Size</label>
                        <input className={inputCls} placeholder="e.g. 10 Katha" value={form.landSize} onChange={(e) => set('landSize', e.target.value)} />
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Message</label>
                    <textarea rows={4} className={cn(inputCls, 'resize-none')} placeholder="Tell us more about your requirement..." value={form.message} onChange={(e) => set('message', e.target.value)} />
                  </div>

                  {/* Error */}
                  {status === 'error' && (
                    <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-amber-600/20"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
