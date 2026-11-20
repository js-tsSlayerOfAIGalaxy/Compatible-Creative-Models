import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { BookingInquiry } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  modelName: string;
  agencyName: string;
  bookingEmail: string;
  onClose: () => void;
}

const INITIAL_FORM: BookingInquiry = {
  clientName: '',
  brandOrAgency: '',
  email: '',
  shootType: 'Campaign Shoot',
  dates: '',
  location: 'London / Warsaw',
  brief: '',
};

export function BookingModal({
  isOpen,
  modelName,
  agencyName,
  bookingEmail,
  onClose,
}: BookingModalProps) {
  const [form, setForm] = useState<BookingInquiry>(INITIAL_FORM);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.email.trim() || !form.brief.trim()) {
      setError('Please complete your name, email, and project brief.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setForm(INITIAL_FORM);
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${modelName} — ${agencyName}`}
    >
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#0A0A0C] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500 mb-1">
              {agencyName} · {bookingEmail}
            </p>
            <h2 className="font-display text-3xl text-zinc-100">
              Book {modelName} · {agencyName}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Close booking dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-[#D4AF37] mx-auto stroke-[1.5]" />
            <h3 className="font-display text-2xl text-zinc-100">Booking Brief Recorded</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Your {form.shootType.toLowerCase()} inquiry for{' '}
              <span className="text-zinc-200">{form.brandOrAgency || form.clientName}</span> has been
              prepared for {agencyName}. Direct confirmation will arrive at{' '}
              <span className="font-mono text-zinc-200">{form.email}</span>.
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-2 px-6 py-2.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white transition-colors"
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-950/30 text-xs text-rose-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="booking-name">
                  Your Name
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="Camille Laurent"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="booking-brand">
                  Brand / Publication
                </label>
                <input
                  id="booking-brand"
                  type="text"
                  value={form.brandOrAgency}
                  onChange={(e) => setForm({ ...form, brandOrAgency: e.target.value })}
                  placeholder="Maison Margiela / Vogue"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="booking-email">
                  Contact Email
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="casting@maison.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="booking-type">
                  Assignment Type
                </label>
                <select
                  id="booking-type"
                  value={form.shootType}
                  onChange={(e) => setForm({ ...form, shootType: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option>Editorial Shoot</option>
                  <option>Runway Presentation</option>
                  <option>Global Campaign</option>
                  <option>Beauty / Fragrance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="booking-dates">
                  Target Dates
                </label>
                <input
                  id="booking-dates"
                  type="text"
                  value={form.dates}
                  onChange={(e) => setForm({ ...form, dates: e.target.value })}
                  placeholder="December 12–14, 2026"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="booking-location">
                  Shoot Location
                </label>
                <input
                  id="booking-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Paris"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5" htmlFor="booking-brief">
                Creative Brief &amp; Usage
              </label>
              <textarea
                id="booking-brief"
                rows={3}
                value={form.brief}
                onChange={(e) => setForm({ ...form, brief: e.target.value })}
                placeholder="Describe look count, usage rights, and call times..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#050505] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold bg-zinc-100 text-[#050505] rounded-lg hover:bg-white transition-colors"
              >
                Send Booking Brief
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
